import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import FamilyLogin from '@/pages/FamilyLogin.jsx'
import { isAuthed } from '@/auth/gate'
import '@/index.css'

function Root() {
  const [authed, setAuthedState] = useState(isAuthed());

  if (!authed) {
    return <FamilyLogin onAuthed={() => setAuthedState(true)} />;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Root />
  // </React.StrictMode>,
)

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:beforeUpdate' }, '*');
  });
  import.meta.hot.on('vite:afterUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:afterUpdate' }, '*');
  });
}



