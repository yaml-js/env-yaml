import { readAsync, Injector, inject, injectAsync } from '../src/yaml-js.envyaml';

describe('Subject: Injector class', () => {

  it('Scenario 01: Is should inject all the properties into process.env', () => {
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

    process.env = {};
    const injector = new Injector();
    injector.inject(expected);
    expect(process.env).toEqual(expected);

    process.env = {};
    inject(expected);
    expect(process.env).toEqual(expected);
  });

  it('Scenario 02: Is should inject all the properties into process.env when source is a promise', async () => {
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

    process.env = {};
    await injectAsync(readAsync({ filePath }));
    expect(process.env).toEqual(expected);
  });


  it('Scenario 03: Is does not override existing process.env properties', async () => {
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

    process.env = { env: "PRODUCTION" };
    await injectAsync(readAsync({ filePath }));
    expect(process.env["app"]).toEqual(expected["app"]);
    expect(process.env["api"]).toEqual(expected["api"]);
    expect(process.env["env"]).toEqual("PRODUCTION");
  });
});
