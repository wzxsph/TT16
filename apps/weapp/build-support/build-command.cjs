'use strict'

module.exports = function registerBuildCommand(ctx) {
  ctx.registerCommand({
    name: 'build',
    async fn({ options, config, _ }) {
      const platform = options.platform
      if (platform !== 'weapp') {
        throw new Error('TT16\'s repository build only supports the WeChat target.')
      }

      const isWatch = Boolean(options.isWatch)
      const isProduction = !isWatch
      ctx.helper.fs.ensureDirSync(ctx.paths.outputPath)

      await ctx.applyPlugins('onBuildStart')
      await ctx.applyPlugins({
        name: platform,
        opts: {
          config: {
            ...config,
            isWatch,
            mode: isProduction ? 'production' : 'development',
            blended: false,
            isBuildNativeComp: false,
            withoutBuild: false,
            newBlended: false,
            noInjectGlobalStyle: false,
            async modifyAppConfig(appConfig) {
              await ctx.applyPlugins({ name: 'modifyAppConfig', opts: { appConfig } })
            },
            async modifyWebpackChain(chain, webpack, data) {
              await ctx.applyPlugins({
                name: 'modifyWebpackChain',
                initialVal: chain,
                opts: { chain, webpack, data },
              })
            },
            async modifyViteConfig(viteConfig, data, viteCompilerContext) {
              await ctx.applyPlugins({
                name: 'modifyViteConfig',
                initialVal: viteConfig,
                opts: { viteConfig, data, viteCompilerContext },
              })
            },
            async modifyBuildAssets(assets, miniPlugin) {
              await ctx.applyPlugins({
                name: 'modifyBuildAssets',
                initialVal: assets,
                opts: { assets, miniPlugin },
              })
            },
            async modifyMiniConfigs(configMap) {
              await ctx.applyPlugins({
                name: 'modifyMiniConfigs',
                initialVal: configMap,
                opts: { configMap },
              })
            },
            async modifyComponentConfig(componentConfig, componentBuildConfig) {
              await ctx.applyPlugins({
                name: 'modifyComponentConfig',
                opts: { componentConfig, config: componentBuildConfig },
              })
            },
            async onCompilerMake(compilation, compiler, plugin) {
              await ctx.applyPlugins({
                name: 'onCompilerMake',
                opts: { compilation, compiler, plugin },
              })
            },
            async onParseCreateElement(nodeName, componentConfig) {
              await ctx.applyPlugins({
                name: 'onParseCreateElement',
                opts: { nodeName, componentConfig },
              })
            },
            async onBuildFinish(payload) {
              await ctx.applyPlugins({ name: 'onBuildFinish', opts: payload })
            },
          },
        },
      })
      await ctx.applyPlugins('onBuildComplete')
    },
  })
}
