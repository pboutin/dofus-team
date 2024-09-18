import fs from 'fs';

import { app } from 'electron';

export default class Store<T> {
  private state: T;
  private stateSubscribers: Array<(updatedState: T, previousState: T) => void> = [];

  private storagePath;

  constructor(name: string, initialState: T) {
    this.storagePath = `${app.getPath('userData')}/${name}.store.json`;

    if (fs.existsSync(this.storagePath)) {
      try {
        this.state = JSON.parse(fs.readFileSync(this.storagePath).toString());
      } catch (error) {
        console.error(error);
        this.state = initialState;
      }
    } else {
      this.state = initialState;
    }
  }

  get(): T {
    return this.state;
  }

  set(state: T) {
    const previousState = this.state;
    this.state = state;
    this.stateSubscribers.forEach((callback) => callback(state, previousState));
    fs.writeFileSync(this.storagePath, JSON.stringify(state));
  }

  onDidChange(callback: (updatedState: T, previousState: T) => void): () => void {
    this.stateSubscribers.push(callback);

    return () => {
      this.stateSubscribers = this.stateSubscribers.filter((subscriptionCallback) => subscriptionCallback !== callback);
    };
  }
}
