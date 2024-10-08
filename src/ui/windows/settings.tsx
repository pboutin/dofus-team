import classNames from 'classnames';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom';

import Icon from '../components/icon';
import { useConfig } from '../hooks/use-ipc-renderer';
import useTranslate from '../hooks/use-translate';
import getAdditionalArgument from '../utilities/get-additional-argument';
import Characters from '../windows/settings/characters/characters';
import KeyboardShortcuts from '../windows/settings/keyboard-shortcuts/keyboard-shortcuts';
import Teams from '../windows/settings/teams/teams';
import Theme from '../windows/settings/theme/theme';

const Settings = () => {
  useConfig();

  const translate = useTranslate('settings');

  return (
    <HashRouter>
      <div className="flex h-full flex-col bg-base-300">
        <div className="tabs tabs-lifted pr-40 pt-3">
          <NavLink className={({ isActive }) => classNames('tab', { 'tab-active': isActive })} to="/">
            <Icon icon="user" className="mr-2" />
            {translate('characters.title')}
          </NavLink>
          <NavLink className={({ isActive }) => classNames('tab', { 'tab-active': isActive })} to="/teams">
            <Icon icon="users" className="mr-2" />
            {translate('teams.title')}
          </NavLink>
          <NavLink className={({ isActive }) => classNames('tab', { 'tab-active': isActive })} to="/keyboard-shortcuts">
            <Icon icon="keyboard" className="mr-2" />
            {translate('shortcuts.title')}
          </NavLink>
          <NavLink className={({ isActive }) => classNames('tab', { 'tab-active': isActive })} to="/theme">
            <Icon icon="palette" className="mr-2" />
            {translate('theme.title')}
          </NavLink>
        </div>

        <div className="flex-1 overflow-y-scroll bg-base-100 p-3">
          <Routes>
            <Route index path="/" element={<Characters />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/keyboard-shortcuts" element={<KeyboardShortcuts />} />
            <Route path="/theme" element={<Theme />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

if (getAdditionalArgument('slug') === 'settings') {
  createRoot(document.getElementById('root')).render(<Settings />);
}
