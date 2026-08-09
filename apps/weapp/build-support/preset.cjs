'use strict'

const path = require('node:path')

module.exports = function tt16BuildPreset() {
  return {
    plugins: [
      path.resolve(__dirname, 'register-build-hooks.cjs'),
      path.resolve(__dirname, 'write-project-config.cjs'),
    ],
  }
}
