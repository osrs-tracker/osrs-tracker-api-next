import { App } from '../app';

export interface RouterFactory {
  create(app: App): void;
}
