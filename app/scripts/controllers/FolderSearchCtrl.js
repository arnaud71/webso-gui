'use strict';

angular.module('websoApp')
  .controller('FolderSearchCtrl', ['$scope', '$resource','cfg','paginationConfig','$location','$cookieStore' ,function ($scope,$resource,cfg,paginationConfig, $location, $cookieStore) {

    var $username                 = $cookieStore.get('username');

    $scope.showFound              = false;
    $scope.totalItems             = 0;
    $scope.currentPage            = 1;
    $scope.maxSize                = 5;
    paginationConfig.nextText     = 'Suivant';
    paginationConfig.previousText = 'Précédent';
    paginationConfig.firstText    = 'Début';
    paginationConfig.lastText     = 'Fin';
    $scope.isCollapsed            = true;
    $scope.isError                = false;
    $scope.errorMessage           = cfg.errorConnect;
    $scope.searchTerm             = '';



    // to keep index  to adress table like a hash
    $scope.idx = {};

    $scope.periodFacets = [
      {name: 'day',   value: 'jour',    nb:0, checked:false, fq:'+date_dt:[NOW-1DAY TO NOW]'},
      {name: 'week',  value: 'semaine', nb:0, checked:false, fq:'+date_dt:[NOW-7DAY TO NOW]'},
      {name: 'month', value: 'mois',    nb:0, checked:false, fq:'+date_dt:[NOW-30DAY TO NOW]'}
    ];
    angular.forEach($scope.periodFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });

    $scope.langFacets = [
      {name: 'en', value:'anglais',     nb:0, checked:false,  fq:'+lang_s:en' },
      {name: 'fr', value:'français',    nb:0, checked:true,   fq:'+lang_s:fr' }
    ];
    angular.forEach($scope.langFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });


    $scope.folderFacets =  [
      {name: 'validation',  value:'validation',   nb:0, checked:false},
      {name: 'watch',       value:'surveillance', nb:0, checked:true }
    ];
    angular.forEach($scope.folderFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });


    $scope.readFacets =  [
      {name: 'notRead',  value:'non lu',    nb:0, checked:true, fq:'+read_b:false' },
      {name: 'read',     value:'lu',        nb:0, checked:false, fq:'+read_b:true' }
    ];
    angular.forEach($scope.readFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });

    $scope.facetsGroup =  [
      {name :'readFacet',   value: 'Lecture' ,  items : $scope.readFacets,    checked : true, visible : true},
      {name :'periodFacet', value: 'Période' ,  items : $scope.periodFacets,  checked : true, visible : true},
      {name :'langFacet',   value: 'Langage' ,  items : $scope.langFacets,    checked : true, visible : true},
    //  {name :'folderFacet', value: 'Dossier' ,  items : $scope.folderFacets,  checked : true, visible : true}
    ];
    angular.forEach($scope.facetsGroup, function(value, key) {
      $scope.idx[value.name] = key;
    });


    // full left search model
    $scope.searchNav = [
      {
        name        : 'watch',
        value       : 'Dossiers de surveillances',
        facetsGroup : $scope.facetsGroup,
        checked     : true
      },

      {
        name        : 'validation',
        value       : 'Dossiers de validations',
        checked     : false
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

   // $scope.mySelectionsPeriod = [];
   // $scope.currentPeriod      = 'tout';
    $scope.typeFq             = '+type_s:document ';
    $scope.currentFacetFq     = '';
    $scope.langFacetFq        = '';
    $scope.periodFacetFq      = '';
    $scope.readFacetFq        = '';
    $scope.folderFacetFq      = '';

    //$scope.solr             = $resource('http://albator.hesge.ch\\:8984/solr/collection1/:action',
    $scope.solr             = $resource(cfg.urlDB+'solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

    $scope.validationAdd = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl', type_s:'validation',user_s: $username ,level_sharing_i:'1',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});


    $scope.feedSearch     = $resource(cfg.urlServices+'harvester/RSS/:action',
      {action:'get_list_rss.pl',query:'technology', callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}
      });

    $scope.collectMultiSourceSearch = $resource(cfg.urlServices + 'harvester/QUERYSEARCH/:action',
      {action: 'get_querysearch.pl', query: '', typeQuery: '', callback: "JSON_CALLBACK"},
      {get: {method: 'JSONP'}});

    $scope.atomicChange = $resource(cfg.urlServices + 'db/:action',
      {action: 'change.pl', id: '', callback: "JSON_CALLBACK"},
      {get: {method: 'JSONP'}});

    $scope.deleteSource = $resource(cfg.urlServices+'db/:action',
      {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});



    // http://albator.hesge.ch:8984/solr/collection1/select?q=*%3A*&wt=json&indent=true

    // grid init for Period menu
    /*$scope.gridOptionsPeriod = {

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
    };*/


    $scope.doSearch = function (group) {
      $scope.isCollapsed = false;

      //if ($scope.searchTerm) {


      if (group == 'feeds') {

      }
      else if (group == 'collectMultiSource') {

      }
      else if ($scope.searchNav[$scope.idx.validation].checked) {

          if ($scope.searchTerm == '') {
            $scope.sort = 'date_dt desc';
          }
          else {
            $scope.sort = 'score desc, date_dt desc';
          }
          $scope.solr.get({ q: $scope.searchTerm,
            //start: $scope.currentPage - 1,
            start: ($scope.currentPage - 1) * 10,
            sort: $scope.sort,
            fq: ' +type_s:validation' + ' +user_s:' + $username
          }).$promise.then(function (result) {
              $scope.solrResult = result;
              $scope.totalItems = result.response.numFound;


          })
      }
      else {
        if ($scope.searchNav[$scope.idx.watch].checked) {
          if ($scope.searchTerm == '') {
            $scope.sort = 'date_dt desc';
          }
          else {
            $scope.sort = 'score desc, date_dt desc';
          }
          $scope.solr.get({ q: $scope.searchTerm,
            //start: $scope.currentPage - 1,
            start   :($scope.currentPage-1)*10,
            sort    : $scope.sort,
            fq: $scope.typeFq + ' +user_s:' + $username + ' ' + $scope.langFacetFq + ' ' + $scope.periodFacetFq + ' ' + $scope.folderFacetFq + ' ' + $scope.readFacetFq
          }).$promise.then(function (result) {
              $scope.solrResult = result;
              $scope.totalItems = result.response.numFound;
              // get read / not read
              $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.readFacet].items[$scope.idx.notRead].nb = result.response.numFound - result.facet_counts.facet_queries['read_b:true'];
              $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.readFacet].items[$scope.idx.read].nb = result.facet_counts.facet_queries['read_b:true'];
              //$scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.folderFacet].items[$scope.idx.validation].nb = result.facet_counts.facet_queries['type_s:validation'];


              // get period data
              $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.day].nb = result.facet_counts.facet_queries['date_dt:[NOW-1DAY TO NOW]'] | 0;
              $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.week].nb = result.facet_counts.facet_queries['date_dt:[NOW-7DAY TO NOW]'] | 0;
              $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.month].nb = result.facet_counts.facet_queries['date_dt:[NOW-30DAY TO NOW]'] | 0;
              // get

              // convert table lang in hash lang
              var lang = {};
              for (var i = 0; i < result.facet_counts.facet_fields.lang_s.length; i += 2) {
                lang[result.facet_counts.facet_fields.lang_s[i]] = result.facet_counts.facet_fields.lang_s[i + 1];
              }

              $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.langFacet].items[$scope.idx.en].nb = lang.en | 0;
              $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.langFacet].items[$scope.idx.fr].nb = lang.fr | 0;

            });

        }
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
      if (searchGroup == 'watch') {
        if ($scope.searchNav[$scope.idx.watch].checked == false) {
          $scope.searchNav[$scope.idx.collectMultiSource].checked = false;
          $scope.searchNav[$scope.idx.feeds].checked = false;
          $scope.searchNav[$scope.idx.validation].checked = false;
          $scope.searchNav[$scope.idx.watch].checked = true;
          $scope.currentPage            = 1;
          $scope.doSearch();
        }
        else {
          $scope.searchNav[$scope.idx.watch].checked = false;
        }

      }
      else if (searchGroup == 'collectMultiSource') {
        if ($scope.searchNav[$scope.idx.collectMultiSource].checked == false) {
          $scope.searchNav[$scope.idx.watch].checked = false;
          $scope.searchNav[$scope.idx.validation].checked = false;
          $scope.searchNav[$scope.idx.feeds].checked = false;
          $scope.searchNav[$scope.idx.collectMultiSource].checked = true;
          $scope.currentPage            = 1;
          $scope.doSearch();
        }
        else {
          $scope.searchNav[$scope.idx.collectMultiSource].checked = false;
        }
      }
      else if (searchGroup == 'feeds') {
        if ($scope.searchNav[$scope.idx.feeds].checked == false) {
          $scope.searchNav[$scope.idx.validation].checked = false;
          $scope.searchNav[$scope.idx.collectMultiSource].checked = false;
          $scope.searchNav[$scope.idx.watch].checked = false;
          $scope.searchNav[$scope.idx.feeds].checked = true;
          $scope.currentPage            = 1;
          $scope.doSearch();
        }
        else {
          $scope.searchNav[$scope.idx.feeds].checked = false;
        }
      }
      else if (searchGroup == 'validation') {
        if ($scope.searchNav[$scope.idx.validation].checked == false) {
          $scope.searchNav[$scope.idx.validation].checked = true;
          $scope.searchNav[$scope.idx.collectMultiSource].checked = false;
          $scope.searchNav[$scope.idx.watch].checked = false;
          $scope.searchNav[$scope.idx.feeds].checked = false;
          $scope.currentPage            = 1;
          $scope.doSearch();
        }
        else {
          $scope.searchNav[$scope.idx.validation].checked = false;
        }
      }

    };

    $scope.facetCheck = function (facet) {
      facet.checked = ! facet.checked;
    };


    $scope.itemCheck = function(item) {

      // lang
      if (item.name == 'fr') {
        if (item.checked == false) {
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.langFacet].items[$scope.idx.en].checked = false;
          $scope.langFacetFq = item.fq;

        }
        else {
          $scope.langFacetFq = '';
        }

      }
      else if (item.name == 'en') {
        if (item.checked == false) {
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.langFacet].items[$scope.idx.fr].checked = false;
          $scope.langFacetFq = item.fq;
        }
        else {
          $scope.langFacetFq = '';
        }
      }

      // read or not read
      else if (item.name == 'read') {
        if (item.checked == false) {
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.readFacet].items[$scope.idx.notRead].checked = false;
          $scope.readFacetFq = item.fq;

        }
        else {
          $scope.readFacetFq = '';
        }
      }
      else if (item.name == 'notRead') {
        if (item.checked == false) {
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.readFacet].items[$scope.idx.read].checked = false;
          $scope.readFacetFq = item.fq;

        }
        else {
          $scope.readFacetFq = '';
        }
      }

      // period
      else if (item.name == 'day') {
        if (item.checked == false) {
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.week].checked = false;
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.month].checked = false;
          $scope.periodFacetFq = item.fq;
        }
        else {
          $scope.periodFacetFq = '';
        }
      }
      else if (item.name == 'week') {
        if (item.checked == false) {
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.day].checked = false;
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.month].checked = false;
          $scope.periodFacetFq = item.fq;
        }
        else {
          $scope.periodFacetFq = '';
        }
      }
      else if (item.name == 'month') {
        if (item.checked == false) {
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.day].checked = false;
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.week].checked = false;
          $scope.periodFacetFq = item.fq;
        }
        else {
          $scope.folderFacetFq = '';
        }
      }

      else if (item.name == 'validation') {
        if (item.checked == false) {
          //$scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.folderFacet].items[$scope.idx.watch].checked = false;
          //$scope.folderFacetFq = item.fq;
          $scope.typeFq = '+type_s:validation ';
        }
        else {
          $scope.folderFacetFq = '';
          $scope.typeFq = '+type_s:document';
        }
      }

      else if (item.name == 'watch') {
        if (item.checked == false) {
          $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.folderFacet].items[$scope.idx.validation].checked = false;
          $scope.folderFacetFq = item.fq;
        }
        else {
          $scope.folderFacetFq = '';
        }
      }
      $scope.doSearch();
    }

    $scope.pageChanged = function() {

      //$scope.doSearchFromPage();
      $scope.doSearch();
    };


    $scope.setRead = function (idDoc,value){

      $scope.atomicChange.get({
          id       :idDoc,
          read_b   :value
      }).$promise.then(function (result) {
          $scope.doSearch();
        }
      );
    }


    $scope.initFacet = function() {
      angular.forEach($scope.facetsGroup, function(v1) {
        angular.forEach(v1.items, function(v2) {
          if (v2.checked == true) {
            $scope[v1.name+'Fq'] = v2.fq;
          }
        });
      });

    }

    $scope.deleteDoc = function(docId) {
      $scope.deleteSource.get({
        id  :     docId,
        user_s :  $username
      }).$promise.then(function() {
          $scope.doSearch();

        }, function(reason) {
          alert('Failed id: ' + reason);
        })
      ;
    };

    $scope.validateDoc = function (doc, validate) {
      if (validate) {
        $scope.validationAdd.get({
          url_s: doc.url_s,
          //tags_s :      $scope.inputTags,
          title_t: doc.title_t,
          content_en: doc.content_t,
          lang_s: doc.lang_s,
          date_dt: doc.date_dt

        });
      }
      else {


      }

      $scope.atomicChange.get({
        id            : doc.id,
        validated_b   : validate
      }).$promise.then(function (result) {
          $scope.doSearch();
        }
      );
      //   var addInfo = alert('Information ajoutée');

      // Testing  Modal trigger
      /*var modalInstance = $modal.open({
        templateUrl: 'validateModal.html',
        controller: ModalInstanceCtrl
      });*/
    };

    // first call,init
    $scope.initFacet();
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

