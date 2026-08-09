'use strict'

exports.minify = function minify(markup, options = {}) {
  if (typeof markup !== 'string') throw new TypeError('Expected markup to be a string')
  if (!options.collapseWhitespace) return markup
  return markup.replace(/>\s+</g, '><').trim()
}
