import classNames from 'classnames';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Route, Router, Routes } from 'react-router-dom';
import Characters from 'app/sections/characters/characters';
import General from 'app/sections/general/general';
import KeyboardShortcuts from 'app/sections/keyboard-shortcuts/keyboard-shortcuts';
import Teams from 'app/sections/teams/teams';
import Icon from 'components/icon';
import useTranslate from 'hooks/use-translate';

const App = () => {
  const translate = useTranslate('app');

  return (
    <HashRouter>
      <div className="bg-neutral min-h-screen flex flex-col">
        <div className="tabs pt-3">
          <NavLink className={({isActive}) => classNames("tab tab-lifted", {'tab-active': isActive})} to='/'>
            <Icon icon="house" className="mr-2" />
            {translate('general.title')}
          </NavLink>
          <NavLink className={({isActive}) => classNames("tab tab-lifted", {'tab-active': isActive})} to='/characters'>
            <Icon icon="user" className="mr-2" />
            {translate('characters.title')}
          </NavLink>
          <NavLink className={({isActive}) => classNames("tab tab-lifted", {'tab-active': isActive})} to='/teams'>
            <Icon icon="users" className="mr-2" />
            {translate('teams.title')}
          </NavLink>
          <NavLink className={({isActive}) => classNames("tab tab-lifted", {'tab-active': isActive})} to='/keyboard-shortcuts'>
            <Icon icon="keyboard" className="mr-2" />
            {translate('shortcuts.title')}
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
              path='/keyboard-shortcuts'
              element={<KeyboardShortcuts />}
            />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(<App />);
