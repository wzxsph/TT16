import type { ComponentType, CSSProperties, ReactNode } from 'react'

export interface BaseEventOrig<T = unknown> {
  detail: T
  type: string
  timeStamp: number
}

export interface StandardProps {
  id?: string
  className?: string
  style?: string | CSSProperties
  children?: ReactNode
  hidden?: boolean
  onClick?: (event: BaseEventOrig) => void
}

export interface PickerProps extends StandardProps {
  mode?: 'selector'
  range: Array<string | number | Record<string, unknown>>
  value?: number
  onChange?: (event: BaseEventOrig<{ value: string | number }>) => void
}

export interface ImageProps extends StandardProps {
  src: string
  mode?: 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix'
  lazyLoad?: boolean
}

export interface CanvasProps extends StandardProps {
  canvasId?: string
  type?: '2d' | 'webgl'
}

export const View: ComponentType<StandardProps>
export const Text: ComponentType<StandardProps>
export const Button: ComponentType<StandardProps & { disabled?: boolean; openType?: string }>
export const Image: ComponentType<ImageProps>
export const Picker: ComponentType<PickerProps>
export const Canvas: ComponentType<CanvasProps>
