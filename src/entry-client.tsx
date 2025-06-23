import './index.css'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'

const initialData = (window as any).__INITIAL_DATA__
console.log('💻 Datos iniciales recibidos del servidor:', initialData)

delete (window as any).__INITIAL_DATA__

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter>
      <App initialPageProps={initialData} />
    </BrowserRouter>
  </StrictMode>,
)
