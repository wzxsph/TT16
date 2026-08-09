# Third-Party Notices

TT16 depends on open-source software governed by its own licenses. This notice is informational and does not replace license files distributed with each dependency.

## Runtime dependencies

| Package | Role | License |
| --- | --- | --- |
| [React](https://github.com/facebook/react) | Web React 19 and mini-program React 18 UI runtime | MIT |
| [React DOM](https://github.com/facebook/react) | Web renderer and Taro build compatibility | MIT |
| [Lucide React](https://github.com/lucide-icons/lucide) | Web interface icons | ISC |
| [Taro](https://github.com/NervJS/taro) | WeChat mini-program runtime and compiler integration | MIT |

## Primary development and deployment tools

| Package / project | Role | License |
| --- | --- | --- |
| [Vite](https://github.com/vitejs/vite) | Web build and SSR bundling | MIT |
| [Webpack](https://github.com/webpack/webpack) | Taro WeChat build | MIT |
| [Vitest](https://github.com/vitest-dev/vitest) | Core unit tests | MIT |
| [Playwright](https://github.com/microsoft/playwright) | Desktop and mobile browser acceptance tests | Apache-2.0 |
| [axe-core](https://github.com/dequelabs/axe-core) | Automated accessibility checks | MPL-2.0 |
| [TypeScript](https://github.com/microsoft/TypeScript) | Type checker and core compiler | Apache-2.0 |
| [Sharp](https://github.com/lovell/sharp) | Personality and Open Graph image generation | Apache-2.0 |
| [Caddy](https://github.com/caddyserver/caddy) | Optional Hong Kong static origin and HTTPS | Apache-2.0 |
| [GoatCounter](https://github.com/arp242/goatcounter) | Optional self-hosted aggregate analytics | EUPL-1.2 |
| [Wrangler](https://github.com/cloudflare/workers-sdk) | Manual deployment of the no-binding retired Worker | MIT OR Apache-2.0 |

The complete installed dependency graph and exact versions are recorded in `package-lock.json`; installed packages carry their own metadata and license texts under `node_modules/`.

## Repository compatibility packages

`packages/taro-components-mini`, `packages/miniprogram-simulate-build`, and `packages/security-html-minifier` narrow the Taro build to the mini-program features TT16 actually uses and remove unused browser/test dependency trees from the install. They do not replace React, Taro runtime, the official WeChat platform plugin, or the official Taro compiler. Their behavior and limitations are documented in each package directory.

## Project artwork and content

TT16 personality illustrations, screenshots, project copy, and other repository-authored assets are released under the repository's `AGPL-3.0-only` license unless a file says otherwise. User-provided references or third-party materials are not included unless publication rights are explicitly confirmed.
