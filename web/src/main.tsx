import { LanguageProvider, MDXProvider, ThemeProvider } from './providers'
import { createRoot } from 'react-dom/client'
import 'highlight.js/styles/github-dark.css'
import { StrictMode } from 'react'
import '@/assets/styles/index.css'
import '@/assets/styles/fonts.css'
import { App } from './app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <MDXProvider>
          <App />
        </MDXProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
