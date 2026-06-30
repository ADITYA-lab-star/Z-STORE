import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { CompareProvider } from './context/CompareContext'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CompareProvider>
        <Toaster theme="dark" position="bottom-center" richColors />
        <App />
      </CompareProvider>
    </AuthProvider>
  </StrictMode>,
)
