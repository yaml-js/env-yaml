import { Reader, read, readAsync } from '../src/yaml-js.envyaml';

describe('Subject: Reader class', () => {

  it('Scenario 01: Is should read a single file successfully', async () => {
    const filePath = './tests/resources/global/config.yml';
    const expected = {
      env: "STAGING",
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://api.my-app.com",
        key: "${API_KEY}"
      }
    }

    const reader = new Reader();
    const result = await reader.read(true, filePath)
    expect(result).toEqual(expected);

    const resultReadSync = read({ filePath })
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await readAsync({ filePath})
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 02: Evironment file overrides settings from global one', async () => {
    const filePath = './tests/resources/global&dev/config.yml';
    const expected = {
      env: "STAGING",
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://stagging.my-app.com",
        key: "${API_KEY}"
      }
    }
    const reader = new Reader();
    const result = await reader.read(true, filePath, "dev")
    expect(result).toEqual(expected);

    const resultReadSync = read({ filePath, environment: "dev" })
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await readAsync({ filePath, environment: "dev"})
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 03: The correct environment (QA) configuration is used when multiple exist', async () => {
    const filePath = './tests/resources/all/config.yml';
    const expected = {
      env: "QA",
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://qa.my-app.com",
        key: "${API_KEY}"
      }
    }
    const reader = new Reader();
    const result = await reader.read(true, filePath, "qa")
    expect(result).toEqual(expected);

    const resultReadSync = read({filePath, environment: "qa"})
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await readAsync({filePath, environment: "qa"})
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 04: The correct environment (PROD) configuration is used when multiple exist', async () => {
    const filePath = './tests/resources/all/config.yml';
    const expected = {
      env: "PROD",
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://prod.my-app.com",
        key: "${API_KEY}"
      }
    }
    const reader = new Reader();
    const result = await reader.read(true, filePath, "production")
    expect(result).toEqual(expected);

    const resultReadSync = read({filePath, environment: "production"})
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await readAsync({filePath, environment: "production"})
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 05: If I am using an environment that has no configuration, I get only the global configuration', async () => {
    const filePath = './tests/resources/all/config.yml';
    const expected = {
      env: "STAGING",
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://api.my-app.com",
        key: "${API_KEY}"
      }
    }
    const reader = new Reader();
    const result = await reader.read(true, filePath, "PROD")
    expect(result).toEqual(expected);

    const resultReadSync = read({filePath, environment: "PROD"})
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await readAsync({filePath, environment: "PROD"})
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 06: Evironment file overrides settings from global one on folders that have dots on the name', async () => {
    const filePath = './tests/resources/global.and.dev/config.yml';
    const expected = {
      env: "STAGING",
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://stagging.my-app.com",
        key: "${API_KEY}"
      }
    }
    const reader = new Reader();
    const result = await reader.read(true, filePath, "dev")
    expect(result).toEqual(expected);

    const resultReadSync = read({filePath, environment: "dev"})
    expect(resultReadSync).toEqual(expected);

    const resultReadAsync = await readAsync({filePath, environment: "dev"})
    expect(resultReadAsync).toEqual(expected);
  });

  it('Scenario 07: It probes for files using both yml and yaml extensions', async () => {
    const filePathYml = './tests/resources/global/config';
    const filePathYaml = './tests/resources/global-yaml/config';
    const expected = {
      env: "STAGING",
      app: {
        name: "my-app",
        version: "1.0.0",
        description: "My App"
      },
      api: {
        url: "http://api.my-app.com",
        key: "${API_KEY}"
      }
    }

    const reader = new Reader();
    const resultYml = await reader.read(true, filePathYml)
    expect(resultYml).toEqual(expected);

    const resultYaml = await reader.read(true, filePathYaml)
    expect(resultYaml).toEqual(expected);
  });
});
