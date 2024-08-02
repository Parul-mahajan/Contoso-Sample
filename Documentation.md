# Project Documentation

## Overview

This repository contains a full-stack web application built with React and Azure Functions. The application is deployed on Azure Static Web Apps and utilizes various configurations and workflows to ensure smooth CI/CD and local development.

```

## Repository Structure

### Key Directories and Files

- **.github/workflows/**: Contains GitHub Actions workflows for CI/CD.
- **.vscode/**: Contains Visual Studio Code settings and configurations.
- **api/**: Contains the Azure Functions API code and configurations.
- **src/**: Contains the React application source code.
- **public/**: Contains public assets for the React application.
- **README.md**: Provides an overview and instructions for the project.
- **Documentation.md**: This file contains detailed documentation for the project.

## Local Development

To get started with local development, follow these steps:

1. Install the dependencies:

	```bash
	npm install -g @azure/static-web-apps-cli
	npm install
	cd api
	npm install
	```

2. Start the application:

	```bash
	swa start http://localhost:5173 --run "npm run dev" --api-location ./api
	```

3. Access the application at [http://localhost:4280](http://localhost:4280).

## Deployment

To deploy the application to Azure Static Web Apps:

1. Create a Static Web Apps resource from the Azure Portal.
2. Specify the following locations:
	- App location: `/`
	- API location: `api`
	- Output location: `dist`
3. Set the following environment variables in the Static Web Apps resource from the Azure Portal:
	- `COSMOSDB_KEY`: `<ENTER COSMOS DB KEY>`
	- `COSMOSDB_ENDPOINT`: `<ENTER COSMOS DB ENDPOINT>`

## CI/CD

The repository uses GitHub Actions for continuous integration and deployment. The workflow is defined in [`.github/workflows/azure-static-web-apps-kind-mud-0ff8cb503.yml`](.github/workflows/azure-static-web-apps-kind-mud-0ff8cb503.yml).

## Ignored Files

The repository uses `.gitignore` and `.funcignore` files to specify which files and directories should be ignored by Git and Azure Functions, respectively.

## Testing

The API uses Mocha for testing. To run the tests, use the following command:
    
    ```bash
    npm test
    ```