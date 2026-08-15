# Skills

My collection of agent skills, distributed via [agent-skills-nix](https://github.com/Kyure-A/agent-skills-nix).

## List skills

```sh
nix eval .#catalogIds --json | jq -r '.[]' | sort
```

## Install skills

Use `agent-skills-nix` in the project's `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    agent-skills-nix.url = "github:Kyure-A/agent-skills-nix";
    skills = {
      url = "github:toshiki-higa/skills";
      flake = false;
    };
  };

  outputs = { nixpkgs, agent-skills-nix, skills, ... }:
    let
      system = "aarch64-darwin";
      pkgs = nixpkgs.legacyPackages.${system};
      lib = agent-skills-nix.lib.agent-skills;
      sources = { skills = { path = skills; }; };
      catalog = lib.discoverCatalog sources;
      selection = lib.selectSkills {
        inherit catalog sources;
        allowlist = [ "tooling/nix-setup" ];
      };
      bundle = lib.mkBundle { inherit pkgs selection; };
    in {
      devShells.${system}.default = pkgs.mkShell {
        shellHook = lib.mkShellHook {
          inherit pkgs bundle;
          targets.agents = lib.defaultLocalTargets.agents // { enable = true; };
        };
      };
    };
}
```

`nix develop` installs the selected skills into the project-local `.agents/skills` directory.

## Update installed skills

```sh
nix flake update skills # update the hub only
nix develop             # refresh .agents/skills
```

Add other skill repositories as `flake = false` inputs and include them in `sources`. The installed set still follows `allowlist`; updating does not enable new skills automatically.
