# TT16 Agent Guide

## Product mode

TT16 has two distinct surfaces:

- `wrangler.jsonc`: legacy static visual demo; preserve it as a reference.
- `wrangler.commercial.jsonc`: local commercial app using local D1 and Mock payment.
- `wrangler.sandbox.jsonc`: public Cloudflare sandbox using remote D1 and Mock payment.

The public sandbox is not a real payment product. Keep visible sandbox disclosure on the paywall, policy dialog, and README. Never change Mock payment to a production environment: `paymentPolicy.ts` intentionally marks production + Mock as invalid.

## Required invariants

1. The Worker is the authority for commercial scoring, price, order, entitlement, refund, and report delivery.
2. Before entitlement, no API response may contain `typeCode`, profile name, dimensions, pressure scores, report text, family color, or a result-specific asset path.
3. One result and SKU may create only one order; one order may create only one entitlement.
4. Recovery and order authorization must use the matching high-entropy recovery credential and return non-enumerating errors.
5. Report tokens are generated with cryptographic randomness and stored only as hashes.
6. Refund completion revokes the entitlement and all active report tokens.
7. Do not add client-controlled amount, SKU, score, type, or payment success fields.
8. Never store payment secrets, recovery credentials, private keys, or personal financial data in Git, `VITE_*`, events, logs, or support cases.

## Database changes

- Add a new numbered SQL migration; never rewrite a migration that may have reached remote D1.
- Keep migrations backward compatible with the currently deployed Worker whenever possible.
- Apply locally before testing, then apply to sandbox explicitly with `npm run db:migrate:sandbox`.
- Production D1 must be separate from sandbox D1.

## Quality gate

Run all commands before committing commercial changes:

```bash
npm run build
npm run typecheck:worker
npm test -- --run
npm run test:api:commercial
npm audit --audit-level=high
```

The API acceptance test must continue covering paywall non-disclosure, concurrent completion/order/payment idempotency, report recovery, support authorization, refund state, and token revocation.

## Deployment

- Public sandbox: `npm run deploy:sandbox`.
- Check after deployment: sandbox badge, `/api/health`, 20 questions, paywall non-disclosure, Mock fulfillment, refresh recovery, manual recovery, and refund request.
- Do not deploy the production example config. It contains placeholders and `PAYMENT_MODE=disabled` intentionally.
- GitHub Pages must remain disabled; `.github/workflows/ci.yml` performs verification only and must not deploy.

## Assets and user files

- Preserve `design/personality-masters*` and `public/images/personalities-v2` as versioned visual assets.
- `参考图.png` is a user-provided local reference. Do not modify, delete, or commit it unless the user explicitly requests that exact asset be published.
- Use `apply_patch` for source and documentation edits, and avoid unrelated formatting churn.
