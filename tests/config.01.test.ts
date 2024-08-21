import { config, configAsync } from '../src/yaml-js.envyaml';

describe('Subject: config functions', () => {

  it('Scenario 01: Is should inject all the properties into process.env', async () => {
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
    config(filePath);
    expect(process.env).toEqual(expected);

    process.env = {};
    await configAsync(filePath);
    expect(process.env).toEqual(expected);
  });

  it('Scenario 02: Is does not override existing process.env properties', async () => {
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
    config(filePath);
    expect(process.env["app"]).toEqual(expected["app"]);
    expect(process.env["api"]).toEqual(expected["api"]);
    expect(process.env["env"]).toEqual("PRODUCTION");

    process.env = { env: "PRODUCTION" };
    await configAsync(filePath);
    expect(process.env["app"]).toEqual(expected["app"]);
    expect(process.env["api"]).toEqual(expected["api"]);
    expect(process.env["env"]).toEqual("PRODUCTION");
  });
});
