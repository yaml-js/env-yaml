import { createConsoleLogger, Logger } from './logger'
import { YamlContent } from './types'

export class Injector {
  private logger: Logger

  constructor(logger?: Logger) {
    this.logger = logger ?? createConsoleLogger('EnvYaml.Injector', undefined, 'INFO')
  }

  public inject(source: YamlContent) {
    this.logger.info(() => `Injecting environment variables`)
    Object.keys(source).forEach((key) => {
      const value = source[key]
      if (Object.hasOwn(process.env, key)) {
        this.logger.debug(() => `Ignoring existing environment variable: ${key}`)
      } else {
        process.env[key] = value
      }
    })
  }
}

const defaultInjector = new Injector()
export const injectAsync = async (source: Promise<YamlContent>): Promise<void> => {
  const content = await source
  defaultInjector.inject(content)
}

export const inject = (content: YamlContent) => {
  defaultInjector.inject(content)
}

export default inject
