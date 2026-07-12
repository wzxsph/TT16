import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const { default: App } = await (
  import.meta.env.MODE === 'pages'
    ? import('./FreeApp')
    : import('./App')
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
