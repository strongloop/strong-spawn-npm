// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: strong-spawn-npm
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var spawn = require('child_process').spawn;
var extend = require('util')._extend;

if (process.platform !== 'win32') {
  module.exports = function spawnNpm(args, options) {
    return spawn('npm', args, options);
  };

} else {
  module.exports = function spawnNpm(args, options) {
    args = args || [];

    // Locate cmd.exe
    var cmd = process.env.COMSPEC || 'cmd.exe';

    // Apply cmd-safe c-style quoting.
    args = args.map(function(arg) {
      // See if there's need for quoting/escaping.
      if (!/[\t \r\n"\^&\|\(\)\>\<%!]/.test(arg))
        return arg;

      // Double up both backslashes and quotation marks. Double quotes inside
      // a quoted argument are reduced to a single one. By using this strategy
      // cmd.exe will always assume argument contents are "inside" quotation
      // marks, which prevents it from interpreting special characters like
      // %, ^, | etc.
      arg = arg.replace(/[\\"]/g, function(v) {
        return v + v;
      });

      // Wrap quotation marks around;
      arg = '"' + arg + '"';

      return arg;
    });

    // Build cmd.exe command line.
    var cmdLine = '/c npm.cmd ' + args.join(' ');

    options = extend({}, options || {});
    options.windowsVerbatimArguments = true;

    return spawn(cmd, [cmdLine], options);
  };
}

