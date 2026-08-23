{
  description = "toshiki-higa's agent skills hub";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    agent-skills-nix = {
      url = "github:Kyure-A/agent-skills-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    agent-browser = {
      url = "github:vercel-labs/agent-browser";
      flake = false;
    };
    moonbit = {
      url = "github:moonbitlang/skills";
      flake = false;
    };
    quint = {
      url = "github:quint-co/quint";
      flake = false;
    };
    mizchi-skills = {
      url = "github:mizchi/skills";
      flake = false;
    };
    impeccable = {
      url = "github:pbakaus/impeccable";
      flake = false;
    };
    daisyui = {
      url = "github:saadeghi/daisyui";
      flake = false;
    };
  };

  outputs =
    inputs@{ nixpkgs, agent-skills-nix, ... }:
    let
      lib = nixpkgs.lib;
      agentLib = import "${agent-skills-nix}/lib" { inherit lib inputs; };
      sources = {
        own = { path = ./.; };
        agent-browser = {
          input = "agent-browser";
          subdir = "skills/agent-browser";
          idPrefix = "tooling";
        };
        moonbit = {
          input = "moonbit";
          subdir = "skills";
          idPrefix = "lang";
        };
        quint = {
          input = "quint";
          subdir = "skills";
          idPrefix = "lang";
        };
        ast-grep-practice = {
          input = "mizchi-skills";
          subdir = "tooling/ast-grep-practice";
          idPrefix = "tooling";
        };
        impeccable = {
          input = "impeccable";
          subdir = "plugin/skills";
          idPrefix = "ui";
        };
        daisyui = {
          input = "daisyui";
          subdir = "skills/daisyui";
          idPrefix = "ui";
        };
      };
      catalog = agentLib.discoverCatalog sources;
    in
    {
      inherit sources catalog;
      catalogIds = lib.attrNames catalog;
    };
}
