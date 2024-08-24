# YAML-JS EnvYaml

![NPM License](https://img.shields.io/npm/l/%40yaml-js%2Fenvyaml)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/yaml-js/env/build.yml)
![Sonar Quality Gate](https://img.shields.io/sonar/quality_gate/org.yaml-js.envyaml?server=https%3A%2F%2Fsonarcloud.io)
![Sonar Tech Debt](https://img.shields.io/sonar/tech_debt/org.yaml-js.envyaml?server=https%3A%2F%2Fsonarcloud.io)
![Sonar Coverage](https://img.shields.io/sonar/coverage/org.yaml-js.envyaml?server=https%3A%2F%2Fsonarcloud.io)
[![Known Vulnerabilities](https://snyk.io/test/github/yaml-js/env/badge.svg)](https://snyk.io/test/github/yaml-js/env/)
![GitHub Issues or Pull Requests](https://img.shields.io/github/issues/yaml-js/env)


YAML-JS EnvYaml is a modern replacement for traditional `.env` files, using YAML syntax. This tool provides a seamless way to manage environment configurations with enhanced readability and structure, making it ideal for modern JavaScript and TypeScript projects.

## Features

- **Complex Nested Configurations**: Supports deeply nested structures, allowing for more organized and hierarchical configuration files.
- **Easy Integration**: Simple and straightforward integration with existing JavaScript/TypeScript projects.
- **Environment Variables & Overrides**: Built-in support for using environment variables and overriding configurations based on the environment (e.g., development, production).

## Installation

To install YAML-JS EnvYaml in your project, run:

```bash
npm install @yaml-js/envyaml
```

or with yarn:

```bash
yarn add @yaml-js/envyaml
```

## Usage

### Basic Example

Create a .env.yaml file:

```yaml
settings:
  app:
    name: MyApp
    version: 1.0.0
    port: 3000
  database:
    host: localhost
    port: 5432
```

Also create coorespondent files for your developement environment, and name it .env.dev.yaml

```yaml
settings:
  app:
    port: 3001
  database:
    host: https://dev.db.org
```

and one other for the production environment, and name it .env.prod.yaml

```yaml
settings:
  app:
    port: 443
  database:
    host: https://prod.db.org
```

Load and use the configuration in your JavaScript/TypeScript project:

```typescript
import config from '@yaml-js/envyaml';

config('.env.yaml', process.env.NODE_ENV || 'development');

console.log(`App running on port: ${process.env.app.port}`);
console.log(`Database host: ${process.env.database.host}`);
```

### Environment Variable Overrides

You can override specific values using environment variables:

```yaml
settings:
  database:
    host: ${DB_HOST}
```

This allows you to inject environment-specific values without changing the configuration files.


## API

### config(filePath: string = '.env.yaml', environment: string = process.env.NODE_ENV): Config

* **filePath**: The path to the YAML configuration file.
* **environment**: The environment to load (e.g., development, production).

Initializes process.env with the configuration for the specified environment.

### Example
```typescript
import config from '@yaml-js/envyaml';
config();
```

## Advantages over .env Files

* **Readability**: YAML’s structured format is easier to read and maintain than flat .env files.
* **Hierarchy**: Organize your configurations into nested structures.
* **Flexibility**: Supports multiple environments in a single file.

## Contributing

Contributions are welcome! Please follow the steps below:

	1.	Fork the repository.
	2.	Create a new branch (git checkout -b feature/my-feature).
	3.	Make your changes and commit them (git commit -m 'Add my feature').
	4.	Push to the branch (git push origin feature/my-feature).
	5.	Open a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
