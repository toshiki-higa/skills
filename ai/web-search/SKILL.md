---
name: web-search
description: Use proactively this to search web content.
---

## Prereqirement

```sh
# get how to use mcpx (if needed)
mcpx --help
# get how to use server/tool
mcpx info <server> <tool>
```

## How to use

- Explore Internet (common case): `mcpx call parallel-search web_search {...require variables}`
- Find academic papers in arxiv: `mcpx call alphaxiv discover_papers {...require variables}`
- Find reference implementations: `mcpx call grep_app searchGitHub {...require variables}`
- Find Library Documents:

```sh
# 1. Search for the library
mcpx call resolve-library-id {...require variables}
# 2. Fetch documentation context
mcpx call query-docs {...require variables}
```
