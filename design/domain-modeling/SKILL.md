---
name: domain-modeling
description: Use when deciding what exists, choosing data structures, or changing JSON/DB/API shapes. Grip the shape before code. Not DDD (aggregates, repos). Also use when a change would add flags, dummy rows, or "this is not a real X".
---

# Domain modeling

## Why domain modeling matters

When concepts are carved correctly and the data model reflects them faithfully, the natural implementation is the correct one, and whole classes of bugs lose their room to exist. Code cannot compensate for a wrong shape.

## Workflow

1. **Concepts — what exists**
   - Rephrase every new requirement in the vocabulary of existing concepts before turning it into screens or APIs.
   - If different actors would change two things for different reasons at different times, they are different concepts.
   - When a change demands a flag, a dummy row, or a "this is not a real X" caveat, two meanings have collided; re-carve the concept instead of patching the data.
   - Hold out for the one name that could not be anything else, because a name that never settles signals a missing or contradictory concept.
   - Apply YAGNI to speculative features, never to distinctions that reality requires.
2. **Topology — what belongs to what**
   - Decide what belongs to what, and defer storage formats to later steps.
   - Model containment as a tree by default, and materialize only the granularity you actually use.
   - Connect genuine many-to-many relationships and cycles by reference instead of forcing them into a tree.
3. **Behavior (optional)**
   - When the model is stateful or invariants span multiple operations, specify the concepts, actions, and invariants and verify them with a formal method (`quint` etc.), so that a wrong carving fails before it hardens into a schema.
4. **Schema — persistence/API**
   - Keep the schema a minimal, faithful image of the model: persist nothing that other data derives, keep keys short inside arrays, use tuples for immutable groups, and give each enum a single orthogonal dimension.
   - When creating or changing persistence or API shapes, show a concise before/after sample and get user agreement; implementation starts only after agreement.
