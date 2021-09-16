#!/usr/bin/env node
'use strict';

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { mochify } = require('@mochify/mochify');

const opts = yargs(hideBin(process.argv))
  .usage(
    '$0 [options] <spec...>',
    'Run Mocha tests in real browsers.',
    (cmd) => {
      cmd
        .example(
          '$0 --driver puppeteer --bundle browserify "./src/**/*.test.js" ',
          'Bundle all files matching the given spec using browserify and run them using @mochify/driver-puppeteer.'
        )
        .example(
          '$0 --esm --reporter dot --driver puppeteer "./src/**/*.test.js" ',
          'Run all tests matching the given spec as ES modules in puppeteer and use the "dot" reporter for output.'
        )
        .example(
          '$0 "./src/**/*.test.js" ',
          'Run all tests matching the given spec using the default configuration lookup.'
        )
        .example(
          '$0 --config mochify.webdriver.js "./src/**/*.test.js" ',
          'Run all tests matching the given spec using the configuration from mochify.webdriver.js.'
        )
        .epilogue(
          `Mochify Resources:
GitHub: https://github.com/mantoni/mochify.js`
        );
    }
  )
  .option('config', {
    alias: 'C',
    type: 'string',
    group: 'Options:',
    describe: 'Specify a config file, skipping default lookup'
  })
  .option('driver', {
    alias: 'D',
    type: 'string',
    group: 'Options:',
    describe: 'Specify the driver module'
  })
  .option('driver-option', {
    type: 'object',
    group: 'Options:',
    describe: 'Pass options to the driver'
  })
  .option('reporter', {
    alias: 'R',
    type: 'string',
    group: 'Options:',
    describe: 'Specify the Mocha reporter'
  })
  .option('bundle', {
    alias: 'B',
    type: 'string',
    group: 'Options:',
    describe: 'Bundle the resolved spec using the given command'
  })
  .option('esm', {
    type: 'boolean',
    group: 'Options:',
    describe: 'Run a local web server, inject spec files as ES modules'
  })
  .option('serve', {
    alias: 'S',
    type: 'string',
    group: 'Options:',
    describe:
      'Run tests in the context of a local web server, serve the given directory'
  })
  .option('server-option', {
    type: 'object',
    group: 'Options:',
    describe: 'Pass options to the server (requires --serve or --esm)'
  })
  .updateStrings({
    'Options:': 'Other:'
  })
  .wrap(process.stdout.columns ? Math.min(process.stdout.columns, 80) : 80)
  .parse();

if (opts['driver-option']) {
  opts.driver_options = opts['driver-option'];
}
if (opts['server-option']) {
  opts.server_options = opts['server-option'];
}

(async () => {
  if (opts._.length) {
    opts.spec = opts._;
  }
  delete opts._;
  try {
    const { exit_code } = await mochify(opts);
    process.exitCode = exit_code;
  } catch (e) {
    console.error(e.stack);
    process.exitCode = 1;
  }
})();
