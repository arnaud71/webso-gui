var sharedConfig = require('./karma-shared.conf');
module.exports = function(config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat([
    //extra testing code
    'node_modules/ng-midway-tester/src/ngMidwayTester.js',

    //test files
    'test/spec/midway/controllers/*.js'
  ]);

  conf.proxies = {
    '/': 'http://albator.hesge.ch/web/webso-gui/'
  };

  conf.urlRoot = '/__karma__/';

  config.set(conf);
};
