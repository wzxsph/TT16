# TT16 Agent Guide

This file defines repository-wide rules for coding agents and automated contributors. Human contributors should also read `CONTRIBUTING.md`.

## Repository purpose

TT16 is an open-source, mobile-first trading-behavior personality project. It describes decision preferences; it does not evaluate investment skill, risk capacity, suitability, or expected returns. Every change must preserve the product's non-advisory and privacy-minimizing boundaries.

## Product surfaces

- `wrangler.jsonc`: legacy static visual demo; preserve it as a reference.
- `wrangler.commercial.jsonc`: local commercial app using local D1 and Mock payment.
- `wrangler.sandbox.jsonc`: public Cloudflare sandbox using remote D1 and Mock payment.
- `wrangler.commercial.production.example.jsonc`: disabled production example with placeholders; never deploy it as-is.

The public sandbox is not a real payment product. Keep visible sandbox disclosure on the paywall, policy dialog, README, and any promotional material. Never change Mock payment to a production environment: `paymentPolicy.ts` intentionally rejects production + Mock.

## Required invariants

1. The Worker is authoritative for commercial scoring, price, order, entitlement, refund, and report delivery.
2. Before entitlement, no API response may contain `typeCode`, profile name, dimensions, pressure scores, report text, family color, or a result-specific asset path.
3. One result and SKU may create only one order; one order may create only one entitlement.
4. Recovery and order authorization must use the matching high-entropy recovery credential and return non-enumerating errors.
5. Report tokens must use cryptographic randomness and be stored only as hashes.
6. Refund completion must revoke the entitlement and every active report token.
7. Never add client-controlled amount, SKU, score, type, payment-success, or entitlement fields.
8. Never store payment secrets, recovery credentials, private keys, personal financial data, or raw sensitive input in Git, `VITE_*`, events, logs, screenshots, fixtures, or support cases.
9. Do not collect broker credentials, holdings, income, debt, or risk-capacity data for personality scoring.
10. UI and content must not recommend securities, imply profit, rank types by ability, or present the result as a psychological diagnosis.

## Working method

- Inspect `git status` before editing and preserve unrelated or user-owned changes.
- Prefer a focused branch and small, reviewable commits.
- Use existing types, design tokens, components, and scripts before adding new abstractions.
- Do not modify generated assets by hand when a source asset or preparation script exists.
- Keep public documentation aligned with the deployed sandbox and current code; do not claim unfinished production capabilities.
- Conventional public files are `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `CODE_OF_CONDUCT.md`.

## Database changes

- Add a new numbered SQL migration; never rewrite a migration that may have reached remote D1.
- Keep migrations backward compatible with the currently deployed Worker whenever possible.
- Apply locally before testing, then apply to sandbox explicitly with `npm run db:migrate:sandbox`.
- Production D1 must be separate from sandbox D1.
- Never commit database dumps, `.wrangler/`, local backups, or real session/order/report data.

## Quality gate

Run these commands before committing application changes:

```bash
npm ci
npm run build
npm run typecheck:worker
npm test -- --run
npm run test:api:commercial
npm audit --audit-level=high
```

The API acceptance suite must continue covering paywall non-disclosure, concurrent completion/order/payment idempotency, report recovery, support authorization, refund state, and token revocation.

Documentation-only changes may skip runtime suites when they cannot affect code, but must still verify Markdown links, image paths, spelling, and `git diff --check`.

## Deployment

- Public sandbox: `npm run deploy:sandbox`.
- Verify after deployment: sandbox badge, `/api/health`, 20 questions, paywall non-disclosure, Mock fulfillment, refresh recovery, manual recovery, and refund request.
- Do not deploy the production example config.
- GitHub Pages must remain disabled unless the maintainer explicitly changes the hosting strategy. `.github/workflows/ci.yml` verifies code and must not deploy.
- Never deploy from an external contributor's pull request with repository secrets.

## Public-repository hygiene

- Treat every tracked file, commit message, branch, PR, issue, artifact, and screenshot as public.
- Run secret and personal-data checks before pushing. D1 IDs are resource identifiers, not credentials, but should still be replaced by contributors deploying to their own accounts.
- Do not publish internal budgets, acquisition strategy, private operational notes, user data, or real commercial records without an explicit maintainer decision.
- Screenshots must come from a controlled demo session and must not show order IDs, recovery credentials, report tokens, emails, IP addresses, logs, or browser/account chrome.
- Do not add a license, change the SPDX identifier, or relicense code/assets without explicit maintainer confirmation.

## Assets and user files

- Preserve `design/personality-masters*` and `public/images/personalities-v2` as versioned visual assets.
- `docs/images/` contains README marketing material and verified product screenshots. Keep source names stable when referenced by README.
- `参考图.png` is a user-provided local reference. Do not modify, delete, stage, or commit it unless the maintainer explicitly requests publication of that exact file.
- Generated visuals must be reviewed for text accuracy, non-advisory claims, and consistency with the TT16 low-poly style before being committed.

## Documentation and content

- Use plain language and explain acronyms on first use.
- Distinguish implemented behavior, sandbox behavior, and roadmap ideas.
- Keep Mock payment disclosure prominent anywhere price or checkout is shown.
- Profile copy should pair strengths with failure modes and end in observable actions.
- Cite authoritative sources for legal, security, financial, or behavioral-science claims; avoid unsupported validation claims.

## Security reporting

Do not open a public issue for a suspected vulnerability. Follow `SECURITY.md`, avoid reproducing attacks against the public sandbox, and include only the minimum proof needed for maintainers to reproduce safely.
