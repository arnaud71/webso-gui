'use strict';

angular.module('websoApp')
  .controller('FolderSearchCtrl', ['$scope', '$resource','cfg','paginationConfig','$location','$cookieStore','$modal', '$filter' ,function ($scope,$resource,cfg,paginationConfig, $location, $cookieStore, $modal, $filter) {

    var $username                 = $cookieStore.get('username');
    var $token                    = $cookieStore.get('token');
    var $token_timeout            = $cookieStore.get('token_timeout');
    var $vfolder                  = $cookieStore.get('vfolder');
    var $wfolder                  = $cookieStore.get('wfolder');

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
    $scope.errorMessage           = $filter('i18n')('_ERROR_CONNECTION_');
    $scope.searchTerm             = '';

    $scope.onlineSourceList       = {};
    $scope.onlineSourceList['google_news'] = 'Google News';  // if you change that please change the appropriate check box default value
    $scope.onlineCurrentSearchUrl = '';
    $scope.url                    = cfg.urlServices+'file/download.pl?token='+$token+'&token_timeout='+$token_timeout;


    // to keep index  to adress table like a hash
    $scope.idx = {};

    $scope.periodFacets = [
      {name: 'day',   value: 'jour',    nb:0, checked:false, fq:' AND date_dt:[NOW-1DAY TO NOW]'},
      {name: 'week',  value: 'semaine', nb:0, checked:false, fq:' AND date_dt:[NOW-7DAY TO NOW]'},
      {name: 'month', value: 'mois',    nb:0, checked:false, fq:' AND date_dt:[NOW-30DAY TO NOW]'}
    ];
    angular.forEach($scope.periodFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });

    $scope.langFacets = [
      {name: 'en', value:'anglais',     nb:0, checked:false,  fq:' AND lang_s:en' },
      {name: 'fr', value:'français',    nb:0, checked:false,  fq:' AND lang_s:fr' }
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

    $scope.sourceFacets =  [
      {name: 'selection',  value:'enregistrée(s)',  nb:0, checked:false, fq:' AND waiting_b:false'},
      {name: 'waiting',    value:'en attente',      nb:0, checked:false, fq:' AND waiting_b:true' }
    ];
    angular.forEach($scope.sourceFacets, function(value, key) {
      $scope.idx[value.name] = key;
    });

    $scope.readFacets =  [
      {name: 'notRead',  value:'non lu',  nb:0, checked:false, fq:' AND read_b:false' },
      {name: 'read',     value:'lu',      nb:0, checked:false, fq:' AND read_b:true' }
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

    $scope.sourceGroup =  [
      {name :'sourceFacet', value : 'Source' ,  items : $scope.sourceFacets, checked : true, visible : false},
      //{name :'waitFacet', value : 'En attente' ,  items : $scope.waitingFacets, checked : false, visible : true, fq:'+type_s:waiting'},
    ];
    angular.forEach($scope.sourceGroup, function(value, key) {
      $scope.idx[value.name] = key;
    });


    $scope.vfolderGroup = [];
    angular.forEach($vfolder, function(value, key){
      $scope.vfolderGroup.push({'name': value.id, 'value': value.name, checked:false, fq:' AND folder_i:'+value.id, visible:true, type:'vfolderGroup' }); //items:$scope.facetsGroup, 
    });

    angular.forEach($scope.vfolderGroup, function(value, key) {
      $scope.idx[value.name] = key;
    });

    angular.forEach($scope.sourceGroup, function(value, key) {
      $scope.idx[value.name] = key;
    });

    $scope.wfolderGroup = [];
    angular.forEach($wfolder, function(value, key){
      $scope.wfolderGroup.push({'name': value.id, 'value': value.name, items:$scope.facetsGroup, checked:false, fq:' AND folder_s:'+value.id, visible:true, type:'wfolderGroup' });
    });

    angular.forEach($scope.wfolderGroup, function(value, key) {
      $scope.idx[value.name] = key;
    });

    angular.forEach($scope.sourceGroup, function(value, key) {
      $scope.idx[value.name] = key;
    });
    


    // full left search model
    $scope.searchNav = [
      {
        name          : 'source',
        // value         : 'Source',
        value         : $filter('i18n')('_SOURCE_'),
        facetsGroup   : $scope.sourceGroup,//$scope.facetsGroup,
        tooltipOpen   : 'Ouvrir la recherche des sources',
        tooltipClose  : 'Fermer la recherche des sources',
        checked       : false
      },

      {
        name          : 'watch',
        // value         : 'Dossiers de surveillances',
        value         : $filter('i18n')('_SEARCH_WATCHING_FOLDER_'),
        tooltipOpen   : 'Ouvrir la recherche des dossiers de surveillance',
        tooltipClose  : 'Fermer la recherche des dossiers de surveillance',
        foldersGroup  : $scope.wfolderGroup,
        // facetsGroup   : $scope.facetGroup,
        checked       : false
      },

      {
        name          : 'validation',
        // value         : 'Dossiers de validation',
        value         : $filter('i18n')('_SEARCH_VALIDATING_FOLDER_'),
        foldersGroup  : $scope.vfolderGroup,
        tooltipOpen   : 'Ouvrir la recherche des dossiers de validation',
        tooltipClose  : 'Fermer la recherche des dossiers de validation',
        checked       : false
      },

      {
        name        : 'online',
        // value       : 'En ligne',
        value       : $filter('i18n')('_ONLINE_'),
        tooltipOpen   : 'Ouvrir la recherche des ressources online',
        tooltipClose  : 'Fermer la recherche des ressources online',
        selectGroup : $scope.onlineGroup,
        checked     : false
      },

      {
        name        : 'feeds',
        // value       : 'Recherche de flux RSS',
        value       : $filter('i18n')('_SEARCH_FEED_'),
        tooltipOpen   : 'Ouvrir la recherche de flux RSS',
        tooltipClose  : 'Fermer la recherche de flux RSS',
        checked     : false
      },
    ];
    angular.forEach($scope.searchNav, function(value, key) {
      $scope.idx[value.name] = key;
    });



    $scope.onlineGroup =  [
      {name: 'google_news',   value: 'Google News',   nb:0, checked:true },
      {name: 'bing_news',     value: 'Bing News',     nb:0, checked:false },
      {name: 'yahoo_news',    value: 'Yahoo News',    nb:0, checked:false },
      {name: 'google_blogs',  value: 'Google Blog',   nb:0, checked:false },
      {name: 'reddit',        value: 'Reddit',        nb:0, checked:false },
      {name: 'faroo_news',    value: 'Faroo News',    nb:0, checked:false },
      {name: 'delicious',     value: 'Delicious',     nb:0, checked:false }
    ];



    // default values

   // $scope.mySelectionsPeriod = [];
   // $scope.currentPeriod      = 'tout';
    $scope.typeFq             = 'type_s:document ';
    $scope.typeWatch          = 'type_s: watch';
    $scope.typeValidate       = 'type_s: validation'
    $scope.currentFacetFq     = '';
    $scope.langFacetFq        = '';
    $scope.periodFacetFq      = '';
    $scope.readFacetFq        = '';
    $scope.folderFacetFq      = '';
    $scope.sourceFacetFq      = '';

    // $scope.solr = $resource(cfg.urlDB+'solr/collection1/:action',
    //   {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
    //   {get:{method:'JSONP'}});
    $scope.solr = $resource(cfg.urlServices+'db/:action',
      {action:'query.pl', qt:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

    $scope.validationAdd = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl', type_s:'validation',user_s: $username ,level_sharing_i:'1',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.ressourceAdd = $resource(cfg.urlServices+'db/:action',
      {action: 'put.pl', user_s: $username, callback:'JSON_CALLBACK'},
      {put: {method: 'JSONP'}});

    $scope.feedSearch     = $resource(cfg.urlServices+'harvester/RSS/:action',
      {action:'get_list_rss.pl',query:'technology', callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}
      });
    $scope.feedAdd = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl', type_s:'source', user_s:$username, level_sharing_i:'1' , isWatched_b:'false', callback:"JSON_CALLBACK"},
      {put:{method:'JSONP'}});

    $scope.dbList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',user_s:$username,callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.onlineSearch = $resource(cfg.urlServices + 'harvester/QUERYSEARCH/:action',
      {action: 'get_querysearch.pl', query: '', typeQuery: '', callback: "JSON_CALLBACK"},
      {get: {method: 'JSONP'}});

    $scope.atomicChange = $resource(cfg.urlServices + 'db/:action',
      {action: 'change.pl', id: '', callback: "JSON_CALLBACK"},
      {get: {method: 'JSONP'}});

    $scope.deleteSource = $resource(cfg.urlServices+'db/:action',
      {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.checkSourceResource = $resource(cfg.urlServices+'harvester/RSS/:action',
      {action:'check_rss.pl',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}}
    );

    $scope.sendMail = $resource(cfg.urlServices+':action',
      {action: 'send.pl', callback:'JSON_CALLBACK', token: $token, token_timeout: $token_timeout},
      {send: {method: 'JSONP'}});


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

      // if ($scope.searchTerm) {


      if (($scope.searchNav[$scope.idx.feeds].checked)) {

        $scope.feedSearch.get({
          query     : $scope.searchTerm
        }).$promise.then(function (result) {
            $scope.feedResult = result;
          })
      }
      // ONLINE
      else if (($scope.searchNav[$scope.idx.online].checked)) {
        $scope.typeQueryStr = '';

        angular.forEach($scope.searchNav[$scope.idx.online].selectGroup, function(value) {
          if (value.checked) {
            $scope.typeQueryStr += value.name+',';
          }
        });




        $scope.onlineSearch.get({
          query     : $scope.searchTerm,
          typeQuery : $scope.typeQueryStr,
        }).$promise.then(function (result) {
            $scope.onlineResult = result;
            $scope.currentOnlineSearchUrl = cfg.urlServices + 'harvester/QUERYSEARCH/get_querysearch.pl?query='+$scope.searchTerm+'&typeQuery='+$scope.typeQueryStr;//+'&out=rss';
          })

      }
      // VALIDATION
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
          // fq: 'type_s:validation' + ' AND user_s:' + $username
          fq: $scope.typeValidate + ' AND user_s:' + $username + ' ' + $scope.langFacetFq + ' ' + $scope.periodFacetFq + ' ' + $scope.folderFacetFq + ' ' + $scope.readFacetFq
        }).$promise.then(function (result) {
          $scope.solrResult = result.success;
          $scope.totalItems = result.success.response.numFound;
          // alert($scope.typeValidate + ' AND user_s:' + $username + ' ' + $scope.langFacetFq + ' ' + $scope.periodFacetFq + ' ' + $scope.folderFacetFq + ' ' + $scope.readFacetFq);
          var $i=0;
          angular.forEach($scope.wfolderGroup, function(value, key) {

            // get read/unread facet
            $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.readFacet].items[$scope.idx.notRead].nb = result.success.response.numFound - result.success.facet_counts.facet_queries['read_b:true'];
            $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.readFacet].items[$scope.idx.read].nb = result.success.facet_counts.facet_queries['read_b:true'];

            // get period facet
            $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.periodFacet].items[$scope.idx.day].nb = result.success.facet_counts.facet_queries['date_dt:[NOW-1DAY TO NOW]'] | 0;
            $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.periodFacet].items[$scope.idx.week].nb = result.success.facet_counts.facet_queries['date_dt:[NOW-7DAY TO NOW]'] | 0;
            $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.periodFacet].items[$scope.idx.month].nb = result.success.facet_counts.facet_queries['date_dt:[NOW-30DAY TO NOW]'] | 0;

            // convert table lang in hash lang
            var lang = {};
            for (var i = 0; i < result.success.facet_counts.facet_fields.lang_s.length; i += 2) {
              lang[result.success.facet_counts.facet_fields.lang_s[i]] = result.success.facet_counts.facet_fields.lang_s[i + 1];
            }

            // get lang facet
            $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.langFacet].items[$scope.idx.en].nb = lang.en | 0;
            $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.langFacet].items[$scope.idx.fr].nb = lang.fr | 0;
            $i++;
          });
        });
      }

      // SOURCE
      else if ($scope.searchNav[$scope.idx.source].checked) {
        if($scope.affichageWaiting){
          $scope.seeWaitings($scope.waitingID, $scope.waitingTitle);
        }
        else{
          $scope.onlineResult= '';
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
            // fq: $scope.typeFq + ' +user_s:' + $username + ' ' + $scope.langFacetFq + ' ' + $scope.periodFacetFq + ' ' + $scope.folderFacetFq + ' ' + $scope.readFacetFq
            fq: $scope.typeFq + ' AND user_s:' + $username + ' ' + $scope.sourceFacetFq 
          }).$promise.then(function (result) {
            $scope.solrResult = result.success;
            $scope.totalItems = result.success.response.numFound;
            // get read / not read
            // $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.readFacet].items[$scope.idx.notRead].nb  = result.response.numFound - result.facet_counts.facet_queries['read_b:true'];
            // $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.readFacet].items[$scope.idx.read].nb     = result.facet_counts.facet_queries['read_b:true'];
            //$scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.folderFacet].items[$scope.idx.validation].nb = result.facet_counts.facet_queries['type_s:validation'];
            $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.sourceFacet].items[$scope.idx.selection].nb     = result.success.facet_counts.facet_queries['waiting_b:false'];

            $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.sourceFacet].items[$scope.idx.waiting].nb     = result.success.facet_counts.facet_queries['waiting_b:true'];
            // get period data
            // $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.day].nb = result.facet_counts.facet_queries['date_dt:[NOW-1DAY TO NOW]'] | 0;
            // $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.week].nb = result.facet_counts.facet_queries['date_dt:[NOW-7DAY TO NOW]'] | 0;
            // $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.month].nb = result.facet_counts.facet_queries['date_dt:[NOW-30DAY TO NOW]'] | 0;
            // get

            // convert table lang in hash lang
            // var lang = {};
            // for (var i = 0; i < result.facet_counts.facet_fields.lang_s.length; i += 2) {
            //   lang[result.facet_counts.facet_fields.lang_s[i]] = result.facet_counts.facet_fields.lang_s[i + 1];
            // }

            // $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.langFacet].items[$scope.idx.en].nb = lang.en | 0;
            // $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.langFacet].items[$scope.idx.fr].nb = lang.fr | 0;

          });
        } 
      }
      // Surveillance
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
            fq: $scope.typeWatch + ' AND user_s:' + $username + ' ' + $scope.langFacetFq + ' ' + $scope.periodFacetFq + ' ' + $scope.folderFacetFq + ' ' + $scope.readFacetFq
          }).$promise.then(function (result) {
            $scope.solrResult = result.success;
            $scope.totalItems = result.success.response.numFound;
            // get read / not read
            // alert($scope.typeWatch + ' AND user_s:' + $username + ' ' + $scope.langFacetFq + ' ' + $scope.periodFacetFq + ' ' + $scope.folderFacetFq + ' ' + $scope.readFacetFq);
            var $i=0;
            angular.forEach($scope.wfolderGroup, function(value, key) {

              // get read/unread facet
              $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.readFacet].items[$scope.idx.notRead].nb = result.success.response.numFound - result.success.facet_counts.facet_queries['read_b:true'];
              $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.readFacet].items[$scope.idx.read].nb = result.success.facet_counts.facet_queries['read_b:true'];

              // get period facet
              $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.periodFacet].items[$scope.idx.day].nb = result.success.facet_counts.facet_queries['date_dt:[NOW-1DAY TO NOW]'] | 0;
              $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.periodFacet].items[$scope.idx.week].nb = result.success.facet_counts.facet_queries['date_dt:[NOW-7DAY TO NOW]'] | 0;
              $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.periodFacet].items[$scope.idx.month].nb = result.success.facet_counts.facet_queries['date_dt:[NOW-30DAY TO NOW]'] | 0;

              // convert table lang in hash lang
              var lang = {};
              for (var i = 0; i < result.success.facet_counts.facet_fields.lang_s.length; i += 2) {
                lang[result.success.facet_counts.facet_fields.lang_s[i]] = result.success.facet_counts.facet_fields.lang_s[i + 1];
              }

              // get lang facet
              $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.langFacet].items[$scope.idx.en].nb = lang.en | 0;
              $scope.searchNav[$scope.idx.watch].foldersGroup[$i].items[$scope.idx.langFacet].items[$scope.idx.fr].nb = lang.fr | 0;
              $i++;
            
            });
          });
        }
      }
    };



    // // ***************************************************************
    // // doSearchFolder
    // // list the available sources
    // $scope.doSearchFolder = function () {
    //   $scope.isError = false;

    //   $scope.dbList.get({
    //     type_s      : 'tree',
    //     title_t     : 'vfolder',
    //     user_s      : $username,
    //   }).$promise.then(function(result) {

    //       $scope.folders = [];
    //       var tmp = JSON.parse(result.success.response.docs[0].content_s);
    //       var log = [];
    //       angular.forEach(tmp[0].nodes, function(value1, key1) {
    //         // if(angular.isArray(value1)){

    //         $scope.folders.push({"id":value1.id ,"name":value1.title});
    //         angular.forEach(value1.nodes, function(value2, key2){
    //           $scope.folders.push({"id":value2.id , "name":value2.title});
    //           angular.forEach(value2.nodes, function(value3, key3){
    //             $scope.folders.push({"id":value3.id, "name":value3.title});
    //             if(angular.isArray(value3.nodes)){
    //               angular.forEach(value3.nodes, function(value4, key4){
    //                 $scope.folders.push({"id":value4.id, "name":value4.title});
    //               }, log);
    //             }
    //           }, log);
    //         }, log);
    //       }, log);
    //       //$scope.folders = JSON.parse(result.success.response.docs[0].content_s);
    //       //$scope.folder = $scope.folders[1];

    //     }, function(reason) {
    //       alert('Failed: ' + reason);
    //     });
    // };

    // $scope.doSearchFolder();

    $scope.doSearchFromPage = function () {
      $scope.isCollapsed = false;
      //if ($scope.searchTerm) {

      $scope.solr.get({ q       :$scope.searchTerm,
                        start   :($scope.currentPage-1)*10,
                        fq      :$scope.currentFq
                      }).$promise.then(function (result) {
                                                    $scope.solrResult = result.success;
                                                    $scope.totalItems = result.success.response.numFound;

                                                        }
      );


    };


    // do an new ontology search if user select an other period of time and if ontology is defined
    //$scope.$watch('currentPeriod', function() {
    // $scope.doSearch();
    //});


    //$scope.$watch('searchNav[$scope.idx.facets].checked', function() {
    // alert('hey, myVar has changed!');
    //});


    $scope.selectCheck = function(select) {
      if (select.checked) {
        $scope.onlineSourceList[select.name] = select.value;
      }
      else {
        delete $scope.onlineSourceList[select.name];
      }

      $scope.doSearch();

    }


    $scope.groupCheck = function(searchGroup) {
      if (searchGroup == 'watch') {
        if ($scope.searchNav[$scope.idx.watch].checked == false) {
          $scope.searchNav[$scope.idx.online].checked     = false;
          $scope.searchNav[$scope.idx.feeds].checked      = false;
          $scope.searchNav[$scope.idx.validation].checked = false;
          $scope.searchNav[$scope.idx.watch].checked      = true;
          $scope.searchNav[$scope.idx.source].checked     = false;
          $scope.currentPage            = 1;
          $scope.typeFq = 'type_s:document';
          $scope.doSearch();
        }
        else {
          $scope.searchNav[$scope.idx.watch].checked = false;
        }

      }
      else if (searchGroup == 'online') {
        if ($scope.searchNav[$scope.idx.online].checked == false) {
          $scope.searchNav[$scope.idx.watch].checked      = false;
          $scope.searchNav[$scope.idx.validation].checked = false;
          $scope.searchNav[$scope.idx.feeds].checked      = false;
          $scope.searchNav[$scope.idx.online].checked     = true;
          $scope.searchNav[$scope.idx.source].checked     = false;
          $scope.currentPage            = 1;
          $scope.typeFq = 'type_s:document';
          $scope.doSearch();
        }
        else {
          $scope.searchNav[$scope.idx.online].checked = false;
        }
      }
      else if (searchGroup == 'feeds') {
        if ($scope.searchNav[$scope.idx.feeds].checked == false) {
          $scope.searchNav[$scope.idx.validation].checked = false;
          $scope.searchNav[$scope.idx.online].checked     = false;
          $scope.searchNav[$scope.idx.watch].checked      = false;
          $scope.searchNav[$scope.idx.feeds].checked      = true;
          $scope.searchNav[$scope.idx.source].checked     = false;
          $scope.currentPage            = 1;
          $scope.typeFq = 'type_s:document';
          $scope.doSearch();
        }
        else {
          $scope.searchNav[$scope.idx.feeds].checked = false;
        }
      }
      else if (searchGroup == 'validation') {
        if ($scope.searchNav[$scope.idx.validation].checked == false) {
          $scope.searchNav[$scope.idx.validation].checked = true;
          $scope.searchNav[$scope.idx.online].checked     = false;
          $scope.searchNav[$scope.idx.watch].checked      = false;
          $scope.searchNav[$scope.idx.feeds].checked      = false;
          $scope.searchNav[$scope.idx.source].checked     = false;
          $scope.currentPage            = 1;
          $scope.typeFq = 'type_s:document';
          $scope.doSearch();
        }
        else {
          $scope.searchNav[$scope.idx.validation].checked = false;
        }
      }
      else if (searchGroup == 'source') {
        if ($scope.searchNav[$scope.idx.source].checked == false) {
          $scope.searchNav[$scope.idx.source].checked     = true;
          $scope.searchNav[$scope.idx.online].checked     = false;
          $scope.searchNav[$scope.idx.watch].checked      = false;
          $scope.searchNav[$scope.idx.feeds].checked      = false;
          $scope.searchNav[$scope.idx.validation].checked = false;
          $scope.currentPage            = 1;
          $scope.typeFq = 'type_s:source';
          $scope.doSearch();
        }
        else {
          $scope.searchNav[$scope.idx.source].checked = false;
        }
      }
    };

    $scope.folderCheck = function (folder, dir) {
      var $obj = '';
      var $folder_query = '';
      if($scope.searchNav[$scope.idx.watch].checked){
        $obj = $scope.idx.watch;
        $folder_query = ' AND folder_s:';
      }
      else{
        $obj = $scope.idx.validation;
        $folder_query = ' AND folder_i:';
      }
      angular.forEach($scope.searchNav[$obj].foldersGroup, function(value, key) {
        if(folder.name == value.name){
          if(value.checked == false){
            value.checked = true;
            $scope.folderFacetFq = $folder_query+folder.name;
          }
          else{
            value.checked = false;
            $scope.folderFacetFq = '';
          }
        }
        else{
          value.checked = false;
        }
      });
      // $scope.sourceId = '';

      if($scope.searchNav[$scope.idx.watch].checked){
        $scope.typeWatch = 'type_s: watch';
        // $scope.folderFacetFq = $scope.f;
        $scope.affichageWatch = false;
      }
      else{
        $scope.typeValidate = 'type_s: validation';
        // $scope.folderFacetFq = $scope.f;
        $scope.affichageValidate = false;
      }
      $scope.f = '';
      $scope.sourceTitle = '';
      $scope.doSearch();
    };

    $scope.facetCheck = function (facet) {
      facet.checked = ! facet.checked;
    };


    $scope.itemCheck = function(item) {

      // lang
      if (item.name == 'fr') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.langFacet].items[$scope.idx.en].checked = false;
          $scope.langFacetFq = item.fq;

        }
        else {
          $scope.langFacetFq = '';
        }

      }
      else if (item.name == 'en') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.langFacet].items[$scope.idx.fr].checked = false;
          $scope.langFacetFq = item.fq;
        }
        else {
          $scope.langFacetFq = '';
        }
      }

      // read or not read
      else if (item.name == 'read') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.readFacet].items[$scope.idx.notRead].checked = false;
          $scope.readFacetFq = item.fq;
        }
        else {
          $scope.readFacetFq = '';
        }
      }
      else if (item.name == 'notRead') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.readFacet].items[$scope.idx.read].checked = false;
          $scope.readFacetFq = item.fq;

        }
        else {
          $scope.readFacetFq = '';
        }
      }

      // period
      else if (item.name == 'day') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.week].checked = false;
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.month].checked = false;
          $scope.periodFacetFq = item.fq;
        }
        else {
          $scope.periodFacetFq = '';
        }
      }
      else if (item.name == 'week') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.day].checked = false;
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.month].checked = false;
          $scope.periodFacetFq = item.fq;
        }
        else {
          $scope.periodFacetFq = '';
        }
      }
      else if (item.name == 'month') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.day].checked = false;
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.periodFacet].items[$scope.idx.week].checked = false;
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
          $scope.typeFq = 'type_s:validation ';
        }
        else {
          $scope.folderFacetFq = '';
          $scope.typeFq = 'type_s:document';
        }
      }

      else if (item.name == 'watch') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.watch].facetsGroup[$scope.idx.folderFacet].items[$scope.idx.validation].checked = false;
          $scope.folderFacetFq = item.fq;
        }
        else {
          $scope.folderFacetFq = '';
        }
      }
      else if (item.name == 'waiting') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.sourceFacet].items[$scope.idx.selection].checked = false;
          $scope.sourceFacetFq = item.fq;
        }
        else {
          $scope.sourceFacetFq = '';
        }
      }
      else if (item.name == 'selection') {
        if (item.checked == false) {
          // $scope.searchNav[$scope.idx.source].facetsGroup[$scope.idx.sourceFacet].items[$scope.idx.waiting].checked = false;
          $scope.sourceFacetFq = item.fq;
        }
        else {
          $scope.sourceFacetFq = '';
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

    $scope.validateDoc = function (doc, validate, type) {

      if (validate) {

        $scope.validationForm = {};
        if (type == 'solr') {
          $scope.validationForm.url = doc.url_s;
          $scope.validationForm.title = doc.title_t;
          $scope.validationForm.content = doc.content_t;
        }
        else if (type == 'online') {
          $scope.validationForm.url = doc.link;
          $scope.validationForm.title = doc.title;
          $scope.validationForm.content = doc.description;
        }
        $scope.validationForm.tags     = '';
        $scope.validationForm.folder   = '';
        $scope.validationForm.comment  = '';

        var modalInstance = $modal.open({
          scope: $scope,
          templateUrl : 'validateModal.html',
          controller  : ModalInstanceCtrl,
        });

        modalInstance.result.then(function () {
          if($scope.validationForm.url == '' || $scope.validationForm.folder.id == '' || $scope.validationForm.comment == '') {
            alert($filter('i18n')('_ERROR_VALIDATE_ADD_'));
          }
          else{
            $scope.validationAdd.get({
              url_s         : $scope.validationForm.url,
              tags_ss       : $scope.validationForm.tags,
              title_t       : $scope.validationForm.title,
              content_en    : $scope.validationForm.content,
              content_t     : $scope.validationForm.content,
              content_fr    : $scope.validationForm.content,
              comment_s     : $scope.validationForm.comment,
              folder_s      : $scope.validationForm.folder.name,
              folder_i      : $scope.validationForm.folder.id,
              lang_s        : doc.lang_s,
              date_dt       : doc.date_dt
            });

            $scope.atomicChange.get({
              id            : doc.id,
              validated_b   : validate
            }).$promise.then(function (result) {
              $scope.doSearch();
            });
          }
        });

      }
      else {
        $scope.atomicChange.get({
          id            : doc.id,
          validated_b   : validate
        }).$promise.then(function (result) {
            $scope.doSearch();
          }
        );

      }


      //   var addInfo = alert('Information ajoutée');

      // Testing  Modal trigger
      /*var modalInstance = $modal.open({
        templateUrl: 'validateModal.html',
        controller: ModalInstanceCtrl
      });*/
    };

    $scope.shareDoc = function (doc, type) {

      $scope.shareForm = {};
      if (type == 'solr') {
        $scope.shareForm.url = doc.url_s;
        $scope.shareForm.title = doc.title_t;
        $scope.shareForm.content = doc.content_t;
      }
      else if (type == 'online') {
        $scope.shareForm.url = doc.link;
        $scope.shareForm.title = doc.title;
        $scope.shareForm.content = doc.description;
      }
      $scope.shareForm.tags     = '';
      $scope.shareForm.folder   = '';
      $scope.shareForm.comment  = '';
      $scope.shareForm.mail     = '';

      var modalInstance = $modal.open({
        scope: $scope,
        templateUrl : 'shareModal.html',
        controller  : ModalInstanceCtrl,
      });

      modalInstance.result.then(function () {
        if($scope.shareForm.mail == '' || angular.isUndefined($scope.shareForm.mail)) alert($filter('i18n')('_WRONG_MAIL_FORMAT_'));
        else{
          $scope.sendMail.send({
            token         : $token,
            token_timeout : $token_timeout,
            url_s         : $scope.shareForm.url,
            tags          : $scope.shareForm.tags,
            titre         : $scope.shareForm.title,
            // content_en    : $scope.shareForm.content,
            content       : $scope.shareForm.content,
            // content_fr    : $scope.shareForm.content,
            commentaire   : $scope.shareForm.coment,
            // folder_s      : $scope.shareForm.folder.name,
            // folder_i      : $scope.shareForm.folder.id,
            langue        : doc.lang_s,
            date          : doc.date_dt,
            mail          : $scope.shareForm.mail
          });
        }
      });
    };

    /* add a online search as a source
    */
    $scope.waitSource = function (url, liste){
      $scope.validationForm                   = {};
      $scope.validationForm.url               = url;
      $scope.validationForm.title             = 'Recherche en ligne Webso';
      $scope.validationForm.tags              = '';
      // $scope.validationForm.domain            = {};
      // $scope.validationForm.domain.name       = '';
      // $scope.validationForm.activity          = {};
      // $scope.validationForm.activity.name     = '';
      $scope.validationForm.frequency         = {};
      $scope.validationForm.frequency.option  = '';

      var modalInstance = $modal.open({
        scope: $scope,
        templateUrl : 'addOnlineSearchModal.html',
        controller  : ModalInstanceCtrl
      });

      modalInstance.result.then(function () {
        $scope.feedAdd.put({
          source_type_s:    'online',
          url_s:            $scope.validationForm.url,
          title_t:          $scope.validationForm.title,
          tags_ss:          $scope.validationForm.tags,
          refresh_s:        $scope.validationForm.frequency.option,
          // domain_s:         $scope.validationForm.domain.name,
          // activity_s:       $scope.validationForm.activity.name,
          query_s:          $scope.searchTerm,
          ressources_s:     $scope.typeQueryStr,
          waiting_b:        true
        }).$promise.then(function(result){
          angular.forEach(liste, function(value, key) {
            // alert(result.id+' '+value.pubDate);
            $scope.ressourceAdd.put({
              type_s:           'document',
              source_id_ss:     result.id,
              url_s:            value.link,
              title_t:          value.title,
              title_fr:         value.title,
              title_en:         value.title,
              content_t:        value.description,
              content_fr:       value.description,
              content_en:       value.description,
              // date_dt:          value.pubDate,
              read_b:           false,
              validated_b:      false,
              waiting_b:        true,
            });
          });
        });
      });
    }

    $scope.seeDocuments = function (id, titre){
      $scope.typeFq = '+type_s:document AND source_id_ss:'+id;
      $scope.affichageSource = true;
      $scope.sourceTitle = titre;
      $scope.doSearch();
    }

    $scope.seeWatch = function (id, titre){
      var txt = '';
      var b = false;
      angular.forEach(id, function(key, val){
        txt += ((b)? ' OR ': '')+'source_id_ss:'+key;
        b=true;
      });
      $scope.typeWatch = 'type_s: document AND ('+txt+')';
      $scope.f = $scope.folderFacetFq;
      $scope.folderFacetFq = '';
      $scope.affichageWatch = true;
      $scope.watchTitle = titre;
      $scope.doSearch();
    }

    $scope.seeValidate = function (id, titre){
      $scope.typeValidate = 'type_s: document AND source_id_ss:'+id;
      $scope.f = $scope.folderFacetFq;
      $scope.folderFacetFq = '';
      $scope.affichageValidate = true;
      $scope.validateTitle = titre;
      $scope.doSearch();
    }


    $scope.resetList = function (){
      $scope.typeFq = '+type_s:source';
      $scope.affichageSource = false;
      $scope.sourceTitle = '';
      $scope.doSearch();
    }

    $scope.resetWatch = function (){
      $scope.typeWatch = 'type_s: watch';
      $scope.folderFacetFq = $scope.f;
      $scope.f = '';
      $scope.affichageWatch = false;
      $scope.watchTitle = '';
      $scope.doSearch();
    }

    $scope.resetValidate = function (){
      $scope.typeValidate = 'type_s: validation';
      $scope.folderFacetFq = $scope.f;
      $scope.f = '';
      $scope.affichageValidate = false;
      $scope.validateTitle = '';
      $scope.doSearch();
    }

    $scope.seeWaitings = function (id, title){
      $scope.waitingTitle = title;
      $scope.waitingID = id;
      // $scope.onlineSearch.get({
      //   query     : query,
      //   typeQuery : source,
      // }).$promise.then(function (result) {
      $scope.solr.get({
        start   :($scope.currentPage-1)*10,
        q: 'type_s:document AND source_id_ss:'+id,
      }).$promise.then(function (result) {
        $scope.affichageWaiting = true;
        // $scope.onlineResult = result;
        $scope.solrResult = result.success;
        $scope.totalItems = result.success.response.numFound;
      });
    }

    $scope.resetWaiting = function (){
      //$scope.typeFq = '+type_s:source';
      $scope.affichageWaiting = false;
      $scope.onlineResult = '';
      $scope.waitingTitle = '';
      $scope.doSearch();
    }

    /*  addfeed from search feed*/
    $scope.addFeed= function(feed){
      $scope.dbList.get({
        type_s :'source',
        url_s  : '"'+feed.url+'"'
      })
      .$promise.then(function(result) {

        if(angular.isDefined(result.success.response.numFound) && result.success.response.numFound == 0){
          $scope.validationForm                   = {};
          $scope.validationForm.url               = feed.url;
          $scope.validationForm.title             = feed.title;
          $scope.validationForm.tags              = '';
          // $scope.validationForm.domain            = {};
          // $scope.validationForm.domain.name       = '';
          // $scope.validationForm.activity          = {};
          // $scope.validationForm.activity.name     = '';
          $scope.validationForm.frequency         = {};
          $scope.validationForm.frequency.option  = '';

          var modalInstance = $modal.open({
            scope: $scope,
            templateUrl : 'validateFeedModal.html',
            controller  : ModalInstanceCtrl
          });

          modalInstance.result.then(function () {
            $scope.feedAdd.put({
              source_type_s     : 'rss',
              url_s:            $scope.validationForm.url,
              title_t:          $scope.validationForm.title,
              tags_ss:          $scope.validationForm.tags,
              refresh_s:        $scope.validationForm.frequency.option,
              // domain_s:         $scope.validationForm.domain.name,
              // activity_s:       $scope.validationForm.activity.name,
              waiting_b:        false
            });
          });
        }
        else{
          alert($filter('i18n')('_SOURCE_ALREADY_EXISTS_'));
        }
      });
    }

    $scope.seeFeed = function(feed){
      //$location.path(feed.url);
      $scope.checkSourceResult = $scope.checkSourceResource.get({
          url: feed.url
      });

      var modalInstance = $modal.open({
        scope: $scope,
        templateUrl : 'seeFeedModal.html',
        controller  : ModalInstanceCtrl
      });
    }

    $scope.watchFeed = function(feed){
      $scope.dbList.get({
        type_s :'source',
        url_s  : '"'+feed.url+'"'
      })
      .$promise.then(function(result) {

        $scope.WatchForm                   = {};
        $scope.WatchForm.url               = feed.url;
        $scope.WatchForm.title             = String(feed.title).replace(/<[^>]+>/gm, ''); //Remove html tags from text
        $scope.WatchForm.tags              = '';
        $scope.WatchForm.query             = '';
        $scope.WatchForm.frequency         = {option:''};
        $scope.WatchForm.forlder           = {id:'', name:''};
        $scope.WatchForm.notification      = {option:''};

        if(angular.isDefined(result.success.response.numFound) && result.success.response.numFound == 0){
          var modalInstance = $modal.open({
            scope: $scope,
            templateUrl : 'watchFeedModal.html',
            controller  : ModalInstanceCtrl
          });

          modalInstance.result.then(function () {
            if($scope.WatchForm.url == '' || $scope.WatchForm.folder.id == '' || $scope.WatchForm.comment == '') {
              alert($filter('i18n')('_ERROR_VALIDATE_ADD_'));
            }
            else{
              $scope.feedAdd.put({
                source_type_s     : 'RSS',
                url_s:            $scope.WatchForm.url,
                title_t:          $scope.WatchForm.title,
                tags_ss:          $scope.WatchForm.tags,
                refresh_s:        $scope.WatchForm.frequency.option,
                waiting_b:        false
              }).$promise.then(function(result) {
                $scope.ressourceAdd.put({
                  type_s:           'watch',
                  title_t:          $scope.WatchForm.title,
                  url_s:            $scope.WatchForm.url,
                  tags_ss:          $scope.WatchForm.tags,
                  folder_s:         $scope.WatchForm.folder.id,
                  // folder_s:         $scope.WatchForm.folder.name,
                  query_s:          $scope.WatchForm.query,
                  source_id_s:      result.id,
                  notification_s:   $scope.WatchForm.notification.option
                });
              });
            }
          });
        }
        else{
          alert($filter('i18n')('_SOURCE_ALREADY_EXISTS_'));
        }
      });
    }

    //  ***************************************
    //  modal instance
    var ModalInstanceCtrl = function ($scope, $modalInstance) {

      $scope.ok = function () {
        $modalInstance.close();//($scope.selected.item);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

    // first call,init
    $scope.initFacet();
    //$scope.selectCheck();
    $scope.doSearch();

    $scope.getSummary = function(id) {
      //return $scope.solrResult.response.highlighting.{{id}}.content_en;
    }


    $scope.pathValidate = function(url){
      var path = '/validate/add/'+url ; //dont need the '#'
      $location.path(path);
    }

    $scope.domains =  $filter('i18n')('_DOMAIN_AND_ACTIVITY_LIST_');
    $scope.frequencies =  [
      {option:'1h'},
      {option:'12h'},
      {option:'24h'},
      {option:'48h'}
    ] ;

    // $scope.notifications =  [
    //   {option:'Pas de notification'},
    //   {option:'email'}
    // ];
    $scope.notifications = $filter('i18n')('_NOTIFICATION_TYPES_');

  }]);


/*
 Controller for Collapsing solr results
 */
angular.module('websoApp')
  .controller('CollapseSolrCtrl', ['$scope', function ($scope) {
    $scope.isCollapsed = true;
  }]);

