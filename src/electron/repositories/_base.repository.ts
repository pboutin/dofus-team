import crypto from 'crypto';

import { ipcMain } from 'electron';
import Store from 'electron-store';

import { GenericModel, Upserted } from '../../types';

export default class BaseRepository<T extends GenericModel> {
  protected store: Store;

  constructor() {
    ipcMain.handle(`${this.modelName}:fetchAll`, () => this.fetchAll());
    ipcMain.handle(`${this.modelName}:upsert`, (_, data: Upserted<T>) => this.upsert(data));
    ipcMain.handle(`${this.modelName}:destroy`, (_, id: string) => this.destroy(id));
    ipcMain.handle(`${this.modelName}:duplicate`, (_, id: string) => this.duplicate(id));
    ipcMain.handle(`${this.modelName}:reorder`, (_, ids: string[]) => this.reorder(ids));
  }

  get modelName(): string {
    throw new Error('modelName not implemented');
  }

  onChange(callback: (items: T[]) => void) {
    return this.store.onDidChange(this.modelName, callback);
  }

  fetchAll(): T[] {
    return this.store.get(this.modelName, []) as T[];
  }

  fetchById(id: string): T | undefined {
    return this.fetchAll().find((item: T) => item.id === id);
  }

  fetchByIds(ids: string[]): T[] {
    const items = this.fetchAll();
    return ids.map((id) => items.find((item) => item.id === id)).filter(Boolean);
  }

  preUpsert(_item: Upserted<T>): void {}

  upsert(item: Upserted<T>): void {
    this.preUpsert(item);

    const items = this.fetchAll();
    const index = items.findIndex(({ id }: T) => id === item.id);

    const persistedItem = {
      ...item,
      id: item.id ? item.id : crypto.randomUUID(),
    };

    if (index === -1) {
      items.push(persistedItem);
    } else {
      items[index] = persistedItem;
    }

    this.store.set(this.modelName, items);
  }

  destroy(id: string): void {
    const items = this.fetchAll();

    this.store.set(
      this.modelName,
      items.filter((item: T) => item.id !== id),
    );
  }

  duplicate(id: string): void {
    const item = this.fetchById(id);

    if (!item) {
      throw new Error(`${this.modelName} with id ${id} not found`);
    }

    this.upsert({
      ...item,
      ...(item.name && { name: `${item.name} *` }),
      id: crypto.randomUUID(),
    });
  }

  reorder(ids: string[]): void {
    const items = this.fetchAll();

    this.store.set(
      this.modelName,
      ids.map((id) => items.find((item) => item.id === id)),
    );
  }
}
