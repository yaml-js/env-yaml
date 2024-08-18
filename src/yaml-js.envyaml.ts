export type AsyncConfigLoader = <T>(path: string, env: string) => Promise<T>

export type ConfigLoader = <T>(path: string, env: string) => T
