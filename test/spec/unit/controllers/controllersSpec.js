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

describe('Controller: AddInformationCtrl', function(){
  var scope, resource, ctrl, httpBackendDoAdd;

  var fakeModal = {
    result: {
        then: function(confirmCallback, cancelCallback) {
            //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
            this.confirmCallBack = confirmCallback;
            this.cancelCallback = cancelCallback;
        }
    },
    close: function( item ) {
        //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
        this.result.confirmCallBack( item );
    },
    dismiss: function( type ) {
        //The user clicked cancel on the modal dialog, call the stored cancel callback
        this.result.cancelCallback( type );
    }
};

  beforeEach(module("websoApp"));

  beforeEach(inject(function($modal) {
      spyOn($modal, 'open').andReturn(fakeModal);
  }));

  beforeEach(inject(function ($controller, $rootScope, $httpBackend, _$modal_) {
    httpBackendDoAdd = $httpBackend;

    scope = $rootScope.$new();
    ctrl = $controller("AddInformationCtrl", {
      $scope: scope,
      $modal: _$modal_
    });

    var mock_data = {"test": 
    					[{ 	test : "test", 
    					}]
    				};

	var url = "http://localhost/cgi-bin/webso-services/db/put.pl?callback=JSON_CALLBACK&details_s=&level_sharing_i=1&tags_s=&title_t=&type_s=validation&url_s=";            
    httpBackendDoAdd.whenJSONP(url).respond(mock_data);
    httpBackendDoAdd.when('GET','views/main.html').respond(mock_data);
}));
  
afterEach(function() {
    httpBackendDoAdd.verifyNoOutstandingExpectation();
    httpBackendDoAdd.verifyNoOutstandingRequest();
});

  it('should set informationAddResult on successful doAdd', function() {
    scope.doAdd();
    scope.$apply();
    httpBackendDoAdd.flush();
    expect(scope.informationAddResult.test[0].test).toBe("test");
    expect(scope.informationAddResult.test[1]).toBeUndefined();
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

describe('Controller: ValidationDataCtrl', function(){
  var scope, resource, ctrl, httpBackendDoSearch;

  beforeEach(module("websoApp"));

  beforeEach(inject(function($controller, $rootScope, $httpBackend) {
    httpBackendDoSearch = $httpBackend;

    scope = $rootScope.$new();
    ctrl = $controller("ValidationDataCtrl", { $scope: scope});

    var mock_data = {"test": 
    					[{ 	test : "test"
    					}]
    				};
	var url = "http://localhost/cgi-bin/webso-services/db/get.pl?callback=JSON_CALLBACK&type_s=validation";
    httpBackendDoSearch.whenJSONP(url).respond(mock_data);
    httpBackendDoSearch.when('GET','views/main.html').respond(mock_data);
  }));

  it('should set validationResult on successful doSearch', function() {
    scope.doSearch();
    scope.$apply();
    httpBackendDoSearch.flush();
    expect(scope.validationResult.test[0].test).toBe("test");
    expect(scope.validationResult.test[1]).toBeUndefined();
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

  it('should have functions services in the controller AddWatchCtrl', function() {
    expect(scope.doAddSource).toBeDefined();
    expect(scope.doAddWatch).toBeDefined();
    expect(scope.checkSourceUrl).toBeDefined();
    expect(scope.testWatch).toBeDefined();
  });

  // exemple de test lors du click sur le bouton doAdd
  it('should have a working doAdd in the controller AddWatchCtrl', function() {
    expect(scope.filterOptions).toBeDefined();
    expect(scope.pagingOptions).toBeDefined();
    expect(scope.model).toBeDefined();
    expect(scope.gridOptionsSource).toBeDefined();
    expect(scope.tabsSource).toBeDefined();
    expect(scope.tabsWatch).toBeDefined();
    expect(scope.checkingSource).toBe(false);
    expect(scope.sourceChecked).toBe(false);
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

  it('should have test function service in the controller SourceDataCtrl', function() {
    expect(scope.test).toBeDefined();
  });  

  it('should have a working test function service in the controller SourceDataCtrl', function() {
    var $id = 1;
    var $url = "http://www.google.fr"; 
    expect(scope.test($id, $url)).toBeTruthy;
  });
});

describe('Controller: SourceDataCtrl', function(){
  var scope, resource, ctrl, httpBackendDoSearch, httpBackendDoDelete;

  beforeEach(module("websoApp"));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $resource, $httpBackend) {
    httpBackendDoSearch = $httpBackend;
    httpBackendDoDelete = $httpBackend;
    
    scope = $rootScope.$new();
    ctrl = $controller("SourceDataCtrl", { $scope: scope});

        var mock_data = {"test": 
    					[{ 	test : "test" 
    					}]
    				};

    var url_1 = "http://localhost/cgi-bin/webso-services/db/get.pl?callback=JSON_CALLBACK&type_s=source";
    var url_2 = "http://localhost/cgi-bin/webso-services/db/delete.pl?callback=JSON_CALLBACK&id=1";
                
    httpBackendDoSearch.whenJSONP(url_1).respond(mock_data);
    httpBackendDoDelete.whenJSONP(url_2).respond(mock_data);
    httpBackendDoSearch.when('GET','views/main.html').respond(mock_data);
  }));

  afterEach(function() {
    httpBackendDoSearch.verifyNoOutstandingExpectation();
    httpBackendDoSearch.verifyNoOutstandingRequest();
  });

  it('should set sourceResult on successful doSearch', function() {
    scope.doSearch();
    scope.$apply();
    httpBackendDoSearch.flush();
    expect(scope.sourceResult.test[0].test).toBe("test");
    expect(scope.sourceResult.test[1]).toBeUndefined();
  });

  // exemple de test lors de la supprission d'une source
  it('should have a working doDelete function service in the controller SourceDataCtrl', function() {
    // supprimer une source et verifier le resultat lors de la supprission de la source
    // scope.doDelete(1, 1);
    // expect(scope.sourceAddResult.id).toBe(1);
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
    // scope.doDelete(1, 1); 
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
    GoogleFeedCtrl = $controller('GoogleFeedCtrl', {
      $scope: scope
    });
  }));

  it('should have correct initialisations in the controller addSurvCtrl', function() {
    expect(scope.msgSelect).toBeDefined();
    expect(scope.mySelections).toBeDefined();
    expect(scope.foundRes).toBeDefined();
    expect(scope.nameController).toBeDefined();
    expect(scope.googleFeed).toBeDefined();
  });
  it('should have doSearch function service in the controller GoogleFeedCtrl', function() {
    expect(scope.doSearch).toBeDefined();
  });

  it('should have a working doSearch function service in the controller GoogleFeedCtrl', function() {
  // cas passant et non passant à faire
  });

  it('should have selectAll function service in the controller GoogleFeedCtrl', function() {
  	expect(scope.selectAll).toBeDefined();
  });

  it('should have a working selectAll function service in the controller GoogleFeedCtrl', function() {
    scope.selectAll();
    expect(scope.msgSelect).toBe('Deselect All');
  });

  it('should have a working selectAll function service in the controller GoogleFeedCtrl', function() {
    scope.msgSelect = 'Deselect All';
    scope.selectAll();
    expect(scope.msgSelect).toBe('Select All');
  });

  it('should have createOPML function service in the controller GoogleFeedCtrl', function() {
  	expect(scope.createOPML).toBeDefined();
  });

  it('should have a working createOPML function service in the controller GoogleFeedCtrl', function() {
    // cas passant et non passant à faire
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
    SolrCtrl = $controller('SolrCtrl', {
      $scope: scope
    });
  }));

  xit("can be declared 'xit'", function() {
    expect(true).toBe(false);
  });

  it('should have correct initialisations in the controller reportCtrl', function() {
    expect(scope.showFound).toBeDefined();
    expect(scope.currentPage).toBeDefined();
    expect(scope.maxSize).toBeDefined();
    expect(scope.bigCurrentPage).toBeDefined();
    expect(scope.myDataDate).toBeDefined();
    expect(scope.mySelectionsPeriod).toBeDefined();
    expect(scope.currentPeriod).toBeDefined();
    expect(scope.currentFq).toBeDefined();
    expect(scope.solr).toBeDefined();
    expect(scope.gridOptionsPeriod).toBeDefined();
  });

  it('should have doSearch function service in the controller SolrCtrl', function() {
    expect(scope.doSearch).toBeDefined();
  });

  it('should have a working doSearch function service in the controller SolrCtrl', function() {
  	scope.doSearch();
  	// cas passant et non passant à faire
  });

  it('should have doSearchFromPage function service in the controller SolrCtrl', function() {
  	expect(scope.doSearchFromPage).toBeDefined();
  });

  it('should have a working doSearchFromPage function service in the controller SolrCtrl', function() {
  	// cas passant et non passant à faire
  });

  it('should have pageChanged function service in the controller SolrCtrl', function() {
  	expect(scope.pageChanged).toBeDefined();
  });

  it('should have a working pageChanged function service in the controller SolrCtrl', function() {
  	// cas passant et non passant à faire
  });
});
/****************************************************************************************************/
describe('Controller: BarletCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var BarletCtrl,
  scope,
  routeParams;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $routeParams) {
	scope = $rootScope.$new();

	var $url = encodeURI ("url");
	var $text = encodeURI ("text");
	var $selection = encodeURI ("selection");

	routeParams = {id_url : $url, id_text : $text, id_selection : $selection};

		BarletCtrl = $controller('BarletCtrl', {
		  $scope: scope,
		  $routeParams : routeParams
		});	
	}));

	it('should have correct initialisations in the controller BarletCtrl', function() {
		expect(scope.textArg).toBeDefined();
		expect(scope.inputUrl).toBeDefined();
		expect(scope.searchTerm).toBeDefined();
	});

	it('should enter in "id_text" condition if it specified', inject(function($controller) {
		expect(scope.textArg).toBe('selection');
		expect(scope.searchTerm).toBe('text');
		expect(scope.inputUrl).toBe('selection');
	}));
});
/****************************************************************************************************/
describe('Controller: BarletCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var BarletCtrl,
  scope,
  routeParams;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $routeParams) {
	scope = $rootScope.$new();

	var $url = encodeURI ("url");

	routeParams = {id_url : $url};

		BarletCtrl = $controller('BarletCtrl', {
		  $scope: scope,
		  $routeParams : routeParams
		});	
	}));

	it('should have correct initialisations in the controller BarletCtrl', function() {
		expect(scope.textArg).toBeDefined();
		expect(scope.inputUrl).toBeDefined();
		expect(scope.searchTerm).toBeDefined();
	});

	it('should enter in "id_text" condition if it specified', inject(function($controller) {
		expect(scope.textArg).toBe('url');
		expect(scope.inputUrl).toBe('url');
	}));
});
/****************************************************************************************************/
describe('Controller: BarletCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var BarletCtrl,
  scope,
  routeParams;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $routeParams) {
	scope = $rootScope.$new();

	var $text = encodeURI ("text");

	routeParams = {id_text : $text};

		BarletCtrl = $controller('BarletCtrl', {
		  $scope: scope,
		  $routeParams : routeParams
		});	
	}));

	it('should have correct initialisations in the controller BarletCtrl', function() {
		expect(scope.textArg).toBeDefined();
		expect(scope.inputUrl).toBeDefined();
		expect(scope.searchTerm).toBeDefined();
	});

	it('should enter in "id_text" condition if it specified', inject(function($controller) {
		expect(scope.textArg).toBe('text');
		expect(scope.searchTerm).toBe('text');
	}));
});
/****************************************************************************************************/
describe('Controller: NLCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var NLCtrl,
  scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
	scope = $rootScope.$new();
		NLCtrl = $controller('NLCtrl', {
		  $scope: scope
		});
	}));

  it('should have correct initialisations in the controller NLCtrl', function() {
    expect(scope.emails).toBeDefined();
  });

  it('should have addItem function service in the controller NLCtrl', function() {
    expect(scope.addItem).toBeDefined();
  });

  it('should have a working addItem function service in the controller NLCtrl', function() {
  	// ajouter un email
  	scope.addItem('test3@mail.com');
  	// verifier que le mail a été bien ajouté dans l'array des mails
  	expect(scope.emails).toContain('test3@mail.com');
  });

  it('should have removeItem function service in the controller NLCtrl', function() {
    expect(scope.removeItem).toBeDefined();
  });

  it('should have a working removeItem function service in the controller NLCtrl', function() {
  	// ajouter un email
  	scope.addItem('test3@mail.com');
  	// supprimer un Item
  	scope.removeItem(2);
  	// verifier que l'item selectionné a été bien supprimé
  	expect(scope.emails).not.toContain('test3@mail.com');
  });
});
/****************************************************************************************************/
describe('Controller: DatepickerCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var DatepickerCtrl,
  scope, timeout, timeoutFun, httpBackend;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $httpBackend, $timeout) {
  httpBackend = $httpBackend;
	scope = $rootScope.$new();
	timeout = $timeout;
	timeoutFun = {
  		$timeout: function() {}
	};

		DatepickerCtrl = $controller('DatepickerCtrl', {
		  $scope: scope
		});

   var mock_data = {"test": 
              [{  test : "main.html", 
              }]
            };

    httpBackend.when('GET','views/main.html').respond(mock_data);
	}));

  it('should have correct initialisations in the controller DatepickerCtrl', function() {
    expect(scope.dateOptions).toBeDefined();
    expect(scope.freq).toBeDefined();
    expect(scope.options).toBeDefined();
  });

  it('should have today function service in the controller DatepickerCtrl', function() {
    expect(scope.today).toBeDefined();
  });

  it('should have a working today function service in the controller DatepickerCtrl', function() {
  	scope.today();
  	expect(scope.dt).toBeDefined();
  });

  it('should have toggleWeeks function service in the controller DatepickerCtrl', function() {
    expect(scope.toggleWeeks).toBeDefined();
  });

  it('should have a working toggleWeeks function service in the controller DatepickerCtrl', function() {
  	scope.toggleWeeks();
  	expect(scope.showWeeks).toBeDefined();
  	expect(scope.showWeeks).toBe(false);
  });

  it('should have clear function service in the controller DatepickerCtrl', function() {
    expect(scope.clear).toBeDefined();
  });

  it('should have a working clear function service in the controller DatepickerCtrl', function() {
  	scope.clear();
  	expect(scope.dt).toBeDefined();
  });

  it('should have disabled function service in the controller DatepickerCtrl', function() {
    expect(scope.disabled).toBeDefined();
  });

  it('should have a working disabled function service in the controller DatepickerCtrl', function() {
  	var date_1 = new Date('1980-01-06');
  	var mode_1 = 'day';
  	expect(scope.disabled(date_1, mode_1)).toBe(true);
  });

  it('should have a working disabled function service in the controller DatepickerCtrl', function() {
  	var date_1 = new Date('1980-01-02');
  	var mode_1 = 'day';
  	expect(scope.disabled(date_1, mode_1)).toBe(false);
  });

  it('should have a working disabled function service in the controller DatepickerCtrl', function() {
  	var date_1 = new Date();
  	var mode_1 = 'week';
  	expect(scope.disabled(date_1, mode_1)).toBe(false);
  });

  it('should have toggleMin function service in the controller DatepickerCtrl', function() {
    expect(scope.toggleMin).toBeDefined();
  });

  it('should have a working toggleMin function service in the controller DatepickerCtrl', function() {
  	scope.toggleMin();
  	expect(scope.minDate).toBeDefined();
  });

  it('should have open function service in the controller DatepickerCtrl', function() {
    expect(scope.open).toBeDefined();
  });

  it('should have a working open function service in the controller DatepickerCtrl', function() {
  	scope.open();
	timeout.flush();
  });
});
/****************************************************************************************************/
describe('Controller: reportCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var reportCtrl,
  scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
	scope = $rootScope.$new();
		reportCtrl = $controller('reportCtrl', {
		  $scope: scope
		});
	}));

  it('should have correct initialisations in the controller reportCtrl', function() {
    expect(scope.options).toBeDefined();
    expect(scope.format).toBeDefined();
    expect(scope.template).toBeDefined();
    expect(scope.inputTitle).toBeDefined();
    expect(scope.reportAdd).toBeDefined();
  });

  it('should have doAdd function service in the controller reportCtrl', function() {
  	scope.doAdd();
  	expect(scope.reportAddResult).toBeDefined();

  	// cas passant et non passant à faire
  });
});
/****************************************************************************************************/
describe('Controller: UnderconstructionCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var UnderconstructionCtrl,
  scope;

  var fakeModal = {
    result: {
        then: function(confirmCallback, cancelCallback) {
            //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
            this.confirmCallBack = confirmCallback;
            this.cancelCallback = cancelCallback;
        }
    },
    close: function( item ) {
        //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
        this.result.confirmCallBack( item );
    },
    dismiss: function( type ) {
        //The user clicked cancel on the modal dialog, call the stored cancel callback
        this.result.cancelCallback( type );
    }
};

beforeEach(inject(function($modal) {
    spyOn($modal, 'open').andReturn(fakeModal);
}));


// Initialize the controller and a mock scope
beforeEach(inject(function ($controller, $rootScope, _$modal_) {
  scope = $rootScope.$new();
  UnderconstructionCtrl = $controller('UnderconstructionCtrl', {
    $scope: scope,
    $modal: _$modal_
  });
}));

  it('should have working confirm callBack button in modal service in the controller informationOkCtrl', function() {
    expect(scope.selected).toBeUndefined();
    scope.open(); // Open the modal
    fakeModal.close("selectedItem"); //Call confirm (simulating clicking the ok button on the modal)
    expect(scope.selected).toBe('selectedItem');
  });

  it('should have working cancel callBack button in modal service in the controller informationOkCtrl', function() {
    expect(scope.selected).toBeUndefined();
    scope.open(); // Open the modal
    fakeModal.dismiss("selectedItem"); //Call cancel (simulating clicking the cancel button on the modal)
    expect(scope.selected).toBeUndefined();
  });
});
/****************************************************************************************************/
describe('Controller: informationOkCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var informationOkCtrl,
  scope;

  var fakeModal = {
    result: {
        then: function(confirmCallback, cancelCallback) {
            //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
            this.confirmCallBack = confirmCallback;
            this.cancelCallback = cancelCallback;
        }
    },
    close: function( item ) {
        //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
        this.result.confirmCallBack( item );
    },
    dismiss: function( type ) {
        //The user clicked cancel on the modal dialog, call the stored cancel callback
        this.result.cancelCallback( type );
    }
};

	beforeEach(inject(function($modal) {
	    spyOn($modal, 'open').andReturn(fakeModal);
	}));


	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, _$modal_) {
	  scope = $rootScope.$new();
	  informationOkCtrl = $controller('informationOkCtrl', {
	    $scope: scope,
	    $modal: _$modal_
	  });
	}));

  it('should have working confirm callBack button in modal service in the controller informationOkCtrl', function() {
    expect(scope.selected).toBeUndefined();
    scope.open(); // Open the modal
    fakeModal.close("selectedItem"); //Call confirm (simulating clicking the ok button on the modal)
    expect(scope.selected).toBe('selectedItem');
  });

  it('should have working cancel callBack button in modal service in the controller informationOkCtrl', function() {
    expect(scope.selected).toBeUndefined();
    scope.open(); // Open the modal
    fakeModal.dismiss("selectedItem"); //Call cancel (simulating clicking the cancel button on the modal)
    expect(scope.selected).toBeUndefined();
  });
});
/****************************************************************************************************/
describe('Controller: treeCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var treeCtrl,
  scope,
  httpBackendDelete,
  httpBackendAdd,
  mock_data;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
	scope = $rootScope.$new();
		treeCtrl = $controller('treeCtrl', {
		  $scope: scope
		});

    mock_data = {"nodes": 
                        [{  node_test : "test"
                        }]
                };

    httpBackendDelete = $httpBackend;            
    httpBackendAdd = $httpBackend;

    httpBackendDelete.when(scope.add).respond(mock_data);
    httpBackendAdd.when(scope.delete).respond(mock_data);
	}));

  it('should have delete function service in the controller treeCtrl', function() {
  	expect(scope.delete).toBeDefined();
  	// cas passant et non passant à faire
  });
  it('should have add function service in the controller treeCtrl', function() {
  	expect(scope.add).toBeDefined();
  	// cas passant et non passant à faire
  });
  it('should have a working delete function service in the controller treeCtrl', function() {
    expect(mock_data.nodes[0].node_test).toBeDefined();
    scope.delete(mock_data);
    expect(mock_data.nodes[0]).toBeUndefined();
  });
  it('should have a working add function service in the controller treeCtrl', function() {
    expect(mock_data.nodes[0].node_test).toBeDefined();
    expect(mock_data.nodes[1]).toBeUndefined();
    scope.add(mock_data);
    expect(mock_data.nodes[1].name).toBeDefined();
    expect(mock_data.nodes[1].nodes).toBeDefined();
  });
});
/****************************************************************************************************/
describe('Controller: AccordionDemoCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var AccordionDemoCtrl,
  scope,
  httpBackendItems,
  mock_data;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
	scope = $rootScope.$new();
		AccordionDemoCtrl = $controller('AccordionDemoCtrl', {
		  $scope: scope
		});

    httpBackendItems = $httpBackend;
    mock_data = {"items": 
                        [{  item_test : "item"
                        }]
                };

    httpBackendItems.when(scope.addItem).respond(mock_data);

	}));

  it('should have addItem function service in the controller AccordionDemoCtrl', function() {
  	expect(scope.addItem).toBeDefined();
  });

  it('should have a working addItem function service in the controller AccordionDemoCtrl', function() {
    // cas passant et non passant à faire
    // scope.addItem();
  });
});
/****************************************************************************************************/
describe('Controller: displayValidatedInfosCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var displayValidatedInfosCtrl,
  scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
	scope = $rootScope.$new();
		displayValidatedInfosCtrl = $controller('displayValidatedInfosCtrl', {
		  $scope: scope
		});
	}));

  it('should have doSearch function service in the controller displayValidatedInfosCtrl', function() {
  	expect(scope.doSearch).toBeDefined();
  	expect(scope.informationResult).toBeDefined();

  	// cas passant et non passant à faire
  });
});
/****************************************************************************************************/
describe('Controller: displayReportCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var displayReportCtrl,
  scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
	scope = $rootScope.$new();
		displayReportCtrl = $controller('displayReportCtrl', {
		  $scope: scope
		});
	}));

  it('should have doSearch function service in the controller displayReportCtrl', function() {
  	expect(scope.doSearch).toBeDefined();
  	expect(scope.reportResult).toBeDefined();
  	
  	// cas passant et non passant à faire
  });
});
/****************************************************************************************************/
describe('Controller: displaySurveillanceCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var displaySurveillanceCtrl,
  scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
	scope = $rootScope.$new();
		displaySurveillanceCtrl = $controller('displaySurveillanceCtrl', {
		  $scope: scope
		});
	}));

  it('should have doSearch function service in the controller displaySurveillanceCtrl', function() {
  	expect(scope.doSearch).toBeDefined();
  	scope.doSearch();
  	expect(scope.surveillanceResult).toBeDefined();
  	
  	// cas passant et non passant à faire
  });
});
/****************************************************************************************************/
describe('Controller: getValidatedDataCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var getValidatedDataCtrl,
  scope,
  httpBackendJson,
  mock_data;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
	scope = $rootScope.$new();
		getValidatedDataCtrl = $controller('getValidatedDataCtrl', {
		  $scope: scope
		});
  	httpBackendJson = $httpBackend;
    mock_data = "data";
    httpBackendJson.when('GET','/data/example.json').respond(mock_data);
  }));

  it('should have a working add function service in the controller treeCtrl', function() {
    // cas passant et non passant à faire
    // expect(scope.pages).toBe(mock_data);
  });
  	
});
/****************************************************************************************************/
describe('Controller: menuCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var menuCtrl,
  scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
	scope = $rootScope.$new();
		menuCtrl = $controller('menuCtrl', {
		  $scope: scope
		});
	}));

  it('should have correct initialisations in the controller reportCtrl', function() {
    // effacé par le développeur
  });
  	// cas passant et non passant à faire
});
/****************************************************************************************************/
describe('Controller: addInfoCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var addInfoCtrl,
  scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
	scope = $rootScope.$new();
		addInfoCtrl = $controller('addInfoCtrl', {
		  $scope: scope
		});
	}));

  it('should have correct initialisations in the controller addInfoCtrl', function() {
    expect(scope.inputLevel).toBeDefined();
    expect(scope.inputUrl).toBeDefined();
    expect(scope.inputTitle).toBeDefined();
    expect(scope.inputDetail).toBeDefined();
    expect(scope.inputComment).toBeDefined();
    expect(scope.inputRefresh).toBeDefined();
    expect(scope.informationAdd).toBeDefined();
  });

  it('should have doAdd function service in the controller addInfoCtrl', function() {
  	expect(scope.doAdd).toBeDefined();
  	scope.doAdd();
  	expect(scope.informationAddResult).toBeDefined();
  	
  	// cas passant et non passant à faire
  });
});
/****************************************************************************************************/
describe('Controller: addSurvCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var addSurvCtrl,
  scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
	scope = $rootScope.$new();
		addSurvCtrl = $controller('addSurvCtrl', {
		  $scope: scope
		});
	}));

  it('should have correct initialisations in the controller addSurvCtrl', function() {
    expect(scope.inputType).toBeDefined();
    expect(scope.inputLevel).toBeDefined();
    expect(scope.inputUser).toBeDefined();
    expect(scope.inputUrl).toBeDefined();
    expect(scope.inputTitle).toBeDefined();
    expect(scope.inputDetail).toBeDefined();
    expect(scope.inputComment).toBeDefined();

    expect(scope.inputRefresh).toBeDefined();
    expect(scope.inputTitle).toBeDefined();
    expect(scope.inputTag).toBeDefined();
    expect(scope.inputDomain).toBeDefined();
    expect(scope.inputActivity).toBeDefined();
    expect(scope.inputFrequency).toBeDefined();
    expect(scope.surveillanceAdd).toBeDefined();
  });

  it('should have doAdd function service in the controller addSurvCtrl', function() {
  	expect(scope.doAdd).toBeDefined();
  	scope.doAdd();
  	expect(scope.surveillanceAddResult).toBeDefined();
  	
  	// cas passant et non passant à faire
  });
});
/****************************************************************************************************/
describe('Controller: ngCkeditor', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var ngCkeditor,
  scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
	scope = $rootScope.$new();
		ngCkeditor = $controller('ngCkeditor', {
		  $scope: scope
		});
	}));
  it('should have a working function service in the controller ngCkeditor', function() {
    expect(scope.editorOptions.language).toBe('ru');
    expect(scope.editorOptions.uiColor).toBe('#000000');
  });
});
/****************************************************************************************************/
describe('Controller: SourceListCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var SourceListCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
  scope = $rootScope.$new();
    SourceListCtrl = $controller('SourceListCtrl', {
      $scope: scope
    });
  }));

  it('should have correct initialisations in the controller addSurvCtrl', function() {
    expect(scope.sourceList).toBeDefined();
    expect(scope.filterOptions).toBeDefined();
    expect(scope.totalServerItems).toBeDefined();
    expect(scope.pagingOptions).toBeDefined();
    expect(scope.gridOptionsSource).toBeDefined();
  });

  it('should have setPagingData function service in the controller SourceDataCtrl', function() {
    expect(scope.setPagingData).toBeDefined();
  });
  it('should have a working setPagingData function service in the controller SourceDataCtrl', function() {
  });

  it('should have getPagedDataAsync function service in the controller SourceDataCtrl', function() {
    expect(scope.getPagedDataAsync).toBeDefined();
  });
  it('should have a working getPagedDataAsync function service in the controller SourceDataCtrl', function() {
  });

  it('should have doSearch function service in the controller SourceDataCtrl', function() {
    expect(scope.doSearch).toBeDefined();
  });
  it('should have a working doSearch function service in the controller SourceDataCtrl', function() {
    scope.doSearch();
  });

  it('should have doDelete function service in the controller SourceDataCtrl', function() {
    expect(scope.doDelete).toBeDefined();
  });
  it('should have a working doDelete function service in the controller SourceDataCtrl', function() {  
    // cas passant et non passant à faire
  });
});
/****************************************************************************************************/
describe('Controller: WatchListCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var WatchListCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
  scope = $rootScope.$new();
    WatchListCtrl = $controller('WatchListCtrl', {
      $scope: scope
    });
  }));

  it('should have correct initialisations in the controller WatchListCtrl', function() {
    expect(scope.watchList).toBeDefined();
    expect(scope.filterOptions).toBeDefined();
    expect(scope.totalServerItems).toBeDefined();
    expect(scope.setPagingData).toBeDefined();
    expect(scope.getPagedDataAsync).toBeDefined();
  });

  it('should have a working watch function in controller WatchListCtrl', function() {
  });
 }); 
/****************************************************************************************************/
describe('Controller: ValidationListCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var ValidationListCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
  scope = $rootScope.$new();
    ValidationListCtrl = $controller('ValidationListCtrl', {
      $scope: scope
    });
  }));

  it('should have correct initialisations in the controller ValidationListCtrl', function() {
    expect(scope.validationList).toBeDefined();
    expect(scope.filterOptions).toBeDefined();
    expect(scope.totalServerItems).toBeDefined();
    expect(scope.getPagedDataAsync).toBeDefined();
    expect(scope.gridOptionsSource).toBeDefined();
  });
  it('should have a working setPagingData function in the controller ValidationListCtrl', function() {
  });
});
/****************************************************************************************************/

describe('Controller: CollapseSolrCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var CollapseSolrCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
  scope = $rootScope.$new();
    CollapseSolrCtrl = $controller('CollapseSolrCtrl', {
      $scope: scope
    });
  }));

  it('should have a working CollapseSolrCtrl in the controller ValidationListCtrl', function() {
  	expect(scope.isCollapsed).toBe(true);
  });
});
/****************************************************************************************************/
describe('Controller: publicRegisterCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var publicRegisterCtrl, httpBackendRegister, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
  httpBackendRegister = $httpBackend;
  
  scope = $rootScope.$new();
    publicRegisterCtrl = $controller('publicRegisterCtrl', {
      $scope: scope
    });


    var mock_data = {"test": 
    					[{ 	test : "test", 
    					}]
    				};

	var url = "http://localhost/cgi-bin/webso-services/db/register.pl?callback=JSON_CALLBACK&role_s=veilleur"; 

    httpBackendRegister.whenJSONP(url).respond(mock_data);
    httpBackendRegister.when('GET','views/main.html').respond(mock_data);
  }));

  it('should have a working publicRegisterCtrl controller ', function() {
  	expect(scope.register).toBeDefined();
  	expect(scope.isSuccess).toBeDefined();
  	expect(scope.isSuccess).toBe(false);
  	expect(scope.informationAdd).toBeDefined();
    expect(scope.verifyLogin).toBeDefined();
  	scope.register();
    scope.$apply();
    httpBackendRegister.flush();
  	expect(scope.isSuccess).toBe(false);
  	expect(scope.message).toBeUndefined();
  	expect(scope.username).toBeUndefined();
  	expect(scope.password).toBeUndefined();
  });
});
/****************************************************************************************************/
describe('Controller: administratorRegisterCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var administratorRegisterCtrl, httpBackendRegister, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
  httpBackendRegister = $httpBackend;  	
  scope = $rootScope.$new();
    administratorRegisterCtrl = $controller('administratorRegisterCtrl', {
      $scope: scope
    });

    var mock_data = {"test": 
    					[{ 	test : "test", 
    					}]
    				};

	var url = "http://localhost/cgi-bin/webso-services/db/register.pl?callback=JSON_CALLBACK&role_s=lecteur";            
    httpBackendRegister.whenJSONP(url).respond(mock_data);
    httpBackendRegister.when('GET','views/main.html').respond(mock_data);    
  }));

  it('should have a working administratorRegisterCtrl controller ', function() {
  	var $roles = ['administrateur', 'veilleur', 'lecteur'];
  	expect(scope.register).toBeDefined();
  	expect(scope.isSuccess).toBeDefined();
  	expect(scope.isSuccess).toBe(false);
  	expect(scope.informationAdd).toBeDefined();
  	expect(scope.roles).toBeDefined();
  	expect(scope.userRole).toBe($roles[2]);
  	scope.register();
    scope.$apply();
    httpBackendRegister.flush();
  	expect(scope.isSuccess).toBe(false);
  	expect(scope.message).toBeUndefined();
  	expect(scope.username).toBeUndefined();
  	expect(scope.password).toBeUndefined();
  });
});
/****************************************************************************************************/
describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var LoginCtrl, httpBackendlogin, scope;



  var headerCtrl, getDataMock, scope, restrictions,cookieStoreMocked;
  
  var cookieStoreMocked = {
        get : function(cookie) {
          if(cookie === 'username'){
            return 'name';
          }else if(cookie === 'password'){
            return 'password';
          }else if (cookie === 'Authenticated'){
            return true;
          }
        }
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend, $cookieStore) {
  httpBackendlogin = $httpBackend;  	
  scope = $rootScope.$new();
    LoginCtrl = $controller('LoginCtrl', {
      $scope: scope,
      $cookieStore : cookieStoreMocked
    });

    var mock_data = {"test": 
    					[{ 	test : "test", 
    					}]
    				};

	var url = "http://localhost/cgi-bin/webso-services/db/login.pl?callback=JSON_CALLBACK&password_s=password&user_s=name";            
    httpBackendlogin.whenJSONP(url).respond(mock_data);
    httpBackendlogin.when('GET','views/main.html').respond(mock_data);    
  }));

  it('should have a working LoginCtrl controller ', function() {
  	expect(scope.isError).toBeDefined();
  	expect(scope.verifyLogin).toBeDefined();
    spyOn(cookieStoreMocked, 'get');
    scope.isAuthenticated = cookieStoreMocked.get('Authenticated');
  	scope.login();
    scope.$apply();
    httpBackendlogin.flush();
  });
});
/****************************************************************************************************/
describe('Controller: UsersCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var UsersCtrl,
  scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
  scope = $rootScope.$new();
    UsersCtrl = $controller('UsersCtrl', {
      $scope: scope
    });
  }));

  it('should have correct initialisations in the controller UsersCtrl', function() {
    expect(scope.isSuccess).toBe(false);
    expect(scope.userList).toBeDefined();
    expect(scope.filterOptions).toBeDefined();
    expect(scope.totalServerItems).toBe(0);
    expect(scope.pagingOptions).toBeDefined();
    expect(scope.setPagingData).toBeDefined();
    expect(scope.getPagedDataAsync).toBeDefined();
    expect(scope.$watch).toBeDefined();
    expect(scope.roles).toBeDefined();
    expect(scope.userRole).toBe('lecteur');
    expect(scope.gridOptionsSource).toBeDefined();
    expect(scope.userResult).toBeDefined();
    expect(scope.countDelete).toBeDefined();
    expect(scope.deleteCount).toBeDefined();
    expect(scope.roleModify).toBeDefined();
    expect(scope.modifyRole).toBeDefined();
  });

  it('should have correct modifyRole function in the controller UsersCtrl', function() {
    scope.modifyRole(1, 'veilleur', 1);
  });

});
/****************************************************************************************************/
describe("Service : serviceRestrictions", function() {
  beforeEach(module('websoApp'));

  it('should have a working serviceRestrictions service',
    inject(['serviceRestrictions',function($serviceRestrictions) {
    var restrictions = [true, true, true];
    expect($serviceRestrictions.setRestrictions(restrictions));
    expect($serviceRestrictions.getRestrictions()).toBeDefined();
    expect($serviceRestrictions.getRestrictions()).toBe(restrictions);
  }]));

});
/****************************************************************************************************/
describe('Controller: headerCtrl', function () {

  // load the controller's module
  beforeEach(module('websoApp'));

  var headerCtrl, getDataMock, scope, restrictions;
  
  var serviceRestrictionsMocked1 = {
  			getRestrictions : function() {return [true, true, true, true]}
		};

  var serviceRestrictionsMocked2 = {
        getRestrictions : function() {return [true, true, true, false]}
    };

  beforeEach(module(function ($provide) {
      $provide.value('serviceRestrictions', serviceRestrictionsMocked1);
      $provide.value('serviceRestrictions', serviceRestrictionsMocked2);
  }));

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();

		headerCtrl = $controller('headerCtrl', {
		  $scope: scope
		});
	}));

	it('should have a working headerCtrl controller', function() {
    spyOn(serviceRestrictionsMocked1, 'getRestrictions');
    spyOn(serviceRestrictionsMocked2, 'getRestrictions');
    scope.logout();
	});
});
/****************************************************************************************************/