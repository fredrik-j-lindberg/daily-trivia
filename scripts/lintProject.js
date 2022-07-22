/* eslint-disable no-console */
const { exec } = require('child_process');
const { style } = require('./utils');

const runLinter = (baseCommand, args) => {
  const command = args ? `${baseCommand} ${args}` : baseCommand;
  exec(`script -q /dev/null ${command}`, (error, stdout, stderr) => {
    console.log(`Output from command '${style.bold(command)}':`);
    if (error || stderr) {
      console.log(stderr || stdout);
      console.log(`${baseCommand} linting finished with errors.`);
      console.log('Tip: Formatting errors can be fixed automatically by running \'npm run format\'');
      process.exit(1);
    }
    console.log(`${style.bold(baseCommand)} linting successful!`);
  });
};

runLinter('tsc');
runLinter('eslint', '. --ext=.ts,.tsx,.jsx,.js,.mjs --cache');
runLinter('prettier', '. --check');
