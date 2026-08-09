# Retired sandbox entry

This Worker replaces the former public sandbox without binding or accessing its retained D1 database.

- Every `/api` and `/api/*` request returns `410 Gone` with `Cache-Control: no-store`.
- Every other request returns a permanent `308` redirect to the free canonical site.
- The D1 database is intentionally not declared in `wrangler.jsonc`; retiring this Worker does not delete the remote resource.

Deploy only after the free canonical site is stable. The manual `retire-sandbox.yml` workflow supplies `FREE_SITE_URL` from its protected environment; for a local maintainer deployment, verify the target and use a pinned Wrangler release:

```bash
npx --yes wrangler@latest deploy \
  --config ops/retired-sandbox/wrangler.jsonc \
  --var FREE_SITE_URL:https://example.com/
```

After deployment, verify representative historical pages return 308 and every known and unknown `/api/*` path returns 410. Never add database, analytics, payment, or user-data bindings to this Worker.
