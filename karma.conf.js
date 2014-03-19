// karma.conf.js
var sharedConfig = require('./karma-shared.conf');
module.exports = function(config) {
  var conf = sharedConfig();
  
  conf.files = conf.files.concat([
      'node_modules/ng-midway-tester/src/ngMidwayTester.js',
      'dist/bower_components/angular-mocks/angular-mocks.js',
      'app/scripts/controllers/*.js',
      'test/spec/unit/**/*.js',
      'test/spec/midway/**/*.js'
    ]);

    // coverage reporter generates the coverage
    conf.reporters = ['progress', 'coverage'];

    conf.preprocessors = {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/scripts/controllers/*.js' : ['coverage']
    };

    // optionally, configure the reporter
    conf.coverageReporter = {
      type : 'html',
      dir : 'coverage/'
    };

    conf.plugins = [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher'
    ];

    config.set(conf);
};