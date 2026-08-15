---
name: fetch-url
description: Use proactively this to fetch web content.
---

1. Most site including pdfs

Use Exa:
```sh
# Step 0: get how to use mcpx (if needed)
mcpx --help
mcpx info exa web_fetch_exa
# Step 1: fetch web content
mcpx call exa web_fetch_exa '{"urls":["<url>"]}'
```

2. Only x.com

Use [defuddle](https://github.com/kepano/defuddle):
```sh
pnpm dlx defuddle parse --md "<url>"
```

3. Only arxiv.org

Use Alphaxiv:
```sh
mcpx call alphaxiv get_paper_content '{"url":"<url>"}'
```
