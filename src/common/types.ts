export type Upserted<T> = Omit<T, "id">;
export interface GenericModel {
  id: string;
  name?: string;
}

export enum Class {
  Osamodas = "Osamodas",
  Eniripsa = "Eniripsa",
  Iop = "Iop",
  Sacrieur = "Sacrieur",
  Feca = "Feca",
  Xelor = "Xelor",
  Enutrof = "Enutrof",
  Sram = "Sram",
  Ecaflip = "Ecaflip",
  Pandawa = "Pandawa",
  Sadida = "Sadida",
  Cra = "Cra",
  Steamer = "Steamer",
  Zobal = "Zobal",
  Eliotrope = "Eliotrope",
  Huppermage = "Huppermage",
  Forgelance = "Forgelance",
  Ouginak = "Ouginak",
  Roublard = "Roublard",
}

export enum Server {
  Imagiro = "291",
  Ombre = "50",
  TalKasha = "290",
  Orukam = "292",
  Tilezia = "293",
  HellMina = "294",
  Draconiros = "295",
}

export type Gender = "male" | "female";

export interface Character extends DirectoryCharacter {
  id: string;
}

export interface DirectoryCharacter {
  name: string;
  server: Server;
  class: Class;
  gender: Gender;
  avatarUrl: string;
}

export interface InstanciatedCharacter extends Character {
  disabled: boolean;
  active: boolean;
}

export interface Team {
  id: string;
  name: string;
  characterIds: string[];
}

export enum Action {
  GOTO_NEXT = "GOTO_NEXT",
  GOTO_PREVIOUS = "GOTO_PREVIOUS",
  GOTO_1 = "GOTO_1",
  GOTO_2 = "GOTO_2",
  GOTO_3 = "GOTO_3",
  GOTO_4 = "GOTO_4",
  GOTO_5 = "GOTO_5",
  GOTO_6 = "GOTO_6",
  GOTO_7 = "GOTO_7",
  GOTO_8 = "GOTO_8",
  SWITCH_TEAM = "SWITCH_TEAM",
  GOTO_CHARACTER = "GOTO_CHARACTER",
}

export interface KeyboardShortcut {
  id: string;
  action: Action;
  keybind: string;
  argument?: string;
}

export interface PersistedKeyboardShortcut extends KeyboardShortcut {}
