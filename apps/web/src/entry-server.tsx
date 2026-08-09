import { renderToString } from 'react-dom/server'
import { App } from './App'
import { getPageMeta, PRERENDER_ROUTES } from './routes'

export function render(path: string): string {
  return renderToString(<App pathname={path} />)
}

export { getPageMeta, PRERENDER_ROUTES }
