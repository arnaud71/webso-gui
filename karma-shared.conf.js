// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
module.exports = function() {
  return{
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],
    
    // list of files / patterns to load in the browser
    files: [
        //necessary moduls
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-resource/*.js',
        'app/bower_components/angular-sanitize/*.js',
        'app/bower_components/jquery/dist/jquery.js',
        'app/bower_components/ng-grid/build/ng-grid.debug.js',  
        'dist/bower_components/angular-route/angular-route.js', 
        'app/bower_components/angular-bootstrap/ui-bootstrap.js',
        'app/bower_components/checklist-model/checklist-model.js',

        //App-specific Code
        'app/scripts/app.js',
        'app/scripts/cfg.js',
        'app/scripts/controllers/*.js',
    ],
    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    // logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'
/*
    ,'Firefox', 'Opera'
*/
    ],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  }
};