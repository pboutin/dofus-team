import Store from 'electron-store';
import crypto from 'crypto';

import { GenericModel, Upserted } from '../common/types';

export default class BaseRepository<T extends GenericModel> {
  private class;

  protected store: Store | undefined = undefined;

  constructor() {
    this.class = BaseRepository<T>;
  }

  get modelName(): string {
    throw new Error('modelName not implemented');
  }

  registerStore(store: Store): void {
    this.store = store;
  }

  onChange(callback: (items: T[]) => void): void {
    this.store.onDidChange(this.modelName, callback);
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

  preUpsert(item: Upserted<T>): void {}

  upsert(item: Upserted<T>): void {
    this.preUpsert(item);

    const items = this.fetchAll();
    const index = items.findIndex(({ id }: T) => id === item.id);

    const persitedItem = {
      ...item,
      id: item.id ? item.id : crypto.randomUUID(),
    };

    if (index === -1) {
      items.push(persitedItem);
    } else {
      items[index] = persitedItem;
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
