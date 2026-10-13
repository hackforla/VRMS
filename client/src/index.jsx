import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import './tailwind.css';
import posthog from 'posthog-js';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SnackbarProvider } from './context/snackbarContext';

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  autocapture: false,
  capture_pageview: false,
});

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </BrowserRouter>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
