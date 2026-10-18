{ lib }:

catalog:
lib.mapAttrs'
  (id: skill:
    let
      rename = builtins.elem id [
        "lang/generate-program"
        "lang/audit-program"
      ];
      name = builtins.baseNameOf id;
      newId = if rename then "lang/foldkit-${name}" else id;
    in
    lib.nameValuePair newId (
      skill // lib.optionalAttrs rename {
        id = newId;
        transform = { original, dependencies }:
          lib.replaceStrings
            [ "name: ${name}\n" "../generate-program/" ]
            [ "name: foldkit-${name}\n" "../foldkit-generate-program/" ]
            original
          + "\n" + dependencies;
      }
    ))
  catalog
