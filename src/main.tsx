import './polyfills'; // Import polyfills first
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initSocialAuth } from './lib/socialAuth';

// Initialize social auth providers
initSocialAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);