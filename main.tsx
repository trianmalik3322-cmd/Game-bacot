import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerSW, setupInstallPrompt } from "./pwa";

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register inline SW via blob URL karena viteSingleFile
    const swCode = `
const CACHE_NAME = 'sandbox-world-v2';
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(['/', '/index.html']))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('/'));
    })
  );
});
    `;
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    navigator.serviceWorker.register(swUrl, { scope: '/' })
      .then(reg => {
        console.log('✅ SW registered');
        // Store reg for later use
        (window as any).__swReg = reg;
      })
      .catch(err => console.log('SW error:', err));
  });
}

// Setup PWA install prompt
setupInstallPrompt((canInstall) => {
  (window as any).__canInstallPWA = canInstall;
  window.dispatchEvent(new CustomEvent('pwa-installable', { detail: { canInstall } }));
});

// Also try registering the public SW file
registerSW();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
