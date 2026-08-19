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
      flake = false;
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
        ];
        sources = pkgs.lib.genAttrs
          (pkgs.lib.unique (map builtins.dirOf selectedSkills))
          (group: { path = skills; subdir = group; });
        selection = agentLib.selectSkills {
          inherit sources;
          catalog = agentLib.discoverCatalog sources;
          allowlist = map builtins.baseNameOf selectedSkills;
        };
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

Set `selectedSkills` to the `<group>/<skill>` paths to install. `nix develop` installs them into `.agents/skills`.

## Update installed skills

```sh
nix flake update skills # update the hub only
nix develop             # refresh .agents/skills
```

For other repositories, add a `flake = false` input and include it in `sources`.
