/* eslint-disable no-console */
const { exec } = require('child_process');
const { style } = require('./utils');

const runFormatter = (baseCommand, args) => {
  const command = args ? `${baseCommand} ${args}` : baseCommand;
  exec(`script -q /dev/null ${command}`, (error, stdout, stderr) => {
    console.log(`Output from command '${style.bold(command)}':`);
    if (error || stderr) {
      console.log(stderr || stdout);
      console.log(`${baseCommand} formatting finished with errors. Some formatting errors might require manual fixing`);
      process.exit(1);
    }
    console.log(`${style.bold(baseCommand)} formatting successful!`);
  });
};

runFormatter('eslint', '. --ext=.ts,.tsx,.jsx,.js,.mjs --cache --fix');
runFormatter('prettier', '. --check --write');
