import { inject, injectAsync } from './injector';
import { read, readAsync } from './reader';

export const config = (filePath?: string, environment?: string) => {
  inject(read(filePath, environment));
}

export const configAsync = async (filePath?: string, environment?: string) => {
  await injectAsync(readAsync(filePath, environment));
}

export default config;
