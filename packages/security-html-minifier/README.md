# Mini-program markup minifier

Taro's Webpack runner imports the abandoned `html-minifier` package while emitting
mini-program XML. TT16 only needs synchronous whitespace collapse for generated WXML,
so this build-only workspace package implements that narrow API without the unused HTML
parser dependency tree. Web HTML is built and minified by Vite, not this package.
