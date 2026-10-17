# Skills

My collection of agent skills, distributed via [agent-skills-nix](https://github.com/Kyure-A/agent-skills-nix).

## List skills

```sh
nix eval .#catalogIds --json | jq -r '.[]' | sort
```

## Install skills

Add the following to the project's `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    agent-skills-nix = {
      url = "github:Kyure-A/agent-skills-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    skills = {
      url = "github:toshiki-higa/skills";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.agent-skills-nix.follows = "agent-skills-nix";
    };
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      agent-skills-nix,
      skills,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        agentLib = agent-skills-nix.lib.agent-skills;
        selectedSkills = [
          "lang/typescript-practice"
          "lang/effect"
        ];
        selection = pkgs.lib.mapAttrs'
          (id: skill: pkgs.lib.nameValuePair (builtins.baseNameOf id) (skill // { id = builtins.baseNameOf id; }))
          (agentLib.selectSkills {
            inherit (skills) sources catalog;
            allowlist = selectedSkills;
          });
        skillsHook = agentLib.mkShellHook {
          inherit pkgs;
          bundle = agentLib.mkBundle { inherit pkgs selection; };
          targets.agents = agentLib.defaultLocalTargets.agents // { enable = true; };
        };
      in
      {
        devShells.default = pkgs.mkShell {
          shellHook = ''
            { ${skillsHook} } > /dev/null
          '';
        };
      }
    );
}
```

Set `selectedSkills` to the catalog IDs (`<group>/<skill>`) to install. `nix develop` installs them into `.agents/skills/<skill>`, including skills from external repositories. Use this hub as a flake input (not `flake = false`) so its `sources` and `catalog` include those external skills.

### Effect

`lang/effect` comes from [kitlangton/skills](https://github.com/kitlangton/skills) (MIT). It covers production TypeScript with **Effect v4**, including services/layers, schemas, configuration, scheduling, caching, streams, HTTP clients, and testing. Its `references/` directory is included with the skill; it is not an Effect v3 guide.

## Update installed skills

```sh
nix flake update skills # update the hub only
nix develop             # refresh .agents/skills
```

## Add external skills to this hub

Add a `flake = false` input in this hub's `flake.nix` and a corresponding entry in `sources`. For example, `lang/effect` is registered as:

```nix
# inputs
kitlangton-skills = {
  url = "github:kitlangton/skills";
  flake = false;
};

# sources
effect = {
  input = "kitlangton-skills";
  subdir = "skills/effect";
  idPrefix = "lang";
};
```

Then run `nix flake lock` to pin the new input and `nix eval .#catalogIds --json` to verify discovery. To update only the upstream Effect skill, run `nix flake update kitlangton-skills` in this hub.
