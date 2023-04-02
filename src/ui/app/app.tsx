import React from 'react';
import { createRoot } from 'react-dom/client';
import Characters from 'ui/app/sections/characters/characters';

const App = () => (
  <div>
    <div className="tabs">
      <a className="tab tab-lifted">Tab 1</a> 
      <a className="tab tab-lifted tab-active">Tab 2</a> 
      <a className="tab tab-lifted">Tab 3</a>
    </div>

    <i className="fa-solid fa-dragon"></i>

    <h1 className="text-3xl font-bold underline">Hello World</h1>

    <Characters />
  </div>
);

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(<App />);
