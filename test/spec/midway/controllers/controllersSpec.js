//
// test/midway/controllers/controllersSpec.js
//
describe("Midway: Testing Controllers", function() {
  var tester, current;
  beforeEach(function() {
    if(tester) {
      tester.destroy();
    }
    tester = ngMidwayTester('websoApp');
  });

  it('pouvoir charger le controlleur "CarouselCtrl" proprement quand on accède à /home ', function(done) {
    tester.visit('#/home', function() {
      tester.path().should.eq('/home');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var scope = current.scope;
     expect(controller).to.eql('CarouselCtrl');
     done();
    });
  });

  it('pouvoir charger le controlleur "AddInformationCtrl" proprement quand on accède à /validate/add ', function(done) {
    tester.visit('#/validate/add', function() {
      tester.path().should.eq('/validate/add');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var scope = current.scope;
     expect(controller).to.eql('AddInformationCtrl');
     done();
    });
  });

  it('pouvoir charger le controlleur "ValidationDataCtrl" proprement quand on accède à /validate/display ', function(done) {
    tester.visit('#/validate/display', function() {
      tester.path().should.eq('/validate/display');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var scope = current.scope;
     expect(controller).to.eql('ValidationDataCtrl');
     done();
    });
  });

  it('pouvoir charger le controlleur "AddWatchCtrl" proprement quand on accède à /watch/add ', function(done) {
    tester.visit('#/watch/add', function() {
      tester.path().should.eq('/watch/add');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var scope = current.scope;
     expect(controller).to.eql('AddWatchCtrl');
     done();
    });
  });

  it('pouvoir charger le controlleur "AddSourceCtrl" proprement quand on accède à /source/sourceAdd ', function(done) {
    tester.visit('#/source/sourceAdd', function() {
      tester.path().should.eq('/source/AddSourceCtrl');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var scope = current.scope;
     expect(controller).to.eql('AddSourceCtrl');
     done();
    });
  });

 it('pouvoir charger le controlleur "SourceDataCtrl" proprement quand on accède à /source/sourcesList ', function(done) {
    tester.visit('#/source/sourcesList', function() {
      tester.path().should.eq('/source/sourcesList');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var scope = current.scope;
     expect(controller).to.eql('SourceDataCtrl');
     done();
    });
  });

 it('pouvoir charger le controlleur "WatchDataCtrl" proprement quand on accède à /watch/watchList ', function(done) {
    tester.visit('#/watch/watchList', function() {
      tester.path().should.eq('/watch/watchList');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var scope = current.scope;
     expect(controller).to.eql('WatchDataCtrl');
     done();
    });
  });

  it('pouvoir charger le controlleur "SolrCtrl" proprement quand on accède à /search/webso ', function(done) {
    tester.visit('#/search/webso', function() {
      tester.path().should.eq('/search/webso');
      var current = tester.inject('$route').current;
      var controller = current.controller;
      var scope = current.scope;
      expect(controller).to.eql('SolrCtrl');
      done();
    });
  });

});
