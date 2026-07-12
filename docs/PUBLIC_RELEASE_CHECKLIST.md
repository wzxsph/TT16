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
- [ ] GitHub private vulnerability reporting is enabled immediately after the repository becomes Public.

## Maintainer decisions required

- [x] `AGPL-3.0-only` confirmed with copyright holder `wzxsph`.
- [x] Exact unmodified GNU AGPL v3 text, SPDX package metadata, and project notice added.
- [x] Maintainer explicitly approved publishing business plans and acquisition/financial assumptions.
- [x] Maintainer selected the author/committer email to use for the rewritten Git history.

## GitHub release gate

- [x] Repository description and Cloudflare sandbox homepage are current.
- [x] Draft PR CI is green.
- [ ] Sanitize or explicitly approve every file and commit reachable from public refs.
- [ ] Merge the release PR after the license and history decisions are complete.
- [ ] Confirm GitHub Pages remains disabled.
- [ ] Change repository visibility to Public.
- [ ] Re-check README rendering, image loading, Issue forms, Security tab, demo URL, and CI from the public repository.

The repository must remain Private until every unchecked item above has been completed or explicitly accepted by the maintainer.
