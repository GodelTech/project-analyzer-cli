#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const fileHound = require('filehound');
const parseGitIgnore = require('parse-gitignore');

const excludeGivenDeps = (report, depsListToExclude = []) => {
  return {
    ...report,
    dependencies: Object.keys(report.dependencies).reduce((acc, depName) => {
      if (!depsListToExclude.includes(depName)) {
        acc[depName] = report.dependencies[depName];
      }

      return acc;
    }, {})
  }
}

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
    gitIgnoredFolderPaths = parseGitIgnore(fs.readFileSync(path.resolve(projectPath, '.gitignore')))
      .join(', ')
      .replace(/([*.])/g, '\\$1');
      console.log(gitIgnoredFolderPaths)

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
        message: 'Select one or more package.json to analyze:',
        choices: packages,
      },
    ])).selectedPackages;

  const result = {
    name: projectName,
    dependencies: {},
  };

  for (const packagePath of selectedPackages) {
    console.log(`Collecting packages information for ${packagePath}...`);

    const package = JSON.parse(fs.readFileSync(packagePath));

    for (dependencyName of Object.keys(package?.dependencies ?? {})) {
      result.dependencies[dependencyName] = new Set(result.dependencies[dependencyName]);
      result.dependencies[dependencyName].add(package.dependencies[dependencyName] ?? 'unknown');
      result.dependencies[dependencyName] = Array.from(result.dependencies[dependencyName]);
    }

    for (dependencyName of Object.keys(package?.devDependencies ?? {})) {
      result.dependencies[dependencyName] = new Set(result.dependencies[dependencyName]);
      result.dependencies[dependencyName].add(package.devDependencies[dependencyName] ?? 'unknown');
      result.dependencies[dependencyName] = Array.from(result.dependencies[dependencyName]);
    }
  }

  const chosenToBeExcluded = (await inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: 'Select dependencies being excluded from the report (select nothing to include them all):',
        choices: Object.keys(result.dependencies),
      },
    ])).selected;

  const report = !chosenToBeExcluded?.length
    ? JSON.stringify(result, null, 2)
    : JSON.stringify(excludeGivenDeps(result, chosenToBeExcluded), null, 2);

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

    const projectNameToFileName = projectName
      ?.split(' ')
      .join('-')
      .toLowerCase() || 'report';

    fs.writeFileSync(__dirname + `/reports/${projectNameToFileName}-${date}.json`, data);

    process.exit(0);
  } else {
    console.warn('Analysis has been cancelled!');

    process.exit(-1);
  }
})();
