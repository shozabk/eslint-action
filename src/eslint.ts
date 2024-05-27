/**
 * Run eslint on the files changed
 * @author Abdul Rehman
 */
import path from 'node:path';
import fs from 'node:fs';
import { notice, startGroup, endGroup, info } from '@actions/core';
import { exec } from '@actions/exec';

import { disableAnnotations } from './annotations';
import getChangedFiles from './get-changed-files';
import { eslintRules } from './eslint-rules';

// user inputs interface
export interface Inputs {
  token: string;
  annotations: boolean;
  eslintArgs: string[];
  eslintrc: boolean;
  autofix: boolean;
  binPath: string;
  extensions: string[];
}

/**
 * runEslint
 * @param {Inputs} inputs
 * @return {void}
 */
export const runEslint = async (inputs: Inputs): Promise<void> => {
  // Disabling annotations if user doesn't want to
  if (!inputs.annotations) {
    disableAnnotations();
  }

  // Getting the changed files
  const changedFiles = await getChangedFiles(inputs.token);

  //   Printing the changed files on the console
  startGroup('Files changed.');
  changedFiles.forEach((file) => info(`- ${file}`));
  endGroup();

  //   Getting only .js, .jsx, .ts, .tsx files to lint
  const files = changedFiles.filter((filename) => {
    const isFileSupported = inputs.extensions.find((ext) => filename.endsWith(`.${ext}`));
    return isFileSupported;
  });

  //   If no file to lint, exit
  if (files.length === 0) {
    notice('No files found. Skipping.');
    return;
  }

  //   Printing the files to lint on the console
  startGroup('Files for linting.');
  files.forEach((file) => info(`- ${file}`));
  endGroup();

  //   If user doesn't want to use eslintrc, then use the default eslintrc
  if (!inputs.eslintrc) {
    // Printing the default eslintrc on the console
    startGroup('Rules to apply');
    info(JSON.stringify(eslintRules, null, 2));
    endGroup();

    // Creating default .eslintrc file on user's project
    fs.writeFileSync('.eslintrc.json', JSON.stringify(eslintRules));
  }

  //   Options to run eslint
  const execOptions = [path.resolve(inputs.binPath, 'eslint'), ...files, ...inputs.eslintArgs].filter(Boolean);

  //   Installing required libs
  await exec('npm i eslint-config-airbnb --legacy-peer-deps');

  //   if auto-fix-before-test is true, then run eslint with --fix
  if (inputs.autofix) {
    //   Executing eslint
    execOptions.splice(1, 0, '--fix');
    await exec('node', execOptions);
  } else {
    //   Executing eslint
    await exec('node', execOptions);
  }
};
