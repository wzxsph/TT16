'use strict'

const path = require('node:path')

module.exports = function registerProjectConfigWriter(ctx) {
  ctx.registerMethod('writeFileToDist', ({ filePath, content }) => {
    if (path.isAbsolute(filePath)) {
      throw new Error('The mini-program build cannot write an absolute output path.')
    }
    const target = path.join(ctx.paths.outputPath, filePath)
    ctx.helper.fs.ensureDirSync(path.dirname(target))
    ctx.helper.fs.writeFileSync(target, content)
  })

  ctx.registerMethod('generateProjectConfig', ({ srcConfigName, distConfigName }) => {
    const source = path.join(ctx.paths.appPath, srcConfigName)
    if (!ctx.helper.fs.existsSync(source)) return

    const projectConfig = ctx.helper.fs.readJSONSync(source)
    projectConfig.appid = process.env.TARO_APP_ID || projectConfig.appid
    if (projectConfig.compileType !== 'plugin') {
      projectConfig.miniprogramRoot = './'
    }
    ctx.writeFileToDist({
      filePath: distConfigName,
      content: JSON.stringify(projectConfig, null, 2),
    })
  })
}
