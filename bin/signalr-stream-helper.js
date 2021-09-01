const { program } = require('commander');
const path = require('path');

const { createServer } = require('..');
const pkg = require('../package.json');

program.version(pkg.version);

program
  .argument('<filePath>', 'CSV file to use as source of messages')
  .option('-i, --interval <interval>', 'duration to wait between messages, in milliseconds', 1000)
  .option('-m, --message <message>', 'format string to use for each message', "{0}")
  .option('-p, --port <port>', 'port on which the server will listen', 8080)
  .option('-s, --silent', 'do not write text to stdout', false);

program.action((filePath, options) => {
  createServer({
    ...options,
    filePath: path.resolve(process.cwd(), filePath),
  });
});

program.parse(process.argv);
