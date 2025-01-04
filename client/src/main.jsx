import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import './index.css';

// async function fetchScripts() {
//   try {
//     const response = await axios.get('https://www.api.blueaceindia.com/api/v1/get-all-script');

//     toast.success('Scripts fetched successfully!');
//   } catch (error) {
//     console.error('Error fetching scripts:', error);
//     toast.error('Failed to fetch scripts');
//   }
// }

// Call the fetch function when the app initializes
// fetchScripts();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </HelmetProvider>
  </StrictMode>
);
