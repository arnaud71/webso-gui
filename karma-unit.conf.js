// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
var sharedConfig = require('./karma-shared.conf');
module.exports = function(config) {
    var conf = sharedConfig();
    
    conf.files = conf.files.concat([
        //necessary moduls
        'app/bower_components/angular-mocks/angular-mocks.js',
        //Test-specific Code        
        'test/spec/unit/controllers/*.js'
    ]);

    config.set(conf);
};
