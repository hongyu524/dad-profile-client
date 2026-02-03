import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import FamilyLogin from '@/pages/FamilyLogin.jsx'
import { isAuthed } from '@/auth/gate'
import '@/index.css'
import { loadRuntimeConfig } from '@/lib/runtimeConfig'

// Restore SPA path after GitHub Pages redirect
const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;
if (redirect && redirect !== location.pathname) {
  history.replaceState(null, null, redirect);
}

// Restore SPA path from ?p=... (GitHub Pages fallback)
const params = new URLSearchParams(window.location.search);
const p = params.get("p");
if (p) {
  window.history.replaceState(null, "", decodeURIComponent(p));
}

function Root() {
  const [authed, setAuthedState] = useState(isAuthed());

  if (!authed) {
    return <FamilyLogin onAuthed={() => setAuthedState(true)} />;
  }

  return <App />;
}

async function bootstrap() {
  const rootEl = document.getElementById('root');
  try {
    await loadRuntimeConfig();
    ReactDOM.createRoot(rootEl).render(
      // <React.StrictMode>
      <Root />
      // </React.StrictMode>,
    );
  } catch (err) {
    console.error(err);
    if (rootEl) {
      rootEl.innerHTML = `<div style="padding:16px;color:#f97316;background:rgba(249,115,22,0.1);border:1px solid rgba(249,115,22,0.4);border-radius:8px;font-family:system-ui;">
        Missing config.json or apiBaseUrl. 请在 public/config.json 配置 apiBaseUrl 并重新部署。
      </div>`;
    }
  }
}

bootstrap();

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:beforeUpdate' }, '*');
  });
  import.meta.hot.on('vite:afterUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:afterUpdate' }, '*');
  });
}
