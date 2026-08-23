---
name: create-mockup
description: Use only when the user explicitly asks to create a UI mockup.
---

# Create mockup

Build the mockup instead of describing it. Use it to settle UI decisions before production implementation.

## Workflow

1. Ask only for missing essentials: user goal, content, viewport, and visual constraints.
2. Copy the template to `.design/<slug>.html`.

```sh
mkdir -p .design
cp "$SKILL/asset/template.html" ".design/<slug>.html"
```

3. Build the requested mockup, open it in the browser, and fix obvious rendering problems before presenting it.
4. Iterate in place from the user's DOM Grab `<selected_element>` feedback.

## Rules

- For a new application, use daisyUI first.
- For an existing application without daisyUI, use Tailwind first.
- Keep the artifact framework-free and directly openable.
- Use semantic HTML, CDN assets, and only the minimum vanilla JavaScript needed for meaningful interaction.
