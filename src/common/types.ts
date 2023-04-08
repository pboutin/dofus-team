export type Created<T> = T & { id: undefined };

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
