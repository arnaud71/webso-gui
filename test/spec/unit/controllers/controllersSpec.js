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

  // exemple de test du caroussel
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
  scope,
  resource;

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

  // exemple de test de champs du formulaire remplie
  it('should have a working doAdd in the controller AddInformationCtrl', function() {
    expect(scope.inputUrl).toBeDefined();
    expect(scope.inputTags).toBeDefined();
    expect(scope.inputTitle).toBeDefined();
    expect(scope.inputDetails).toBeDefined();
  	scope.doAdd();
  	expect(scope.informationAddResult).toBeDefined();
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
  // exemple de test lors de l'affichage de la page des informations validées
 it('should have a working doSearch function service in the controller ValidationDataCtrl', function() {
 	scope.doSearch();
  	expect(scope.validationResult).toBeDefined();
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

  // exemple de test lors du click sur le bouton doAdd
  it('should have a working doAdd in the controller AddWatchCtrl', function() {
	expect(scope.inputUrl).toBeDefined();
    expect(scope.inputTags).toBeDefined();
    expect(scope.inputTitle).toBeDefined();
    expect(scope.inputDomain).toBeDefined(); 
    expect(scope.inputActivity).toBeDefined(); 
    expect(scope.inputFrequency).toBeDefined(); 
    expect(scope.inputFolderName).toBeDefined(); 
    expect(scope.inputCreationDate).toBeDefined();
  	scope.doAdd();
  	expect(scope.watchAddResult).toBeDefined();
  	expect(scope.sourceAddResult).toBeDefined();
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

  // exemple de test lors du click sur le bouton doAdd
  it('should have a working doAdd in the controller AddSourceCtrl', function() {
	expect(scope.inputType).toBeDefined();
    expect(scope.inputRefresh).toBeDefined();
    expect(scope.inputLevel).toBeDefined();
    expect(scope.inputUser).toBeDefined(); 

  	scope.doAdd();
  	expect(scope.sourceAddResult).toBeDefined();
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

  it('should have a working setPage function service in the controller SourceDataCtrl', function() {
    scope.setPage(100);
    expect(scope.currentPage).toBe(100);
    scope.setPage(-100);
    expect(scope.currentPage).toBe(-100);
    scope.setPage(100000000);
    expect(scope.currentPage).toBe(100000000);
  });

  it('should have doSearch function service in the controller SourceDataCtrl', function() {
    expect(scope.doSearch).toBeDefined();
  });

  // exemple de test lors de l'affichage de la page des sources
  it('should have a working doSearch function service in the controller SourceDataCtrl', function() {
    scope.doSearch();
    expect(scope.sourceResult).toBeDefined();
  });

  it('should have doDelete function service in the controller SourceDataCtrl', function() {
    expect(scope.doDelete).toBeDefined();
  });

  // exemple de test lors de la supprission d'une source
  it('should have a working doDelete function service in the controller SourceDataCtrl', function() {
	// supprimer une source
    // verifier le resultat lors de la supprission de la source
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

  // exemple de test lors de l'affichage de la page des sources
  it('should have a working doSearch function service in the controller WatchDataCtrl', function() {
    scope.doSearch();
    expect(scope.watchResult).toBeDefined();
  });

  it('should have doDelete function service in the controller WatchDataCtrl', function() {
    expect(scope.doDelete).toBeDefined();
  });
  // exemple de test lors de la supprission d'une source
  it('should have a working doDelete function service in the controller WatchDataCtrl', function() {
  	// supprimer une source
    // verifier le resultat lors de la supprission de la source
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

  it('should have a working doSearch function service in the controller GoogleFeedCtrl', function() {
  	// a faire ...
  });

  it('should have selectAll function service in the controller GoogleFeedCtrl', function() {
  	// a faire ...
  });

  it('should have a working selectAll function service in the controller GoogleFeedCtrl', function() {
  	// a faire ...
  });

  it('should have createOPML function service in the controller GoogleFeedCtrl', function() {
  	// a faire ...
  });

  it('should have a working createOPML function service in the controller GoogleFeedCtrl', function() {
  	// a faire ...
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

  it('should have a working doSearch function service in the controller SolrCtrl', function() {
  	// a faire ...
  });

  it('should have doSearchFromPage function service in the controller SolrCtrl', function() {
  	// a faire ...
  });

  it('should have a working doSearchFromPage function service in the controller SolrCtrl', function() {
  	// a faire ...
  });

  it('should have a working pageChanged function service in the controller SolrCtrl', function() {
  	// a faire ...
  });
});
/****************************************************************************************************/