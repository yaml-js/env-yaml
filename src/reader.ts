import * as fs from 'fs'
import { parse as parseYaml } from 'yaml'

import { Logger, createConsoleLogger } from "./logger";
import { YamlContent } from './types';

const knownEnvironments: Record<string, string> = {
  "DEV": 'development',
  "DEVELOPMENT": 'development',
  'TST': 'test',
  'TEST': 'test',
  'PROD': 'production',
  'PRODUCTION': 'production',
};

const isObject = (item: any): boolean => {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

const merge = (target: YamlContent, source: YamlContent): YamlContent => {
  let result = { ...target };
  for (const key in source) {
    const sourceValue = source[key];
    if (isObject(sourceValue) && isObject(target[key])) {
      result[key] = merge(target[key], sourceValue);
    } else {
      (result as any)[key] = sourceValue;
    }
  }
  return result;
}

const mergeFromContet = (target: YamlContent, content: string): YamlContent => {
  const yamlContent = parseYaml(content) as YamlContent;
  return merge(target, yamlContent);
}

const discoverEnvironmentFromValue = (value: string): string => {
  const env = value.toUpperCase();
  if (knownEnvironments[env]) {
    return knownEnvironments[env];
  } else {
    return value;
  }
}

const discoverEnvironment = (logger: Logger): string => {
  if (process.env.APP_ENV) {
    return discoverEnvironmentFromValue(process.env.APP_ENV);
  } else if (process.env.NODE_ENV) {
    return discoverEnvironmentFromValue(process.env.NODE_ENV);
  } else if (import.meta.env && import.meta.env.NODE_ENV) {
    return discoverEnvironmentFromValue(import.meta.env.NODE_ENV);
  } else if (import.meta.env && import.meta.env.MODE) {
    return discoverEnvironmentFromValue(import.meta.env.MODE);
  } else {
    logger.warn(() => `No environment value found, defaulting to production`);
    return 'production'
  }
}

const removeFileExtension = (filename: string): { name: string, extension: string | null } => {
  const extensionMatch = filename.match(/\.([^.]+)$/);

  if (extensionMatch) {
    const extension = extensionMatch[1];
    const name = filename.slice(0, -extension.length - 1);
    return { name, extension };
  }

  return { name: filename, extension: null };
}


const getFiles = (logger: Logger, filePath: string | undefined, environment: string | undefined): string[] => {
  const env = environment || discoverEnvironment(logger);
  filePath = filePath || './config';
  const { name, extension } = removeFileExtension(filePath);
  if (extension) {
    return [`${filePath}`, `${name}.${env}.${extension}`, `${name}.${env}.local.${extension}`];
  }  else {
    return [`${filePath}`, `${filePath}.${env}`, `${filePath}.${env}.local`];
  }
}

// Pattern to match ${VAR_NAME} or ${VAR_NAME:DEFAULT_VALUE}
const pattern = /\$\{(?<VAR>[A-Za-z0-9_]+)(?::(?<DEFAULT>[^\}]*))?\}/g

const replaceEnvVariables = (content: string): string => {
  const result = content.replaceAll(pattern, (_, varName, defaultValue) => {
    return process.env[varName] ?? defaultValue ?? `\${${varName}}`
  })
  return result
}

export class Reader {
  private logger: Logger;

  constructor(logger?: Logger) {
    this.logger = logger ?? createConsoleLogger('EnvYaml.Reader', undefined, 'INFO');
  }

  public async read(filePath?: string, environment?: string): Promise<YamlContent> {
    const files = getFiles(this.logger, filePath, environment);
    let result: YamlContent = {};

    for (const file of files) {

      const exists = await fs.promises.access(file, fs.constants.F_OK).then(() => true).catch(() => false)
      if (exists) {
        this.logger.debug(() => `Reading file ${file}`);
        const content = await fs.promises.readFile(file, 'utf8')
        result = mergeFromContet(result, replaceEnvVariables(content));
      }
    }
    return result;
  }

  public readSync(filePath?: string, environment?: string): YamlContent {
    const files = getFiles(this.logger, filePath, environment);
    let result: YamlContent = {};

    for (const file of files) {

      const exists = fs.existsSync(file)
      if (exists) {
        this.logger.debug(() => `Reading file ${file}`);
        const content = fs.readFileSync(file, 'utf8')
        result = mergeFromContet(result, replaceEnvVariables(content));
      }
    }
    return result;
  }
}

const defaultReader = new Reader();
export const readAsync = (filePath?: string, environment?: string): Promise<YamlContent> => {
  return defaultReader.read(filePath, environment);
}

export const read = (filePath?: string, environment?: string): YamlContent => {
  return defaultReader.readSync(filePath, environment);
}

export default read;
