# TT16 Public Release Checklist

This checklist records the repository gates that must pass before changing `wzxsph/TT16` from Private to Public.

## Content and presentation

- [x] Public-facing README explains the project, idea, four dimensions, limitations, architecture, local setup, Cloudflare sandbox, and roadmap.
- [x] README contains a reviewed open-source poster.
- [x] README contains real Cloudflare sandbox screenshots for landing, quiz, pre-result paywall, and report.
- [x] Full-page landing and report captures are available without credentials or account chrome.
- [x] Mock payment and non-investment-advice disclosures are prominent.
- [x] `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `AGENTS.md`, PR template, and Issue templates exist.
- [x] Third-party dependency licenses are summarized in `THIRD_PARTY_NOTICES.md`.
- [x] `CODEOWNERS` protects scoring, Worker, migration, payment, security, and license boundaries.
- [x] Dependabot is configured for npm and GitHub Actions updates.

## Code and security

- [x] Production build passes.
- [x] Worker typecheck passes.
- [x] Unit tests pass.
- [x] Local commercial API acceptance passes.
- [x] `npm audit --audit-level=high` reports no vulnerabilities.
- [x] Working-tree and Git-history pattern scans found no API keys, private keys, payment secrets, or recovery credentials.
- [x] User-provided `参考图.png` remains untracked.
- [x] GitHub private vulnerability reporting is enabled.

## Maintainer decisions required

- [x] `AGPL-3.0-only` confirmed with copyright holder `wzxsph`.
- [x] Exact unmodified GNU AGPL v3 text, SPDX package metadata, and project notice added.
- [x] Maintainer explicitly approved publishing business plans and acquisition/financial assumptions.
- [x] Every commit reachable from `main` and the release branch now uses the maintainer-selected author/committer email.

## GitHub release gate

- [x] Repository description and Cloudflare sandbox homepage are current.
- [x] Draft PR CI is green.
- [x] Every file and commit reachable from the intended public refs has been scanned or explicitly approved by the maintainer.
- [x] Release PR was fast-forwarded into `main` after the license and history decisions were complete.
- [x] GitHub Pages remains disabled.
- [x] Repository visibility is Public.
- [x] README rendering, image loading, community files, Security tab, demo URL, and CI were re-checked from the public repository.

Public release completed on 2026-07-12. The Cloudflare sandbox remains explicitly configured for Mock payment and must not be treated as a real-payment production service.
