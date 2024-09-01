import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from 'src/ui/windows/dashboard';
import Settings from 'src/ui/windows/settings';

import 'src/ui/index.css';

const rootElement = document.getElementById('root')!;
const reactRoot = createRoot(rootElement);

switch (rootElement.dataset.window) {
  case 'dashboard':
    reactRoot.render(<Dashboard />);
    break;
  case 'settings':
    reactRoot.render(<Settings />);
    break;
  default:
    throw new Error('Unknown window');
}
