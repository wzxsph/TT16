# TT16 Agent Guide

This file defines repository-wide rules for coding agents and automated contributors. Human contributors should also read `CONTRIBUTING.md`.

## Repository purpose

TT16 is an open-source, mobile-first trading-behavior personality atlas and assessment. It describes decision preferences; it does not evaluate investment skill, risk capacity, suitability, or expected returns. Every change must preserve the product's non-advisory and privacy-minimizing boundaries.

## Product surfaces

- `apps/web`: the only Web application; React 19, Vite, local scoring, and static prerendering.
- `apps/weapp`: the Taro 4.2.1 / React 18 WeChat mini program; local scoring and local storage.
- `packages/core`: platform-independent questions, scoring, profiles, comparison, storage migration, and share-card models.
- GitHub Pages: the `/TT16/` static mirror built with `npm run build:pages`.
- `deploy/`: the not-yet-provisioned Hong Kong static-site and self-hosted analytics target.
- `ops/retired-sandbox`: a no-binding Worker that redirects pages and returns `410 Gone` for every `/api/*` request.
- `wrangler.jsonc`: a legacy static visual reference. Preserve it; it is not a product runtime.

The repository has no production business API, database binding, order, payment, entitlement, refund, recovery, support, or paid-content runtime.

## Required invariants

1. Assessment answers, progress, scoring, and reports stay on the current device. No answer or result may be sent to TT16 analytics, advertising, URLs, logs, or support channels.
2. All questions, reports, guides, printable sheets, comparisons, and share materials remain free. Never add payment, order, paywall, entitlement, rewarded unlock, or paid-material code.
3. Ads default to disabled. They may only use `atlas_mid`, `type_detail_end`, `compare_end`, or `tool_end`; never place ads in the home hero, assessment, processing state, report core, or share card.
4. Analytics is opt-in, respects DNT and local decline, has no persistent visitor ID, and only emits page/source plus the six fixed events in `apps/web/src/lib/analytics.ts`.
5. Result URLs, analytics, Open Graph metadata, and event names must not contain answers, dimension percentages, private-result payloads, or user identifiers. A share action may link to the matching public type page, whose code and copy are public.
6. Type comparisons are neutral. Never add compatibility scores, best matches, ability rankings, expected returns, security recommendations, or suitability claims.
7. Do not collect broker credentials, holdings, transactions, income, debt, identity details, or risk-capacity data for personality scoring.
8. UI and content must not recommend securities, imply profit, rank types by ability, or present a result as a psychological diagnosis.
9. Real AppIDs, ad-unit IDs, server IP addresses, SSH keys, analytics credentials, and other private configuration must never be committed or exposed through public build variables. Canonical site URLs are public once built.
10. The retired Worker must have no D1 binding or access. Preserve existing remote D1 data; do not delete it.
11. Adaptive guess traces, candidate weights, confirmations, and rejected types stay local and must not enter analytics. The 400 ms transition is interaction pacing, not a security or anti-abuse control.

## Working method

- Inspect `git status` before editing and preserve unrelated or user-owned changes.
- Prefer a focused branch and small, reviewable commits.
- Reuse `packages/core`, existing types, design tokens, components, and asset scripts before adding abstractions.
- Do not modify generated assets by hand when a source master or preparation script exists.
- Distinguish implemented behavior, disabled capability, and external-release prerequisites in public documentation.
- Keep `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, Issue templates, workflows, and code behavior aligned.

## Core and content changes

- Keep question/scoring versions at `tt16-q20-1.0.0` / `tt16-score20-1.0.0` unless a separately reviewed model change intentionally versions both behavior and migration.
- `ProfileV2` content must retain its fixed shape and pair strengths with observable overuse failure modes.
- Compute adjacent types by four-letter Hamming distance; do not hand-maintain relationships.
- Keep `packages/core` independent of React, DOM, browser storage, Canvas, and WeChat APIs.
- Preserve safe migration from `tt16:free:v1` to `tt16:assessment:v2`; malformed state must fail closed without uploading data.
- Keep adaptive guessing separately versioned at `tt16-guess-items-1.0.0` / `tt16-guess-policy-1.0.0`; it must not write `tt16:assessment:v2` or produce a formal report.
- Adaptive question changes must preserve the 200-item distribution, content checks, deterministic replay, controlled-repeat rules, and local-only storage migration.

## Quality gate

Run before committing application changes:

```bash
npm ci
npm run quality
```

The gate covers workspace type checks, core tests, content structure, both Web builds, prerender metadata, Playwright desktop/390px flows, WeChat build and sensitive-string scan, retired Worker behavior, local links, high-severity dependency audit, and `git diff --check`.

Documentation-only changes may skip runtime suites only when they cannot affect code, but must still run `npm run test:links` and `git diff --check`.

## Deployment

- GitHub Pages: `.github/workflows/deploy-pages.yml` is the only automatic public deployment.
- Hong Kong main site: `.github/workflows/deploy-hk.yml` is manual and requires protected environment secrets. It uploads a versioned release and atomically switches the `current` symlink.
- WeChat: CI builds but never publishes. Release only after WeChat DevTools manual checks and maintainer-supplied private AppID configuration.
- Retired sandbox: deploy `ops/retired-sandbox/wrangler.jsonc` explicitly after the free main site is live. Verify all old API paths return 410.
- Never enable analytics or ads merely because a build succeeds. Each requires its separate external configuration and privacy review.

## Public-repository hygiene

- Treat every tracked file, commit, branch, PR, issue, artifact, and screenshot as public.
- Run secret and personal-data checks before pushing. Do not publish internal budgets, private acquisition notes, user data, or operational credentials.
- Screenshots must come from controlled local/demo state and show no IDs, emails, IP addresses, account chrome, logs, or private configuration.
- Do not add a license, change the SPDX identifier, or relicense code/assets without explicit maintainer confirmation.

## Assets and user files

- Preserve `design/personality-masters*` and `public/images/personalities-v2` as versioned assets.
- `docs/images/` contains reviewed marketing material; keep referenced names stable.
- `参考图.png` is a user-provided local reference. Do not modify, delete, stage, or commit it unless the maintainer explicitly requests publication of that exact file.
- Review generated visuals for text accuracy, disclaimers, cropping, and the TT16 low-poly style before committing.

## Security reporting

Do not open a public issue for a suspected vulnerability. Follow `SECURITY.md`, avoid destructive testing against public deployments, and include only the minimum proof needed for maintainers to reproduce safely.
