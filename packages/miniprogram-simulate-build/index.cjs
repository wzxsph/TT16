'use strict'

module.exports = new Proxy({}, {
  get() {
    throw new Error('miniprogram-simulate is not available in TT16 production builds.')
  },
})
