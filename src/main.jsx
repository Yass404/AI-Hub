import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/alan-sans/300.css';
import '@fontsource/alan-sans/400.css';
import '@fontsource/alan-sans/500.css';
import '@fontsource/alan-sans/600.css';
import '@fontsource/alan-sans/700.css';
import '@fontsource/alan-sans/800.css';
import '@fontsource/alan-sans/900.css';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
