export type Upserted<T> = T & { id: undefined | string };

export interface GenericModel {
  id: string;
  name?: string;
}

export enum Class {
  Osamodas = 'osamodas',
  Eniripsa = 'eniripsa',
  Iop = 'iop',
  Sacrieur = 'sacrieur',
  Feca = 'feca',
  Xelor = 'xelor',
  Enutrof = 'enutrof',
  Sram = 'sram',
  Ecaflip = 'ecaflip',
  Pandawa = 'pandawa',
  Sadida = 'sadida',
  Cra = 'cra',
  Steamer = 'steamer',
  Zobal = 'zobal',
  Eliotrope = 'eliotrope',
  Huppermage = 'huppermage',
  Forgelance = 'forgelance',
  Ouginak = 'ouginak',
  Roublard = 'roublard',
}

export enum Avatar {
  Good1 = '1',
  Good2 = '2',
  Good3 = '3',
  Good4 = '4',
  Bad1 = '5',
  Bad2 = '6',
  Bad3 = '7',
  Bad4 = '8',
}

export type Gender = 'male' | 'female';

export interface Character {
  id: string;
  name: string;
  label: string;
  class: Class;
  gender: Gender;
  avatar: Avatar;
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

export interface PersistedKeyboardShortcut extends KeyboardShortcut {}
