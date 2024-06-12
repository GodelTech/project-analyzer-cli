#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const fileHound = require('filehound');
const parseGitIgnore = require('parse-gitignore');


(async () => {

  const projectPath = (await inquirer
    .prompt([
      {
        type: 'input',
        name: 'projectPath',
        message: `Enter a project path (leave empty to use ${process.cwd()}):`,
      },
    ])).projectPath || process.cwd();

  const projectName = (await inquirer
    .prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter a project name:',
      },
    ])).projectName;

  let gitIgnoredFolderPaths = null;
  try {
    gitIgnoredFolderPaths = parseGitIgnore(fs.readFileSync(path.join(projectPath, '.gitignore')))
      .filter(d => d.startsWith('/'))
      .map(d => d.split('/')[1])
      .join(', ');

  } catch (e) {
    console.warn('! ".gitignore" file was not detected, please enter ignored folders manually.');
  }

  const enterManuallyLabel = 'Enter manually';

  const ignored = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'ignoredFolders',
        message: 'Confirm the ignored folders (based on ".gitignore"):',
        choices: [gitIgnoredFolderPaths, new inquirer.Separator(), enterManuallyLabel],
        when: () => gitIgnoredFolderPaths,
      },
      {
        type: 'input',
        name: 'manualEnteredIgnoredFolders',
        message: 'Input all ignored folders with ", " separator (e.g. node_modules, dist):',
        when: result => !gitIgnoredFolderPaths || result.ignoredFolders === enterManuallyLabel,
      }
    ]);

  if ('manualEnteredIgnoredFolders' in ignored) {
    ignored.ignoredFolders = ignored.manualEnteredIgnoredFolders;
  }

  const ignoredFoldersRegExp = ignored.ignoredFolders
    .split(',')
    .map(d => new RegExp(d.trim()));

  console.log('! Processing, please wait...');

  const packages = fileHound.create()
    .paths(path.resolve(projectPath))
    .discard(ignoredFoldersRegExp)
    .match('package.json')
    .findSync();

  const selectedPackages = (await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'selectedPackages',
        message: 'Select one or more package.json to analyze (use space to select):',
        choices: packages,
      },
    ])).selectedPackages;

  const results = [];

  for (const packagePath of selectedPackages) {
    console.log(`Collecting packages information for ${packagePath}...`);

    const package = JSON.parse(fs.readFileSync(packagePath));

    const result = {
      name: package.name ?? projectName,
      version: package.version ?? 'unknown',
      dependencies: {},
    }

    const packageFolder = path.dirname(packagePath);

    const subPackages = fileHound.create()
      .paths(`${packageFolder}/node_modules`)
      .match('package.json')
      .findSync();

    for(const subPackagePath of subPackages) {
      const subPackage = JSON.parse(fs.readFileSync(subPackagePath));

      if (subPackage.name) {
        result.dependencies[subPackage.name] = new Set(result.dependencies[subPackage.name]);
        result.dependencies[subPackage.name].add(subPackage.version ?? 'unknown');
        result.dependencies[subPackage.name] = Array.from(result.dependencies[subPackage.name]);
      }
    }

    results.push(result);
  }

  const report = JSON.stringify(results, null, 2);

  const isConfirmed = (await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message: `Confirm that you agree to save this data: \n${report}`,
      },
    ])).isConfirmed;

  if (isConfirmed) {
    const data = new TextEncoder()
      .encode(report);
    const date = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      year: 'numeric',
      month: 'short',
    }).split(' ').join('-');

    fs.writeFileSync(__dirname + `/reports/${projectName}-${date}.json`, data);

    process.exit(0);
  } else {
    console.warn('Analysis has been cancelled!');

    process.exit(-1);
  }
})();
