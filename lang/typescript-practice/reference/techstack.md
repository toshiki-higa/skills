
- Compute: Cloudflare Workers
- Database:
  - SQLite
    - Cloudflare D1: `@oselvar/kysely-cloudflare`
    - Turso: `@libsql/kysely-libsql`
  - Postgres: If Pessimistic Concurrency Control (PCC) is required
    - CockroachDB
    - PlanetScale for Postgres
- Send Email:
  - cloudflare email sending
  - zeptomail: highest cost performance, but transaction only
  - resend: Monthly free usage, but high price for large-scale use

[TODO]:
- Create SaaS Templete
  - Typescript:
    - Frontend:
      - UI: `solidjs`
      - Components: `ark-ui` || `daisyui`
      - Router: `@tanstack/router`
      - Server State: `@tanstack/query`
    - BFF: `hono`
    - Auth: `better-auth` || `hono/basic-auth`
  - Moonbit:
    -

[compute]
- cloudflare workers

[ui]
- [intentui](https://intentui.com/): ui components based react-aria-components

[observability]
- [rejourney](https://github.com/rejourneyco/rejourney): for mobile apps

[payment]
- [paykit](https://paykit.sh/)

[mail]
- cloudflare email sending
- zeptomail: highest cost performance, but transaction only
- resend: Monthly free usage, but high price for large-scale use

[domain]
- [spaceship](https://www.spaceship.com): cheapest domain register (by namecheap)

[ai-embedding]
- [ruri-v3(onnx)](https://zenn.dev/sirasagi62/articles/a75d0ba39f0125)

[gpu]
- google colab: free usage
- [vest.ai](https://vast.ai/): cheapest gpu resource
