'use strict'

const BUILD_HOOKS = [
  'modifyAppConfig',
  'modifyWebpackChain',
  'modifyViteConfig',
  'modifyBuildAssets',
  'modifyMiniConfigs',
  'modifyComponentConfig',
  'modifyRunnerOpts',
  'onCompilerMake',
  'onParseCreateElement',
  'onBuildStart',
  'onBuildFinish',
  'onBuildComplete',
]

module.exports = function registerBuildHooks(ctx) {
  BUILD_HOOKS.forEach((name) => ctx.registerMethod(name))
}
