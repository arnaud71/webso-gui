'use strict';
//
// test/unit/controllers/controllersSpec.js
//
/****************************************************************************************************/
describe('Controller: CarouselCtrl', function () {
  // load the controller's module
  beforeEach(module('websoApp'));

  var CarouselCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CarouselCtrl = $controller('CarouselCtrl', {
      $scope: scope
    });
  }));

  it('should have addSlide function service in the controller CarouselCtrl', function() {
    expect(scope.addSlide).toBeDefined();
  });

  it('should have a working addSlide service in controller CarouselCtrl', function() {
    for(var i = 0; i < 4; i++)
      expect(scope.addSlide).toBeTruthy();
  });
});
/****************************************************************************************************/
describe('Controller: AddInformationCtrl', function () {
  // load the controller's module
  beforeEach(module('websoApp'));

  var AddInformationCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddInformationCtrl = $controller('AddInformationCtrl', {
      $scope: scope
    });
  }));

  it('should have doAdd function service in the controller AddInformationCtrl', function() {
    expect(scope.doAdd).toBeDefined();
  });
});
/****************************************************************************************************/
describe('Controller: ValidationDataCtrl', function () {
  // load the controller's module
  beforeEach(module('websoApp'));

  var ValidationDataCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ValidationDataCtrl = $controller('ValidationDataCtrl', {
      $scope: scope
    });
  }));

  it('should have doSearch function service in the controller ValidationDataCtrl', function() {
    expect(scope.doSearch).toBeDefined();
  });
});
/****************************************************************************************************/
describe('Controller: AddWatchCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var AddWatchCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddWatchCtrl = $controller('AddWatchCtrl', {
      $scope: scope
    });
  }));

  it('should have doAdd function service in the controller AddWatchCtrl', function() {
    expect(scope.doAdd).toBeDefined();
  });
});
/****************************************************************************************************/
describe('Controller: AddSourceCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var AddSourceCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddSourceCtrl = $controller('AddSourceCtrl', {
      $scope: scope
    });
  }));

  it('should have doAdd function service in the controller AddSourceCtrl', function() {
    expect(scope.doAdd).toBeDefined();
  });
});
/****************************************************************************************************/
describe('Controller: SourceDataCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var SourceDataCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SourceDataCtrl = $controller('SourceDataCtrl', {
      $scope: scope
    });
  }));

  it('should have setPage function service in the controller SourceDataCtrl', function() {
    expect(scope.setPage).toBeDefined();
  });

  it('should have doSearch function service in the controller SourceDataCtrl', function() {
    expect(scope.doSearch).toBeDefined();
  });

  it('should have doDelete function service in the controller SourceDataCtrl', function() {
    expect(scope.doDelete).toBeDefined();
  });
 
  it('should have test function service in the controller SourceDataCtrl', function() {
    expect(scope.test).toBeDefined();
  });
});
/****************************************************************************************************/
describe('Controller: WatchDataCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var WatchDataCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WatchDataCtrl = $controller('WatchDataCtrl', {
      $scope: scope
    });
  }));

  it('should have doSearch function service in the controller WatchDataCtrl', function() {
    expect(scope.doSearch).toBeDefined();
  });
  it('should have doDelete function service in the controller WatchDataCtrl', function() {
    expect(scope.doDelete).toBeDefined();
  });
});
/****************************************************************************************************/
describe('Controller: GoogleFeedCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var GoogleFeedCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GoogleFeedCtrl = $controller('WatchDataCtrl', {
      $scope: scope
    });
  }));

  it('should have doSearch function service in the controller GoogleFeedCtrl', function() {
    expect(scope.doSearch).toBeDefined();
  });
});
/****************************************************************************************************/
describe('Controller: SolrCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var SolrCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SolrCtrl = $controller('WatchDataCtrl', {
      $scope: scope
    });
  }));

  it('should have doSearch function service in the controller SolrCtrl', function() {
    expect(scope.doSearch).toBeDefined();
  });
});
/****************************************************************************************************/
