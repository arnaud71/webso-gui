'use strict';

angular.module('websoApp')
  .controller('SolrCtrl', ['$scope', '$resource' ,function ($scope,$resource) {

    $scope.showFound        = false;
    $scope.currentPage      = 1;
    $scope.maxSize          = 5;
    $scope.bigCurrentPage   = 1;


    // data for period menu
    $scope.myDataDate = [
      {period: 'jour',fq:'date_dt:[NOW/DAY-1DAY TO NOW/DAY+1DAY]'},
      {period: 'semaine',fq:'date_dt:[NOW/DAY-7DAY TO NOW/DAY+1DAY]'},
      {period: 'mois',fq:'date_dt:[NOW/DAY-30DAY TO NOW/DAY+1DAY]'},
      {period: 'tout',fq:''}
    ];

    // default values

    $scope.mySelectionsPeriod = [];
    $scope.currentPeriod      = 'all';
    $scope.currentFq          = '';

    //$scope.solr             = $resource('http://albator.hesge.ch\\:8984/solr/collection1/:action',
    $scope.solr             = $resource('http://localhost\\:8983/solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

    // http://albator.hesge.ch:8984/solr/collection1/select?q=*%3A*&wt=json&indent=true

    // grid init for Period menu
    $scope.gridOptionsPeriod = {

      data: 'myDataDate',
      selectedItems: $scope.mySelectionsPeriod,
      multiSelect: false,
      enableSorting: false,
      enablePaging: false,

      afterSelectionChange: function () {
        angular.forEach($scope.mySelectionsPeriod, function ( item ) {
          $scope.currentPeriod = item.period;
          $scope.currentFq = item.fq;
        });
      },

      headerRowHeight: 30,

      columnDefs: [
        {visible:'true',field:'period', displayName: 'Dernier', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },

      ]
    };


    $scope.doSearch = function () {
      if ($scope.searchTerm) {
        $scope.currentPage      = 1;
        $scope.maxSize          = 5;
        $scope.bigCurrentPage   = 1;
        $scope.solrResult       = $scope.solr.get({q:$scope.searchTerm,start:$scope.currentPage-1,fq:$scope.currentFq},
          function () {
            $scope.totalItems     = $scope.solrResult.response.numFound;
            $scope.bigTotalItems  = $scope.solrResult.response.numFound;
          }
        );
      }
    };


    $scope.doSearchFromPage = function () {
      if ($scope.searchTerm) {
        $scope.solrResult = $scope.solr.get({q:$scope.searchTerm,start:($scope.currentPage-1)*10,fq:$scope.currentFq},
          function () {
            $scope.totalItems     = $scope.solrResult.response.numFound;
            $scope.bigTotalItems  = $scope.solrResult.response.numFound;
          }
        );
        $scope.totalItems = $scope.solrResult.response.numFound;
        $scope.bigTotalItems = $scope.solrResult.response.numFound;
      }
    };


    // do an new ontology search if user select an other period of time and if ontology is defined
    $scope.$watch('currentPeriod', function() {
      $scope.doSearch();
    });

    $scope.pageChanged = function(page) {
      $scope.currentPage = page;
      $scope.doSearchFromPage();
    };
  }]);


// http://albator.hesge.ch:8587/solr/collection1/select?q='+query+'&wt=json&json.wrf=?&callback=?'

/*
Controller for Collapsing solr results
*/
angular.module('websoApp')
  .controller('CollapseSolrCtrl', ['$scope', function ($scope) {
    $scope.isCollapsed = true;
  }]);

