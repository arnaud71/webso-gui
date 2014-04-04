//
// test/midway/controllers/controllersSpec.js
//
describe("Midway: Testing Controllers", function() {
  var tester, current, module;

  beforeEach(function() {
  	module = angular.module("websoApp");
    if(tester) {
      tester.destroy();
    }
    tester = ngMidwayTester('websoApp');
  });

  it("should have a module to test", function() {
	expect(module).not.toBe(null);
  });

  it('should load the SolrCtrl controller and templateUrl properly when / route is accessed', function(done) {
    tester.visit('/');
	expect(tester.path()).toBe('/');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(controller).toBe('SolrCtrl');
	expect(template).toMatch(/views\/comingsoon.html/);
  });

  it('should load the templateUrl properly when /home route is accessed', function(done) {
    tester.visit('/home');
	expect(tester.path()).toBe('/home');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/main.html/);
  });

  it('should load the SolrCtrl controller and templateUrl properly when /search route is accessed', function(done) {
    tester.visit('/search');
	expect(tester.path()).toBe('/search');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(controller).toBe('SolrCtrl');
	expect(template).toMatch(/views\/main.html/);	
  });

  it('should load the templateUrl properly when /validate/add route is accessed', function(done) {
    tester.visit('/validate/add');
	expect(tester.path()).toBe('/validate/add');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/information\/validate.html/);		
  });

  it('should load the templateUrl properly when /validate/display route is accessed', function(done) {
    tester.visit('/validate/display');
	expect(tester.path()).toBe('/validate/display');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/information\/validationList.html/);
  });

  it('should load the templateUrl properly when /watch/add route is accessed', function(done) {
    tester.visit('/watch/add');
	expect(tester.path()).toBe('/watch/add');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/watch\/watchAdd.html/);	
  });

 it('should load the templateUrl properly when /watch/sourceslist route is accessed', function(done) {
    tester.visit('/watch/sourceslist');
	expect(tester.path()).toBe('/watch/sourceslist');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/source\/list.html/);	
  });

 it('should load the templateUrl properly when /source/sourcesList route is accessed', function(done) {
    tester.visit('/source/sourcesList');
	expect(tester.path()).toBe('/source/sourcesList');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/source\/sourceList.html/);	
  });

 it('should load the templateUrl properly when /watch/watchList route is accessed', function(done) {
    tester.visit('/watch/watchList');
	expect(tester.path()).toBe('/watch/watchList');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/watch\/watchList.html/);	
  });

  it('should load the templateUrl properly when /publish/newsletter route is accessed', function(done) {
    tester.visit('/publish/newsletter');
	expect(tester.path()).toBe('/publish/newsletter');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/report\/createNL.html/);	
  });

  it('should load the templateUrl properly when /publish/report route is accessed', function(done) {
    tester.visit('/publish/report');
	expect(tester.path()).toBe('/publish/report');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/report\/createReport.html/);	
  });

  it('should load the templateUrl properly when /organize/survfolder route is accessed', function(done) {
    tester.visit('/organize/survfolder');
	expect(tester.path()).toBe('/organize/survfolder');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/organise.html/);	
  });

  it('should load the templateUrl properly when /organize/sourcesfolder route is accessed', function(done) {
    tester.visit('/organize/sourcesfolder');
	expect(tester.path()).toBe('/organize/sourcesfolder');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/organise.html/);	
  });

  it('should load the templateUrl properly when /organize/templates route is accessed', function(done) {
    tester.visit('/organize/templates');
	expect(tester.path()).toBe('/organize/templates');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/organise.html/);	
  });

  it('should load the templateUrl properly when /organize/collect route is accessed', function(done) {
    tester.visit('/organize/collect');
	expect(tester.path()).toBe('/organize/collect');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/organise.html/);	
  });

  it('should load the templateUrl properly when /organize/profile route is accessed', function(done) {
    tester.visit('/organize/profile');
	expect(tester.path()).toBe('/organize/profile');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/user\/userAdd.html/);	
  });

  it('should load the templateUrl properly when /organize/sources route is accessed', function(done) {
    tester.visit('/organize/sources');
	expect(tester.path()).toBe('/organize/sources');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/sources\/list.html/);	
  });

  it('should load the templateUrl properly when /organize/vfolder route is accessed', function(done) {
    tester.visit('/organize/vfolder');
	expect(tester.path()).toBe('/organize/vfolder');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/report\/reportList.html/);	
  });

  it('should load the templateUrl properly when /signin route is accessed', function(done) {
    tester.visit('/signin');
	expect(tester.path()).toBe('/signin');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/signin.html/);	
  });

  it('should load the templateUrl properly when /search/rss route is accessed', function(done) {
    tester.visit('/search/rss');
	expect(tester.path()).toBe('/search/rss');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/source\/searchNew.html/);	
  });

  it('should load the templateUrl properly when /settings/booklet route is accessed', function(done) {
    tester.visit('/settings/booklet');
	expect(tester.path()).toBe('/settings/booklet');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/settings.html/);
  });

  it('should load the templateUrl properly when /search/source route is accessed', function(done) {
    tester.visit('/search/source');
	expect(tester.path()).toBe('/search/source');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/source\/sourceList.html/);	
  });

  it('should load the AddSourceCtrl controller and templateUrl properly when /url/:id_url route is accessed', function(done) {
    tester.visit('/url/:id_url');
	expect(tester.path()).toBe('/url/:id_url');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(controller).toBe('AddSourceCtrl');
	expect(template).toMatch(/views\/source\/sourceAdd.html/);		
  });

  it('should load the GoogleFeedCtrl controller and templateUrl properly when /text/:id_text route is accessed', function(done) {
    tester.visit('/text/:id_text');
	expect(tester.path()).toBe('/text/:id_text');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(controller).toBe('GoogleFeedCtrl');
	expect(template).toMatch(/views\/source\/searchNew.html/);		
  });

  it('should load the AddInformationCtrl controller and templateUrl properly when /validate/:id_selection route is accessed', function(done) {
    tester.visit('/validate/:id_selection');
	expect(tester.path()).toBe('/validate/:id_selection');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(controller).toBe('AddInformationCtrl');
	expect(template).toMatch(/views\/information\/validate.html/);
  });

  it('should load the GoogleFeedCtrl controller and templateUrl properly when /source/searchNew route is accessed', function(done) {
    tester.visit('/source/searchNew');
	expect(tester.path()).toBe('/source/searchNew');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(controller).toBe('GoogleFeedCtrl');
	expect(template).toMatch(/views\/source\/searchNew.html/);		
  });

  it('should load the SourceDataCtrl controller and templateUrl properly when /source/list route is accessed', function(done) {
    tester.visit('/source/list');
	expect(tester.path()).toBe('/source/list');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(controller).toBe('SourceDataCtrl');
	expect(template).toMatch(/views\/source\/list.html/);		
  });

  it('should load the templateUrl properly when /source/sourceAdd route is accessed', function(done) {
    tester.visit('/source/sourceAdd');
	expect(tester.path()).toBe('/source/sourceAdd');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(template).toMatch(/views\/source\/sourceAdd.html/);		
  });

  it('should load the SolrCtrl controller and templateUrl properly when /search/webso route is accessed', function(done) {
    tester.visit('/search/webso');
	expect(tester.path()).toBe('/search/webso');
	var current = tester.inject('$route').current;
	var controller = current.controller;
	var scope = current.scope;
	var template = current.templateUrl;
	expect(controller).toBe('SolrCtrl');
	expect(template).toMatch(/views\/search\/webso.html/);		
  });
});
