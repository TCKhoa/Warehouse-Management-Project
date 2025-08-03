import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';

const App = () => {
  return (
    <div>
      <h1 className="hello">Helllo</h1>
    </div>
  );
};

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
