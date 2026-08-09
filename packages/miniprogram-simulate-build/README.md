# Build-only simulator placeholder

`@tarojs/webpack5-runner` lists `miniprogram-simulate` as a production dependency,
but does not import it while compiling an application. TT16 does not use Taro's
simulator test utilities, so this workspace placeholder keeps their legacy Less and
PostCSS dependency trees outside the production install. Mini-program behavior is
tested in WeChat DevTools instead.
