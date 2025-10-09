// src/index.js (or src/main.jsx)

import React from 'react';
// Import the correct client for React 18+
import ReactDOM from 'react-dom/client'; 
// 👇 1. Import BrowserRouter
import { BrowserRouter } from 'react-router-dom'; 

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 👇 2. Wrap the App component with BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);