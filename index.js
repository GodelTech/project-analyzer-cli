#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const http = require('http');
const inquirer = require('inquirer');
const fileHound = require('filehound');
const parseGitIgnore = require('parse-gitignore');


(async () => {

  const projectPath = process.cwd();

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

  const ignoredFoldersRegExp = ignored.ignoredFolders.split(',').map(d => new RegExp(d.trim()));

  console.log('! Processing, please wait...');

  const packages = fileHound.create()
    .paths(projectPath)
    .discard(ignoredFoldersRegExp)
    .match('package.json')
    .findSync();

  const selectedPackages = (await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'selectedPackages',
        message: 'Select one or more package.json to analyze:',
        choices: packages,
      },
    ])).selectedPackages;

  const results = {
    projectName,
    subProjects: [],
  };

  for (const packagePath of selectedPackages) {
    const data = require(packagePath);

    results.subProjects.push({
      name: data.name ?? 'unknown',
      version: data.version ?? 'unknown',
      dependencies: data.dependencies ?? [],
      devDependencies: data.devDependencies ?? [],
    });
  }

  const isConfirmed = (await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message: `Confirm that you agree to send this data: \n${JSON.stringify(results, null, 2)}`,
      },
    ])).isConfirmed;

  if (isConfirmed) {
    const data = new TextEncoder()
      .encode(JSON.stringify(results));

    const options = {
      hostname: 'localhost',
      port: 3004,
      path: '/projects',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      }
    };

    const req = http.request(options, res => {
      console.log(`! Results sent out, status code: ${res.statusCode}`);
    });

    req.on('error', error => { console.error(error); });

    req.write(data);
    req.end();
  }
  else {
    console.warn('! Analysis cancelled.');
  }
})();
