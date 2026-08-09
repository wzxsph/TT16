# Taro mini component facade

TT16 only targets WeChat from this workspace. Taro's published `@tarojs/components`
package also bundles its browser component implementation and browser-only dependencies.
This workspace package exposes the same Taro 4.2.1 native mini-program component
names used by TT16, without adding those unused H5 dependencies to the install or audit
surface. It is not intended for a Taro H5 build.
