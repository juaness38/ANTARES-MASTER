import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import { esES } from '@clerk/localizations';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const customLocalization = {
  ...esES,
  socialButtonsBlockButton: "Entrar con {{provider|titleize}}",
  formFieldLabel__emailAddress: "Tu correo electrónico",
  formFieldHintText__emailAddress: "Escribe un correo válido",
  signIn: {
    ...esES.signIn,
    start: {
      ...esES.signIn?.start,
      title: "Astroflora",
      subtitle: "Bienvenido, por favor inicia sesión",
    },
  },
};

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      localization={customLocalization}
      navigate={(to) => window.history.pushState(null, '', to)}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
