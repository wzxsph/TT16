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

- [ ] Confirm `AGPL-3.0-only` and the copyright-holder display name.
- [ ] Add the exact unmodified license text and SPDX metadata.
- [ ] Decide whether internal business plans and acquisition/financial assumptions belong in public history.
- [ ] Decide whether to rewrite historical author email addresses to the GitHub noreply address.

## GitHub release gate

- [x] Repository description and Cloudflare sandbox homepage are current.
- [x] Draft PR CI is green.
- [ ] Sanitize or explicitly approve every file and commit reachable from public refs.
- [ ] Merge the release PR after the license and history decisions are complete.
- [ ] Confirm GitHub Pages remains disabled.
- [ ] Change repository visibility to Public.
- [ ] Re-check README rendering, image loading, Issue forms, Security tab, demo URL, and CI from the public repository.

The repository must remain Private until every unchecked item above has been completed or explicitly accepted by the maintainer.
