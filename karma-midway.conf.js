// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
var sharedConfig = require('./karma-shared.conf');
module.exports = function(config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat([
    //extra testing code
    'node_modules/ng-midway-tester/src/ngMidwayTester.js',

    //test files
    'test/spec/midway/controllers/*.js'
  ]);

  config.set(conf);
};
