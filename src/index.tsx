import React from 'react';
import ReactDOM from 'react-dom/client';
import '..src/index.css';
import {BrowserRouter} from 'react-router-dom';
import App from '../src/App';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
