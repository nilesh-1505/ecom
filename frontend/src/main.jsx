import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global API url redirect helper for static hosting sites like GitHub Pages
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  let url = input;
  if (typeof url === 'string' && url.startsWith('/api/')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    url = `${apiBase}${url}`;
  }
  return originalFetch(url, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
