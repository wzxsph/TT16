import type { IProjectConfig } from '@tarojs/taro/types/compile'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

const config = {
  projectName: 'tt16-weapp',
  date: '2026-08-09',
  designWidth: 750,
  deviceRatio: { 750: 1 },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack5',
  alias: {
    '@tt16/core': path.resolve(currentDir, '../../../packages/core/dist/index.js'),
  },
  copy: {
    patterns: [{ from: '../../public/images/personalities-v2', to: 'dist/content/assets/personalities-v2' }],
    options: {},
  },
  cache: { enable: true },
  mini: {
    postcss: {
      pxtransform: { enable: true, config: {} },
      url: { enable: true, config: { limit: 1024 } },
      cssModules: { enable: false },
    },
    optimizeMainPackage: { enable: true },
    miniCssExtractPluginOption: { ignoreOrder: true },
  },
} satisfies IProjectConfig<'webpack5'>

export default config
