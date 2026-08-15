{
  description = "MoonBit development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    # Pin/Bump to a known-working rev deliberately. HEAD sometimes depends on packages marked broken.
    moonbit-overlay.url = "github:moonbit-community/moonbit-overlay/50118f5c3c0298b5cb17cc6f1c346165801014c8";

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
      moonbit-overlay,
      agent-skills-nix,
      skills,
      moonbit-skills,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        agentLib = agent-skills-nix.lib.agent-skills;
        hook =
          sources: allowlist:
          let
            catalog = agentLib.discoverCatalog sources;
            selection = agentLib.selectSkills { inherit catalog sources allowlist; };
            bundle = agentLib.mkBundle { inherit pkgs selection; };
            targets.agents = agentLib.defaultLocalTargets.agents // {
              enable = true;
            };
          in
          agentLib.mkShellHook { inherit pkgs bundle targets; };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            moonbit-overlay.packages.${system}.moon-patched_latest
          ];
          shellHook = ''
            # Install selected skills into .agents/skills (project-local).
            ${hook
              {
                skills = { path = skills; };
              }
              [
                "lang/moonbit-agent-guide"
              ]
            }
            # First enter: fetch mooncake registry when the module exists.
            if [ -f moon.mod.json ] && [ ! -d .mooncakes ]; then
              moon update 2>/dev/null || true
            fi
          '';
        };
      }
    );
}
