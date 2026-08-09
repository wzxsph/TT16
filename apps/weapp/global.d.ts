/// <reference types="@tarojs/taro" />

declare const defineAppConfig: typeof import('@tarojs/taro')['defineAppConfig']
declare const definePageConfig: typeof import('@tarojs/taro')['definePageConfig']
declare const wx: {
  loadSubpackage(options: {
    name: string
    success: () => void
    fail: (error: unknown) => void
  }): unknown
}

declare module '*.css'
