var sharedConfig = require('./karma-shared.conf');
module.exports = function(config) {
    var conf = sharedConfig();
    
    conf.files = conf.files.concat([
		'test/spec/e2e/controllers/*.js'
    ]);
	
	conf.proxies = {
		'/': 'http://albator.hesge.ch/web/webso-gui/'
	};
	
	conf.urlRoot = '/__karma__/';

	conf.frameworks = ['ng-scenario'];

    config.set(conf);
};
