import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthWrapper } from './components/context/auth.context.jsx'
import { FavoritesProvider } from './components/context/favorites.context.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </AuthWrapper>
    </BrowserRouter>
  </StrictMode>,
)
