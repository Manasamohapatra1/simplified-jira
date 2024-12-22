import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { VisibilityProvider } from './contexts/VisibilityContext.jsx'
import { ThemeContextProvider } from './contexts/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VisibilityProvider>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>     
    </VisibilityProvider>    
  </StrictMode>,
)
