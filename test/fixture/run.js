/*
 * mochify.js
 *
 * Copyright (c) 2014 Maximilian Antoni <mail@maxantoni.de>
 *
 * @license MIT
 */
'use strict';

var spawn = require('child_process').spawn;
var path = require('path');

var bin = path.resolve(__dirname, '..', '..', 'bin', 'cmd.js');


function run(test, args, callback) {
  var mochify = spawn(bin, args, {
    cwd : path.resolve(__dirname, test)
  });

  var stdout = '';
  var handle = function (data) {
    stdout += data;
  };
  mochify.stdout.on('data', handle);
  mochify.stderr.on('data', handle);

  mochify.on('close', function (code) {
    callback(code, stdout);
  });
}

module.exports = run;
