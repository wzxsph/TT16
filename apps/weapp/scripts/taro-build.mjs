import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config, Kernel } from '@tarojs/service'

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const appPath = path.resolve(currentDir, '..')
const isWatch = process.argv.includes('--watch')

process.env.NODE_ENV = isWatch ? 'development' : 'production'
process.env.TARO_ENV = 'weapp'

const config = new Config({ appPath, disableGlobalConfig: true })
await config.init({ command: 'build', mode: process.env.NODE_ENV })
if (!config.isInitSuccess) {
  throw new Error(`Unable to load the Taro project config from ${appPath}.`)
}

const kernel = new Kernel({
  appPath,
  config,
  presets: [path.resolve(appPath, 'build-support/preset.cjs')],
  plugins: [
    path.resolve(appPath, 'build-support/build-command.cjs'),
    '@tarojs/plugin-platform-weapp',
    '@tarojs/plugin-framework-react',
  ],
})

await kernel.run({
  name: 'build',
  opts: {
    _: ['build'],
    options: { platform: 'weapp', isWatch },
  },
})
