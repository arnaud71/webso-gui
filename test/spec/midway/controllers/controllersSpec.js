//
// test/midway/controllers/controllersSpec.js
//

describe("Midway: Testing Controllers", function() {

  var $rootScope, $state, $injector, myServiceMock;

  beforeEach(function() {

    module('websoApp', function($provide) {
      $provide.value('myService', myServiceMock = {});
    });

    inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
    })
  });

  it('should respond to URL #/home', function() {
  	var state = '/home';
    expect($state.href(state)).toEqual('#/home');
  });

  it('should respond to URL #/login', function() {
  	var state = '/login';
    expect($state.href(state)).toEqual('#/login');
  });

  it('should respond to URL #/publicRegister', function() {
  	var state = '/publicRegister';
    expect($state.href(state)).toEqual('#/publicRegister');
  });

  it('should respond to URL #/administratorRegister', function() {
    var state = '/administratorRegister';
    expect($state.href(state)).toEqual('#/administratorRegister');
  });

  it('should respond to URL #/counts', function() {
  	var state = '/counts';
    expect($state.href(state)).toEqual('#/counts');
  });

  it('should respond to URL #/validate/add', function() {
  	var state = '/validate/add';
    expect($state.href(state)).toEqual('#/validate/add');
  });

  it('should respond to URL #/validate/display', function() {
  	var state = '/validate/display';
    expect($state.href(state)).toEqual('#/validate/display');
  });

  it('should respond to URL #/watch/add', function() {
  	var state = '/watch/add';
    expect($state.href(state)).toEqual('#/watch/add');
  });

  it('should respond to URL #/watch/list', function() {
  	var state = '/watch/list';
    expect($state.href(state)).toEqual('#/watch/list');
  });

  it('should respond to URL #/source/list', function() {
  	var state = '/source/list';
    expect($state.href(state)).toEqual('#/source/list');
  });

  it('should respond to URL #/source/add', function() {
  	var state = '/source/add';
    expect($state.href(state)).toEqual('#/source/add');
  });

  it('should respond to URL #/publish/newsletter', function() {
  	var state = '/publish/newsletter';
    expect($state.href(state)).toEqual('#/publish/newsletter');
  });

  it('should respond to URL #/publish/report', function() {
  	var state = '/publish/report';
    expect($state.href(state)).toEqual('#/publish/report');
  });

  it('should respond to URL #/organize/survfolder', function() {
  	var state = '/organize/survfolder';
    expect($state.href(state)).toEqual('#/organize/survfolder');
  });

  it('should respond to URL #/organize/sourcesfolder', function() {
  	var state = '/organize/sourcesfolder';
    expect($state.href(state)).toEqual('#/organize/sourcesfolder');
  });

  it('should respond to URL #/organize/templates', function() {
  	var state = '/organize/templates';
    expect($state.href(state)).toEqual('#/organize/templates');
  });

  it('should respond to URL #/organize/collect', function() {
  	var state = '/organize/collect';
    expect($state.href(state)).toEqual('#/organize/collect');
  });

  it('should respond to URL #/organize/profile', function() {
  	var state = '/organize/profile';
    expect($state.href(state)).toEqual('#/organize/profile');
  });

  it('should respond to URL #/organize/sources', function() {
  	var state = '/organize/sources';
    expect($state.href(state)).toEqual('#/organize/sources');
  });

  it('should respond to URL #/organize/vfolder', function() {
  	var state = '/organize/vfolder';
    expect($state.href(state)).toEqual('#/organize/vfolder');
  });

  it('should respond to URL #/settings/booklet', function() {
  	var state = '/settings/booklet';
    expect($state.href(state)).toEqual('#/settings/booklet');
  });

  it('should respond to URL #/search/source', function() {
  	var state = '/search/source';
    expect($state.href(state)).toEqual('#/search/source');
  });

  it('should respond to URL #/search/rss', function() {
  	var state = '/search/rss';
    expect($state.href(state)).toEqual('#/search/rss');
  });

  it('should respond to URL #/search/webso', function() {
  	var state = '/search/webso';
    expect($state.href(state)).toEqual('#/search/webso');
  });

  it('should respond to URL #/url/:id_url', function() {
  	var state = '/url/:id_url';
    expect($state.href(state)).toEqual('#/url/');
  });

  it('should respond to URL #/text/:id_text', function() {
  	var state = '/text/:id_text';
    expect($state.href(state)).toEqual('#/text/');
  });

  it('should respond to URL #/validate/:id_selection', function() {
  	var state = '/validate/:id_selection';
    expect($state.href(state)).toEqual('#/validate/');
  });

});
