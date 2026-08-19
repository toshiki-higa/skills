{
  description = "TypeScript development environment (nodejs + pnpm)";

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
          packages = [
            pkgs.nodejs_24
            pkgs.pnpm
          ];
          shellHook = ''
            # Install selected skills into .agents/skills (project-local).
            ${skillsHook}
            # Keep pnpm store/bin inside the project.
            export PNPM_HOME="$PWD/.pnpm"
            export PATH="$PNPM_HOME:$PATH"
            # Install deps only when lockfile is newer than the last install.
            if [ -f pnpm-lock.yaml ] && { [ ! -f node_modules/.pnpm/lock.yaml ] || [ pnpm-lock.yaml -nt node_modules/.pnpm/lock.yaml ]; }; then
              echo "Installing dependencies..."
              pnpm install --frozen-lockfile
            fi
          '';
        };
      }
    );
}
