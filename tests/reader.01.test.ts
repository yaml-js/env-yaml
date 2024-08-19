import { Reader } from '../src/reader';

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
    const result = await reader.read(filePath)
    expect(result).toEqual(expected);
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
    const result = await reader.read(filePath, "dev")
    expect(result).toEqual(expected);
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
    const result = await reader.read(filePath, "qa")
    expect(result).toEqual(expected);
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
    const result = await reader.read(filePath, "production")
    expect(result).toEqual(expected);
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
    const result = await reader.read(filePath, "PROD")
    expect(result).toEqual(expected);
  });
});
