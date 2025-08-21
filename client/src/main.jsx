import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './index.css';
import App from './App.jsx';

const stripePromise = loadStripe('pk_test_51RBJYsFwJt3goCLz4tzyqGUKRYt3hfaXjFWuSPKhbZ014goqCnqyFlSKJvPnpynQX15gTEJUiGLLoNEEWc2kvRHU00W5Zfee1l');

createRoot(document.getElementById('root')).render(
  <Elements stripe={stripePromise}>
    <StrictMode>
      <App />
    </StrictMode>
  </Elements>
);
