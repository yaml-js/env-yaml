interface ImportMetaEnv {
  NODE_ENV: string
  MODE: string
  DEV: boolean
  PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
