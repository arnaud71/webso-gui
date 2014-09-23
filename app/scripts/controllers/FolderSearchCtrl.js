'use strict';

angular.module('websoApp')
  .controller('FolderSearchCtrl', ['$scope', '$resource','cfg','paginationConfig','$location','$cookieStore' ,function ($scope,$resource,cfg,paginationConfig, $location, $cookieStore) {

    var $username                 = $cookieStore.get('username');

    $scope.showFound              = false;
    $scope.maxSize                = 5;
    $scope.currentPage            = 1;
    paginationConfig.nextText     = 'Suivant';
    paginationConfig.previousText = 'Précédent';
    paginationConfig.firstText    = 'Début';
    paginationConfig.lastText     = 'Fin';
    $scope.isCollapsed            = true;
    $scope.isError                = false;
    $scope.errorMessage           = cfg.errorConnect;


    // to keep index  to adress table like a hash
    $scope.idx = {};

    $scope.periodFacets = [
      {name: 'day',   value: 'jour',    nb:0, checked:false },
      {name: 'week',  value: 'semaine', nb:0, checked:false },
      {name: 'month', value: 'mois',    nb:0, checked:false }
    ];
    angular.forEach($scope.periodFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });

    $scope.langFacets = [
      {name: 'en', value:'anglais',     nb:0, checked:false },
      {name: 'fr', value:'français',    nb:0, checked:false }
    ];
    angular.forEach($scope.langFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });


    $scope.folderFacets =  [
      {name: 'validation',  value:'validation',   nb:0, checked:false },
      {name: 'watch',       value:'surveillance', nb:0, checked:false }
    ];
    angular.forEach($scope.folderFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });


    $scope.readFacets =  [
      {name: 'notRead',  value:'non lu',   nb:0, checked:true },
      {name: 'read',     value:'lu',   nb:0, checked:true },
    ];
    angular.forEach($scope.readFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });

    $scope.facetsGroup =  [
      {name :'readFacet',   value: 'Lecture' ,  items : $scope.readFacets,    checked : true, visible : true},
      {name :'periodFacet', value: 'Période' ,  items : $scope.periodFacets,  checked : true, visible : true},
      {name :'langFacet',   value: 'Langage' ,  items : $scope.langFacets,    checked : true, visible : true},
      {name :'folderFacet', value: 'Dossier' ,  items : $scope.folderFacets,  checked : true, visible : true}
    ];
    angular.forEach($scope.facetsGroup, function(value, key) {
      $scope.idx[value.name] = key;
    });


    // full left search model
    $scope.searchNav = [
      {
        name        : 'facets',
        value       : 'Recherche par facettes',
        facetsGroup : $scope.facetsGroup,
        checked     : true
      },

      {
        name        : 'collectMultiSource',
        value       : 'Collectes multisources',
        facetsGroup : [
          {name :'collectMultiSource',    value: 'Collectes multisources' ,  items : $scope.collectMultiSourceGroup, checked: true, visible :false }
        ],
        checked     : false
      },

      {
        name        : 'feeds',
        value       : 'Recherche de flux RSS',
        checked     : false
      },
    ];
    angular.forEach($scope.searchNav, function(value, key) {
      $scope.idx[value.name] = key;
    });



    $scope.collectMultiSourceGroup =  [
      {name: 'google_news',   value: 'Google News',   nb:0, checked:false },
      {name: 'bing_news',     value: 'Bing News',     nb:0, checked:false },
      {name: 'yahoo_news',    value: 'Yahoo News',    nb:0, checked:false },
      {name: 'google_blogs',  value: 'Google Blog',   nb:0, checked:false },
      {name: 'reddit',        value: 'Reddit',        nb:0, checked:false },
      {name: 'faroo_news',    value: 'Faroo News',    nb:0, checked:false },
      {name: 'delicious',     value: 'Delicious',     nb:0, checked:false },
    ];



    // default values

    $scope.mySelectionsPeriod = [];
    $scope.currentPeriod      = 'tout';
    $scope.currentFq          = 'type_s:document';

    //$scope.solr             = $resource('http://albator.hesge.ch\\:8984/solr/collection1/:action',
    $scope.solr             = $resource(cfg.urlDB+'solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});


    $scope.feedSearch     = $resource(cfg.urlServices+'harvester/RSS/:action',
      {action:'get_list_rss.pl',query:'technology', callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}
      });

    $scope.collectMultiSourceSearch = $resource(cfg.urlServices + 'harvester/QUERYSEARCH/:action',
      {action: 'get_querysearch.pl', query: '', typeQuery: '', callback: "JSON_CALLBACK"},
      {get: {method: 'JSONP'}});

    // http://albator.hesge.ch:8984/solr/collection1/select?q=*%3A*&wt=json&indent=true

    // grid init for Period menu
    $scope.gridOptionsPeriod = {

      data:           'myDataDate',
      selectedItems:  $scope.mySelectionsPeriod,
      multiSelect:    false,
      enableSorting:  false,
      enablePaging:   false,

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
      $scope.totalItems       = 0;
      $scope.currentPage      = 1;
      $scope.maxSize          = 5;


      if ($scope.searchNav[$scope.idx.facets].checked) {
        $scope.solr.get({ q: $scope.searchTerm,
          start: $scope.currentPage - 1,
          fq: $scope.currentFq + ' +type_s:document +user_s:' + $username
        }).$promise.then(function (result) {
            $scope.solrResult = result;
            $scope.totalItems = result.response.numFound;
            // get read / not read
            $scope.searchNav[$scope.idx.facets].facetsGroup[$scope.idx.readFacet].items[$scope.idx.notRead].nb = result.response.numFound;
            // get period data
            $scope.searchNav[$scope.idx.facets].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.day].nb = result.facet_counts.facet_queries['date_dt:[NOW-1DAY TO NOW]'];
            $scope.searchNav[$scope.idx.facets].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.week].nb = result.facet_counts.facet_queries['date_dt:[NOW-7DAY TO NOW]'];
            $scope.searchNav[$scope.idx.facets].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.month].nb = result.facet_counts.facet_queries['date_dt:[NOW-30DAY TO NOW]'];
            // get

            // convert table lang in hash lang
            var lang = {};
            for(var i=0;i<result.facet_counts.facet_fields.lang_s.length-2;i+=2) {
              lang[result.facet_counts.facet_fields.lang_s[i]]=result.facet_counts.facet_fields.lang_s[i+1];
            }

            $scope.searchNav[$scope.idx.facets].facetsGroup[$scope.idx.langFacet].items[$scope.idx.en].nb = lang.en;
            $scope.searchNav[$scope.idx.facets].facetsGroup[$scope.idx.langFacet].items[$scope.idx.fr].nb = lang.fr;

          });

      }
      else if ($scope.searchNav[$scope.idx.feeds].checked) {
        $scope.feedSearch.get({ query: $scope.searchTerm,
          //start: $scope.currentPage - 1,
          //fq: $scope.currentFq + ' +type_s:document +user_s:' + $username
        }).$promise.then(function (result) {
            $scope.solrResult = {};
        });

      }

      else if ($scope.searchNav[$scope.idx.collectMultiSource].checked) {
        $scope.collectMultiSourceSearch.get({ query: $scope.searchTerm,
          //start: $scope.currentPage - 1,
          //fq: $scope.currentFq + ' +type_s:document +user_s:' + $username
        }).$promise.then(function (result) {
            $scope.solrResult = {};

          });


      }
    };

    $scope.doSearchFromPage = function () {
      $scope.isCollapsed = false;
      //if ($scope.searchTerm) {

      $scope.solr.get({ q       :$scope.searchTerm,
                        start   :($scope.currentPage-1)*10,
                        fq      :$scope.currentFq
                      }).$promise.then(function (result) {
                                                    $scope.solrResult = result;
                                                    $scope.totalItems = result.response.numFound;

                                                        }
      );


    };


    // do an new ontology search if user select an other period of time and if ontology is defined
    //$scope.$watch('currentPeriod', function() {
    //  $scope.doSearch();
    //});


    //$scope.$watch('searchNav[$scope.idx.facets].checked', function() {
    //  alert('hey, myVar has changed!');
    //});


    $scope.groupCheck = function(searchGroup) {
      if (searchGroup == 'facets') {
        if ($scope.searchNav[$scope.idx.facets].checked == false) {
          $scope.searchNav[$scope.idx.collectMultiSource].checked = false;
          $scope.searchNav[$scope.idx.feeds].checked = false;
        }
      }
      else if (searchGroup == 'collectMultiSource') {
        if ($scope.searchNav[$scope.idx.collectMultiSource].checked == false) {
          $scope.searchNav[$scope.idx.facets].checked = false;
          $scope.searchNav[$scope.idx.feeds].checked = false;
        }
      }
      else if (searchGroup == 'feeds') {
        if ($scope.searchNav[$scope.idx.feeds].checked == false) {
          $scope.searchNav[$scope.idx.facets].checked = false;
          $scope.searchNav[$scope.idx.collectMultiSource].checked = false;
        }
      }
    };

    $scope.pageChanged = function() {

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

