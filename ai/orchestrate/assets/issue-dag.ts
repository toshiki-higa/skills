#!/usr/bin/env node
import { execFileSync } from "node:child_process";

interface Issue {
  id: string;
  title: string;
  state: string;
  parent_id: string | null;
  blocked_by?: string[];
}

interface DagNode extends Issue {
  external: boolean;
}

const args = process.argv.slice(2);
const parentId = args.find((arg) => !arg.startsWith("-"));
const jsonOutput = args.includes("--json");

if (!parentId) {
  console.error("Usage: node issue-dag.ts <parent-id> [--json]");
  process.exit(2);
}

const bit = process.env.BIT_BIN ?? "bit";
const output = execFileSync(bit, ["issue", "list", "--all", "--format", "json"], {
  encoding: "utf8",
});
const issues = JSON.parse(output) as Issue[];
const byId = new Map(issues.map((issue) => [issue.id, issue]));
const children = new Map<string, Issue[]>();

for (const issue of issues) {
  if (issue.parent_id) {
    const siblings = children.get(issue.parent_id) ?? [];
    siblings.push(issue);
    children.set(issue.parent_id, siblings);
  }
}

const parent = byId.get(parentId);
if (!parent) {
  console.error(`Issue not found: ${parentId}`);
  process.exit(1);
}

const treeIds = new Set<string>();
const collectTree = (id: string): void => {
  if (treeIds.has(id)) return;
  treeIds.add(id);
  for (const child of children.get(id) ?? []) collectTree(child.id);
};
collectTree(parentId);

const graphIds = new Set(treeIds);
const collectDependencies = (id: string): void => {
  const issue = byId.get(id);
  if (!issue) return;
  for (const dependency of issue.blocked_by ?? []) {
    if (!graphIds.has(dependency)) {
      graphIds.add(dependency);
      collectDependencies(dependency);
    }
  }
};
for (const id of [...graphIds]) collectDependencies(id);

const nodes: DagNode[] = [...graphIds]
  .map((id) => byId.get(id))
  .filter((issue): issue is Issue => issue !== undefined)
  .map((issue) => ({ ...issue, external: !treeIds.has(issue.id) }));
const nodeById = new Map(nodes.map((node) => [node.id, node]));
const edges = nodes.flatMap((issue) =>
  (issue.blocked_by ?? [])
    .filter((dependency) => nodeById.has(dependency))
    .map((dependency) => ({ from: issue.id, to: dependency })),
);

const state = new Map<string, "visiting" | "visited">();
const stack: string[] = [];
const cycles: string[][] = [];

const visit = (id: string): void => {
  if (state.get(id) === "visiting") {
    const start = stack.indexOf(id);
    cycles.push([...stack.slice(start), id]);
    return;
  }
  if (state.get(id) === "visited") return;

  state.set(id, "visiting");
  stack.push(id);
  for (const edge of edges.filter((edge) => edge.from === id)) visit(edge.to);
  stack.pop();
  state.set(id, "visited");
};

for (const node of nodes) visit(node.id);

const result = {
  parent: { id: parent.id, title: parent.title, state: parent.state },
  nodes,
  edges,
  cycles,
};

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(cycles.length > 0 ? 1 : 0);
}

const title = (id: string): string => {
  const issue = nodeById.get(id);
  return issue ? `${issue.title} [${issue.state}]` : "unknown";
};

console.log(`#${parent.id} ${title(parent.id)}`);
const printTree = (id: string, prefix: string): void => {
  const descendants = children.get(id)?.filter((child) => treeIds.has(child.id)) ?? [];
  descendants.forEach((child, index) => {
    const last = index === descendants.length - 1;
    console.log(`${prefix}${last ? "└─" : "├─"} #${child.id} ${title(child.id)}`);
    printTree(child.id, `${prefix}${last ? "  " : "│ "}`);
  });
};
printTree(parentId, "");

const dagNodes = nodes.filter((node) => node.id !== parentId);
const dagEdges = edges.filter((edge) => edge.from !== parentId && edge.to !== parentId);
const dependents = new Map<string, string[]>();
for (const edge of dagEdges) {
  const blocked = dependents.get(edge.to) ?? [];
  blocked.push(edge.from);
  dependents.set(edge.to, blocked);
}

console.log("\nDependency DAG (blocker -> blocked):");
const printed = new Set<string>();
const printDag = (id: string, indent: string, connector: string, active: Set<string>): void => {
  if (active.has(id)) return;
  const issue = nodeById.get(id);
  if (!issue) return;
  printed.add(id);
  const marker = issue.external ? " [external]" : "";
  console.log(`${indent}${connector}#${id} ${title(id)}${marker}`);
  const next = new Set(active).add(id);
  const children = dependents.get(id) ?? [];
  children.forEach((child, index) => {
    const last = index === children.length - 1;
    const childIndent = connector ? `${indent}${last ? "   " : "│  "}` : indent;
    printDag(child, childIndent, last ? "└─ " : "├─ ", next);
  });
};

const roots = dagNodes.filter((node) => !(dagEdges.some((edge) => edge.from === node.id)));
for (const root of roots) printDag(root.id, "", "", new Set());
for (const node of dagNodes) {
  if (!printed.has(node.id)) printDag(node.id, "", "", new Set());
}

if (cycles.length === 0) {
  console.log("\nDAG validation: no cycles detected.");
} else {
  console.log("\nDAG validation: cycles detected.");
  for (const cycle of cycles) console.log(cycle.map((id) => `#${id}`).join(" -> "));
  process.exitCode = 1;
}
