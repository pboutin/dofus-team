export type Upserted<T> = T & { id: undefined | string };

export type WindowPosition = { x: number; y: number };

export interface Config {
  theme: string;
  alwaysOnTop: boolean;
  dashboardWindowPosition?: WindowPosition;
  settingsWindowPosition?: WindowPosition;
}

export interface GenericModel {
  id: string;
  name?: string;
}

export interface Character {
  id: string;
  name: string;
  label: string;
  server?: string;
}

export interface InstantiatedCharacter extends Character {
  disabled: boolean;
  active: boolean;
}

export interface Team {
  id: string;
  name: string;
  characterIds: string[];
}

export enum Action {
  GOTO_NEXT = 'GOTO_NEXT',
  GOTO_PREVIOUS = 'GOTO_PREVIOUS',
  GOTO_1 = 'GOTO_1',
  GOTO_2 = 'GOTO_2',
  GOTO_3 = 'GOTO_3',
  GOTO_4 = 'GOTO_4',
  GOTO_5 = 'GOTO_5',
  GOTO_6 = 'GOTO_6',
  GOTO_7 = 'GOTO_7',
  GOTO_8 = 'GOTO_8',
  SWITCH_TEAM = 'SWITCH_TEAM',
  GOTO_CHARACTER = 'GOTO_CHARACTER',
}

export interface KeyboardShortcut {
  id: string;
  action: Action;
  keybind: string;
  argument?: string;
}

export interface DofusWindow {
  windowName: string;
  character: string;
}
