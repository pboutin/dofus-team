import classNames from 'classnames';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Route, Router, Routes } from 'react-router-dom';
import Characters from 'ui/app/sections/characters/characters';
import General from 'ui/app/sections/general/general';
import Shortcuts from 'ui/app/sections/shortcuts/shortcuts';
import Teams from 'ui/app/sections/teams/teams';

const App = () => (
  <HashRouter>
    <div className="bg-neutral min-h-screen flex flex-col">
      <div className="tabs pt-3">
        <NavLink className={({isActive}) => classNames("tab tab-lifted", {'tab-active': isActive})} to='/'>
          General
        </NavLink>
        <NavLink className={({isActive}) => classNames("tab tab-lifted", {'tab-active': isActive})} to='/characters'>
          Characters
        </NavLink>
        <NavLink className={({isActive}) => classNames("tab tab-lifted", {'tab-active': isActive})} to='/teams'>
          Teams
        </NavLink>
        <NavLink className={({isActive}) => classNames("tab tab-lifted", {'tab-active': isActive})} to='/shortcuts'>
          Shortcuts
        </NavLink>
      </div>

      <div className="bg-base-100 flex-1 p-3">
        <Routes>
          <Route
            path='/'
            element={<General />}
          />
          <Route
            path='/characters'
            element={<Characters />}
          />
          <Route
            path='/teams'
            element={<Teams />}
          />
          <Route
            path='/shortcuts'
            element={<Shortcuts />}
          />
        </Routes>
      </div>
    </div>
  </HashRouter>
);

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(<App />);
