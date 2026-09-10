import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { BankProvider } from './store.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { DataRecovery } from './components/DataRecovery.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BankProvider>
      <LanguageProvider>
        <App />
        <DataRecovery />
      </LanguageProvider>
    </BankProvider>
  </StrictMode>,
);
