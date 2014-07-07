'use strict';

angular.module('websoApp')
  .controller('FolderSearchCtrl', ['$scope', '$resource','cfg','paginationConfig','$location','$cookieStore' ,function ($scope,$resource,cfg,paginationConfig, $location, $cookieStore) {

    var $username                 = $cookieStore.get('username');

    $scope.showFound              = false;
    $scope.currentPage            = 1;
    $scope.maxSize                = 5;
    $scope.bigCurrentPage         = 1;
    paginationConfig.nextText     = 'Suivant';
    paginationConfig.previousText = 'Précédent';
    paginationConfig.firstText    = 'Début';
    paginationConfig.lastText     = 'Fin';
    $scope.isCollapsed            = true;
    $scope.isError                = false;
    $scope.errorMessage           = cfg.errorConnect;

    // data for period menu
    $scope.myDataDate = [
      {period: 'dernier jour',fq:'+date_dt:[NOW/DAY-1DAY TO NOW/DAY+1DAY]'},
      {period: 'dernière semaine',fq:'+date_dt:[NOW/DAY-7DAY TO NOW/DAY+1DAY]'},
      {period: 'dernier mois',fq:'+date_dt:[NOW/DAY-30DAY TO NOW/DAY+1DAY]'},
      {period: 'tout',fq:''}
    ];

    // default values

    $scope.mySelectionsPeriod = [];
    $scope.currentPeriod      = 'tout';
    $scope.currentFq          = 'type_s:document';

    //$scope.solr             = $resource('http://albator.hesge.ch\\:8984/solr/collection1/:action',
    $scope.solr             = $resource(cfg.urlDB+'solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
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
          $scope.currentPeriod  = item.period;
          $scope.currentFq      = item.fq;
        });
      },

      headerRowHeight: 30,

      columnDefs: [
        {visible:'true',field:'period', displayName: 'Période', cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' }

      ]
    };


    $scope.doSearch = function () {
      $scope.isCollapsed = false;

      //if ($scope.searchTerm) {
      $scope.currentPage      = 1;
      $scope.maxSize          = 5;
      $scope.bigCurrentPage   = 1;
      $scope.solrResult       = $scope.solr.get({q:$scope.searchTerm,start:$scope.currentPage-1,fq:$scope.currentFq+' +type_s:document +user_s:'+$username},
        function () {
          $scope.isError = false;
          if (typeof solrResult !== 'undefined') {
            //if ($scope.solrResult.response.numFound !== 'undefined') {
            $scope.totalItems     = $scope.solrResult.response.numFound;
            $scope.bigTotalItems  = $scope.solrResult.response.numFound;
          }
        },
        //error
        function () {
          $scope.isError = true;

        }
      );
      //}
    };


    $scope.doSearchFromPage = function () {
      $scope.isCollapsed = false;
      //if ($scope.searchTerm) {
      $scope.solrResult = $scope.solr.get({q:$scope.searchTerm,start:($scope.currentPage-1)*10,fq:$scope.currentFq},
        function () {
          $scope.isError = true;
          if (typeof solrResult !== 'undefined') {
            $scope.totalItems     = $scope.solrResult.response.numFound;
            $scope.bigTotalItems  = $scope.solrResult.response.numFound;
          }

        },
        //error
        function () {
          $scope.isError = true;

        }
      );
      //$scope.totalItems    = $scope.solrResult.response.numFound;
      //$scope.bigTotalItems = $scope.solrResult.response.numFound;
      //}
    };


    // do an new ontology search if user select an other period of time and if ontology is defined
    $scope.$watch('currentPeriod', function() {
      $scope.doSearch();
    });

    $scope.pageChanged = function(page) {
      $scope.currentPage = page;
      $scope.doSearchFromPage();
    };

    $scope.doSearch();

    $scope.getSummary = function(id) {
      //return $scope.solrResult.response.highlighting.{{id}}.content_en;
    }


    $scope.pathValidate = function(url){
      var path = '/validate/add/'+url ; //dont need the '#'
      $location.path(path);
    }

  }]);


// http://albator.hesge.ch:8587/solr/collection1/select?q='+query+'&wt=json&json.wrf=?&callback=?'

/*
 Controller for Collapsing solr results
 */
angular.module('websoApp')
  .controller('CollapseSolrCtrl', ['$scope', function ($scope) {
    $scope.isCollapsed = true;
  }]);

