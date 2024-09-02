import classNames from 'classnames';
import React from 'react';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import Icon from '../components/icon';
import useTranslate from '../hooks/use-translate';
import Characters from '../windows/settings/characters/characters';
import Teams from '../windows/settings/teams/teams';
import KeyboardShortcuts from '../windows/settings/keyboard-shortcuts/keyboard-shortcuts';

const Settings = () => {
  const translate = useTranslate('settings');

  return (
    <HashRouter>
      <div className="bg-neutral min-h-screen flex flex-col">
        <div className="tabs pt-3">
          <NavLink className={({ isActive }) => classNames('tab tab-lifted', { 'tab-active': isActive })} to="/">
            <Icon icon="user" className="mr-2" />
            {translate('characters.title')}
          </NavLink>
          <NavLink className={({ isActive }) => classNames('tab tab-lifted', { 'tab-active': isActive })} to="/teams">
            <Icon icon="users" className="mr-2" />
            {translate('teams.title')}
          </NavLink>
          <NavLink
            className={({ isActive }) => classNames('tab tab-lifted', { 'tab-active': isActive })}
            to="/keyboard-shortcuts"
          >
            <Icon icon="keyboard" className="mr-2" />
            {translate('shortcuts.title')}
          </NavLink>
        </div>

        <div className="bg-base-100 flex-1 p-3">
          <Routes>
            <Route index path="/" element={<Characters />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/keyboard-shortcuts" element={<KeyboardShortcuts />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

createRoot(document.getElementById('root')).render(<Settings />);