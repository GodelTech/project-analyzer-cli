#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import * as fileHound from 'filehound';
import * as parseGitIgnore from 'parse-gitignore';

import excludeGivenDeps from './excludeDependencies';
import gatherDepandencies from './gatherDepandencies';
import generateFileName from './generateFileName';

(async () => {
  const projectPath =
    (
      await inquirer.prompt([
        {
          type: 'input',
          name: 'projectPath',
          message: `Enter a project path (leave empty to use ${process.cwd()}):`,
        },
      ])
    ).projectPath || process.cwd();

  const projectName = (
    await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter a project name:',
      },
    ])
  ).projectName;

  let gitIgnoredFolderPaths = null;
  try {
    gitIgnoredFolderPaths = parseGitIgnore(
      fs.readFileSync(path.resolve(projectPath, '.gitignore')),
    )
      .join(', ')
      .replace(/([*.])/g, '\\$1');
  } catch {
    console.warn(
      '! ".gitignore" file was not detected, please enter ignored folders manually.',
    );
  }

  const enterManuallyLabel = 'Enter manually';

  const ignored = await inquirer.prompt([
    {
      type: 'list',
      name: 'ignoredFolders',
      message: 'Confirm the ignored folders (based on ".gitignore"):',
      choices: [
        gitIgnoredFolderPaths,
        new inquirer.Separator(),
        enterManuallyLabel,
      ],
      when: () => gitIgnoredFolderPaths,
    },
    {
      type: 'input',
      name: 'manualEnteredIgnoredFolders',
      message:
        'Input all ignored folders with ", " separator (e.g. node_modules, dist):',
      when: (result) =>
        !gitIgnoredFolderPaths || result.ignoredFolders === enterManuallyLabel,
    },
  ]);

  if ('manualEnteredIgnoredFolders' in ignored) {
    ignored.ignoredFolders = ignored.manualEnteredIgnoredFolders;
  }

  const ignoredFoldersRegExp = ignored.ignoredFolders
    .split(',')
    .map((d: string) => new RegExp(d.trim()));

  console.log('! Processing, please wait...');

  const packages = fileHound
    .create()
    .paths(path.resolve(projectPath))
    .discard(ignoredFoldersRegExp)
    .match('package.json')
    .findSync();

  const selectedPackages = (
    await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedPackages',
        message: 'Select one or more package.json to analyze:',
        choices: packages,
      },
    ])
  ).selectedPackages;

  const result = gatherDepandencies(projectName, selectedPackages);

  const chosenToBeExcluded = (
    await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message:
          'Select dependencies being excluded from the report (select nothing to include them all):',
        choices: Object.keys(result.dependencies),
      },
    ])
  ).selected;

  const report = !chosenToBeExcluded?.length
    ? JSON.stringify(result, null, 2)
    : JSON.stringify(excludeGivenDeps(result, chosenToBeExcluded), null, 2);

  const isConfirmed = (
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'isConfirmed',
        message: `Confirm that you agree to save this data: \n${report}`,
      },
    ])
  ).isConfirmed;

  if (isConfirmed) {
    const data = new TextEncoder().encode(report);

    const fileName = generateFileName(projectName);
    const reportName = path.resolve(process.cwd(), `./reports/${fileName}`);

    fs.writeFileSync(reportName, data);

    process.exit(0);
  } else {
    console.warn('Analysis has been cancelled!');

    process.exit(1);
  }
})();
