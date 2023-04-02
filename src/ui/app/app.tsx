import React from 'react';
import { createRoot } from 'react-dom/client';
import Characters from 'ui/app/sections/characters/characters';

const App = () => <div>Hello World! <Characters /></div>;

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(<App />);
