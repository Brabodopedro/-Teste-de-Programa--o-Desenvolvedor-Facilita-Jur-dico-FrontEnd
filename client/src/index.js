import React from 'react';
import { createRoot } from 'react-dom';
import App from './App.js';

// Substitua ReactDOM.render por createRoot().render
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);