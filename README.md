# @godeltech/project-analyzer-cli

A tool for gathering information from package.json files of projects.

## Build

[![Azure DevOps builds (main)](https://img.shields.io/azure-devops/build/GodelTech/OpenSource/132?style=flat-square)](https://dev.azure.com/GodelTech/OpenSource/_build/latest?definitionId=132&branchName=main)
[![Azure DevOps tests (main)](https://img.shields.io/azure-devops/tests/GodelTech/OpenSource/132?style=flat-square)](https://dev.azure.com/GodelTech/OpenSource/_build/latest?definitionId=132&branchName=main)
[![Azure DevOps coverage (main)](https://img.shields.io/azure-devops/coverage/GodelTech/OpenSource/132?style=flat-square)](https://dev.azure.com/GodelTech/OpenSource/_build/latest?definitionId=132&branchName=main)

## Npm

[![Npm](https://img.shields.io/npm/v/@godeltech/project-analyzer-cli?style=flat-square)](https://www.npmjs.com/package/@godeltech/project-analyzer-cli)

## Requirements

- [Node](https://nodejs.org/en/download/)

  > Make sure you have Node in your environment path. Run `node -v` to check

  Required node: `>=20`

  Required npm: `>=10.5.0`

## How to use

- In the project directory, open the console

- Run `npx @godeltech/project-analyzer-cli@latest`

- Follow filling in required information

- Refort will be generated under `/reports` folder

## Related links
- [Filehound](https://github.com/nspragg/filehound)
- [Inquirer](https://github.com/SBoudrias/Inquirer.js)
- [Parse Gitignore](https://github.com/jonschlinkert/parse-gitignore)
- [semver](https://github.com/npm/node-semver)

## Report compatibility

  V1 reports are aligned with converting script in `/scripts`, to run it agains a report from v0 need to run

  ```
  npm run transform:v1
  ```
