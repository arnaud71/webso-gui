'use strict';

angular.module('websoApp')
  .controller('AddWatchCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $log, $http, serviceWidgets, dashboard, $filter) {

    var $username = $cookieStore.get('username');

    $scope.heg                    = cfg.heg;
    $scope.isError                = false;
    $scope.errorMessage           = $filter('i18n')(cfg.errorConnect);

    $scope.filterOptions = {
      filterText        : "",
      useExternalFilter : false
    };


    $scope.totalServerItemsSource = 0;
    $scope.totalServerItemsWatch  = 0;

    $scope.pagingOptionsSource = {
      pageSizes     : [10,100,1000],
      pageSize      : 10,
      currentPage   : 1
    };

    $scope.pagingOptionsWatch = {
      pageSizes     : [10,100,1000],
      pageSize      : 10,
      currentPage   : 1
    };

    // use this type of declaration to avoid scope problem (between tabs)
    $scope.model = {
      inputUrl            : '',
      inputTags           : '',
      inputTitle          : '',
      inputFrequency      : 0,
      inputDomain         : [{name:'',activites:[]}],
      inputActivity       : [{name:''}],
      inputQuery          : '',
      inputFolder         : '',
      inputNotification   : '',
      sourceId            : 0,
      watchId             : 0,
      docAvailable        : 0,
      mySourceSelections  : [],
      myWatchSelections   : []
    };

    $scope.rowTabSource = {}; // keep track of row number for deletion if sorting
    $scope.rowTabWatch = {}; // keep track of row number for deletion if sorting



    $scope.sortInfo = {
      fields:['creation_dt'],
      directions:['desc']
    };

    // options for grid of sources

    $scope.gridOptionsSource = {
      data                : 'myDataSource',
      selectedItems       : $scope.model.mySourceSelections,
      afterSelectionChange: function () {
        angular.forEach($scope.model.mySourceSelections, function ( item ) {
          $scope.model.inputTitle = item.title_t;
          $scope.model.inputUrl   = item.url_s;
          $scope.model.inputTags  = item.tags_s;
          //$scope.domain.name      = item.domain_s;
          //$scope.activity.name    = item.activity_s;
          $scope.model.inputDomain.name  = item.domain_s;
          $scope.model.inputActivity.name    = item.activity_s;
          $scope.model.inputFrequency   = item.refresh_s;
          $scope.model.sourceId   = item.id;
        });
        $scope.checkSourceUrl($scope.model.inputUrl);
        $scope.doSearchWatch();
      },
      enablePaging        : true,
      enableRowSelection  : true,
      enableColumnResize  : true,
      multiSelect         : false,
      showFooter          : true,
      totalServerItems    : 'totalServerItemsSource',
      pagingOptions       : $scope.pagingOptionsSource,
      filterOptions       : $scope.filterOptions,
      showFilter          : true,
      sortInfo            : $scope.sortInfo,

      //selectWithCheckboxOnly: 'true',
      //selectedItems: $scope.mySelections,
      columnDefs: [
        {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptionsSource.pageSize*pagingOptionsSource.currentPage-pagingOptionsSource.pageSize)}}</div>'},
        {visible:false,width:'50px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'*',field:'url_s', displayName:  'Source',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
        {width:'*',field:'title_t', displayName:  'Title', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'tags_s', displayName:  'Tag', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'domain_s', displayName:  'Domaine', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'user_s', displayName:  'Auteur', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        //{width:'100px',field:'IsWatched_b', displayName:  'Surveillance', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'creation_dt', displayName:  'Création', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'', displayName:  'Gestion', cellTemplate: ' <button type="button" class="btn btn-xs" ng-click="sourceDelete(row.getProperty(\'id\'),row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button>  <a ng-href="{{row.getProperty(\'url_s\')}}" target="_blank"><span class="glyphicon glyphicon-link"></span></a><!-- <button type="button" class="btn btn-xs" ng-click="test(source.id,source.url_s)"><span class="glyphicon glyphicon-pencil"></span></button>-->'}

      ]
    };


    $scope.gridOptionsWatch = {
      data                : 'myDataWatch',
      selectedItems       : $scope.model.myWatchSelections,
      afterSelectionChange: function () {
        angular.forEach($scope.model.myWatchSelections, function ( item ) {

          $scope.model.inputQuery       = item.query_s;
          $scope.model.inputFolder      = item.folder_s;
          $scope.notification.option    = item.notification_s;
          $scope.model.watchId          = item.id;

        });
      },
      enablePaging        : true,
      enableColumnResize  : true,
      enableRowSelection  : true,
      multiSelect         : false,
      showFooter          : true,
      totalServerItems    : 'totalServerItemsWatch',
      pagingOptions       : $scope.pagingOptionsWatch,
      filterOptions       : $scope.filterOptions,
      showFilter          : true,
      sortInfo            : $scope.sortInfo,


      //selectWithCheckboxOnly: 'true',
      //selectedItems: $scope.mySelections,
      columnDefs: [
        {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptionsWatch.pageSize*pagingOptionsWatch.currentPage-pagingOptionsWatch.pageSize)}}</div>'},
        {visible:false,width:'100px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {visible:false,width:'100px',field:'source_id_s', displayName:  'sourceId', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'*',field:'url_s', displayName:  'Source',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
        {width:'*',field:'title_t', displayName:  'Title', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'tags_ss', displayName:  'Tag', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'domain_s', displayName:  'Domaine', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'user_s', displayName:  'Auteur', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'folder_s', displayName:  'Dossier', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'query_s', displayName:  'Requête', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'creation_dt', displayName:  'Création', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'', displayName:  'Gestion', cellTemplate: ' <button type="button" class="btn btn-xs" ng-click="watchDelete(row.getProperty(\'id\'),row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button>  <a ng-href="{{row.getProperty(\'url_s\')}}" target="_blank"><span class="glyphicon glyphicon-link"></span></a><!-- <button type="button" class="btn btn-xs" ng-click="test(source.id,source.url_s)"><span class="glyphicon glyphicon-pencil"></span></button>-->'}

      ]
    };


    $scope.tabsSource = [
      { title:"Ajouter source"},
      { title:"Sélectionner source"}
    ];

    $scope.tabsWatch = [
      { title:"Ajouter surveillance"},
      { title:"Sélectionner surveillance"}
    ];


    $scope.checkingSource = false;
    $scope.sourceChecked  = false;


    //***************************
    // resources definition

    // to list the available sources
    $scope.dbList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',user_s:$username,callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});


    // to add an object to the db
    $scope.addResource = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl',user_s:$username, level_sharing_i:'1',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}}
    );

    // to query solr as a search engine
    $scope.solrResource = $resource(cfg.urlDB+'solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}}
    );

    // to check a rss source
    $scope.checkSourceResource = $resource(cfg.urlServices+'harvester/RSS/:action',
      {action:'check_rss.pl',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}}
    );

    // to delete a specific source
    $scope.dbDelete = $resource(cfg.urlServices+'db/:action',
      {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    // to delete from query
    $scope.dbDeleteQuery = $resource(cfg.urlServices+'db/:action',
      {action:'delete_q.pl', query:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

  	// add a widget to Solr
	function addWidgetToSolr(widgetType, widgetTitle, isEnable, widgetWeight, userWidget){
	    $scope.widgetAdd = $resource(cfg.urlServices+'db/:action',
	      {action:'put.pl', type_s:'widget', callback:"JSON_CALLBACK"},
	      {get:{method:'JSONP'}});

	    $scope.widgetAdd.get({
	        widget_type_s  : widgetType,
	        title_t        : widgetTitle,
	        enable_s       : isEnable,
	        weight_s       : widgetWeight,
	        user_s          : userWidget,
	        query_s         : ''
	    }).$promise.then(function(widg){
          if(widg.success){
            var w = {
                id: widg.id,
                type: widgetType,
                config: widg.query_s
            };
          }
        });
	};

    // add widget : principal function
    function addWidget(widgetType){
        var userInformations = serviceWidgets.getUserIdents(), widgetTitle, array, w;
        // widget's title
        widgetTitle = serviceWidgets.getTitleWidget(widgetType);
        // add the widget to Solr
        addWidgetToSolr(widgetType, widgetTitle, true, 1, userInformations[0]);
    };

    // ***************************************************************
    // doSearchSource
    // list the available sources
    $scope.doSearchSource = function () {

      $scope.dbList.get({
        type_s    :'source',
        start     :$scope.pagingOptionsSource.pageSize*$scope.pagingOptionsSource.currentPage-$scope.pagingOptionsSource.pageSize,
        sort      :'creation_dt desc',
        rows      :$scope.pagingOptionsSource.pageSize
      }).$promise.then(function(result) {



        angular.forEach(result.success.response.docs, function (item, index) {

          $scope.rowTabSource[item.id]= index;

        });

        $scope.myDataSource = result.success.response.docs;
        $scope.totalServerItemsSource = result.success.response.numFound;


      }, function(reason) {
        alert('Failed: ' + reason);
      });



      /* $scope.sourceResult = $scope.dbList.get({type_s:'source',
                                               start:$scope.pagingOptions.pageSize*$scope.pagingOptions.currentPage-$scope.pagingOptions.pageSize,
                                               rows:$scope.pagingOptions.pageSize},
        function() {        //call back function for asynchronous
          $scope.isError = false;
          if (typeof $scope.sourceResult.success !== "undefined") {
            if (typeof $scope.sourceResult.success.response === "undefined") {
            }
            else {
              $scope.myDataSource = $scope.sourceResult.success.response.docs;
              angular.forEach(result.success.response.docs, function (item, index) {

                $scope.rowTabSource[item.id]= index;

              });

              $('.row').trigger('resize');
            }
          }
          else {
            $scope.isError = true;
          }
        },
        //error
        function () {
          $scope.isError = true;

        }

      ); */

    };


    // ***************************************************************
    // doSearchWatch
    // list the available sources
    $scope.doSearchWatch = function () {
      $scope.isError = false;

      // search all watchs if no source defined
      if (!$scope.model.sourceId) {
        $scope.model.sourceId = '*';
      }

      $scope.dbList.get({
                      type_s      :'watch',
                      start:$scope.pagingOptionsWatch.pageSize*$scope.pagingOptionsWatch.currentPage-$scope.pagingOptionsWatch.pageSize,
                      source_id_s :$scope.model.sourceId,
                      sort        :'creation_dt desc',
                      rows        :$scope.pagingOptionsWatch.pageSize
        }).$promise.then(function(result) {
          $scope.folderArray=[];
          $scope.doSearchFolder();
          angular.forEach(result.success.response.docs, function (item, index) {
            $scope.rowTabWatch[item.id]= index;
            item.folder_s = $scope.folderArray[item.folder_s];

          });

          $scope.myDataWatch            = result.success.response.docs;
          $scope.totalServerItemsWatch  = result.success.response.numFound;

        }, function(reason) {
          alert('Failed: ' + reason);
        });


      /* $scope.watchResult = $scope.dbList.get({type_s:'watch',source_id_s:$scope.model.sourceId},
        function() {        //call back function for asynchronous

          $scope.isError = false;
          if (typeof $scope.watchResult.success !== "undefined") {
            if (typeof $scope.watchResult.success.response === "undefined") {
            }
            else {
              $scope.myDataWatch = $scope.watchResult.success.response.docs;

              $('.row').trigger('resize');
            }
          }
          else {
            $scope.isError = true;
          }
        },
        //error
        function () {
          $scope.isError = true;

        }
      );*/

    };

    // ***************************************************************
    // doAddSource
    // add a source in the DB
    $scope.doAddSource = function () {
      $scope.sourceAddResult = $scope.addResource.get({
        source_type_s   : 'rss',
        type_s          : 'source',
        url_s           : $scope.model.inputUrl,
        tags_s          : $scope.model.inputTags,
        title_t         : $scope.model.inputTitle,
        domain_s        : $scope.model.inputDomain.name,
        activity_s      : $scope.model.inputActivity.name,
        refresh_s       : $scope.model.inputFrequency.option

      },function () {
          if (typeof $scope.sourceAddResult.success === "undefined") {}
          else {
            $scope.model.sourceId = $scope.sourceAddResult.success.id;
            if ($scope.sourceAddResult.nb_doc_added>0) {
              $scope.model.docAvailable = 1;
            }
          }
      });

      if($scope.model.valueCheckBoxSource === true){
        addWidget('affichageSource', $scope.model.inputTitle);
      }

      var modalInstance = $modal.open({
        templateUrl: 'addSourceModal.html',
        controller: ModalInstanceCtrl
      });


    };



    // ***************************************************************
    // doAddWatch
    // add a watch in the DB
    $scope.doAddWatch = function () {
      if(angular.isUndefined($scope.model.inputFolder) || ($scope.model.sourceId == "*")) alert('Merci de choisir une source et un dossier');
      else{
        $scope.watchAddResult = $scope.addResource.get({
          type_s:         'watch',
          url_s         :  $scope.model.inputUrl,
          title_t       :  $scope.model.inputTitle,
          tags_ss       :  $scope.model.inputTags,
          domain_s      :  $scope.model.inputDomain.name,
          activity_s    :  $scope.model.inputActivity.name,
          folder_s      :  $scope.model.inputFolder.id,
          query_s       :  $scope.model.inputQuery,
          source_id_s   :  $scope.model.sourceId,
          //source_id_s   :  $scope.sourceAddResult.success.id,
          notification_s:  $scope.model.inputNotification.option

        });

        if($scope.model.valueCheckBoxWatch === true){
          addWidget('affichageSurveillance', $scope.model.inputTitle);
        }

        // var addWatch = alert('Surveillance ajoutée');
        // Testing  Modal trigger
        var modalInstance = $modal.open({
          templateUrl: 'addWatchModal.html',
          controller: ModalInstanceCtrl
        });
      }
    };

    // ***************************************************************
    // checkSourceUrl
    // check if the rss exist and get the content in checkSourceResult
    $scope.checkSourceUrl = function (){
      //$scope.$emit('CHECKRSS');

      if ($scope.model.inputUrl.length>5) {
        $scope.checkingSource = true;
        $scope.checkSourceResult = $scope.checkSourceResource.get({
          url: $scope.model.inputUrl
        }, function () {
          if ($scope.checkSourceResult.title) {
            $scope.model.inputTitle = $scope.checkSourceResult.title;
          }
          //$scope.$emit('UNCHECKRSS');
          $scope.checkingSource = false;
          if ($scope.checkSourceResult.count>0) {
            $scope.sourceChecked = true;
          }

        },function (){$scope.sourceChecked = false});
      }
      else {
        $scope.sourceChecked = false;
      }

    };


    // ***************************************************************
    // AddDocuments
    // add documents in db
    $scope.AddDocuments = function(){

      // jsonParams =
      // $http.post($resource(cfg.urlDB+'solr/update', jsonParams ).success(function(result) {

      //   $scope.resultAddDocument = result;
      //   }).error(function() {
      //console.log("error");
      // }));
    };



    // ***************************************************************
    // testWatch
    // test the current watch with a query
    $scope.testWatch = function() {
      $scope.isError = false;
      $scope.solrResult       = $scope.solrResource.get({
                                    q   : $scope.model.inputQuery,
                                    fq  : '+source_id_ss:'+$scope.model.sourceId+' +type_s:document'

      },
        function () {
          //$scope.isError = true;

        },
      //error
      function () {
          $scope.isError = true;

      }

      );
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



    // ***************************************************************
    // sourceDelete
    // to delete a watch from the DB
    $scope.sourceDelete = function (dbId,index) {

      $scope.dbId   = dbId;
      $scope.index  = index;
      var modalInstance = $modal.open({
        templateUrl: 'deleteSourceModal.html',
        controller: ModalInstanceDeleteCtrl
      });


      modalInstance.result.then(function () {


        $scope.dbList.get({
          type_s      :'watch',
          start:$scope.pagingOptionsWatch.pageSize*$scope.pagingOptionsWatch.currentPage-$scope.pagingOptionsWatch.pageSize,
          source_id_s :$scope.model.sourceId,
          sort        :'creation_dt desc',
          rows        :$scope.pagingOptionsWatch.pageSize
        })
          .$promise.then(function(result) {






        }, function(reason) {
            alert('Failed: ' + reason);
          });


        // delete documents linked to the source

        $scope.dbDeleteQuery.get({ query  :  'id:'+$scope.dbId})
        .$promise.then(function() {
          $scope.dbDeleteQuery.get({query  :  'source_id_s:'+$scope.dbId})
          .$promise.then(function() {
            $scope.dbDeleteQuery.get({query  :  'source_id_ss:'+$scope.dbId})
            .$promise.then(function() {
              $scope.doSearchSource();
            })
          })
        }, function(reason) {
              alert('Failed id: ' + reason);
        })
        ;






      });

    };



    // ***************************************************************
    // watchDelete
    // to delete a watch from the DB
    $scope.watchDelete = function (dbId,index) {

      $scope.dbId   = dbId;
      $scope.index  = index;
      var modalInstance = $modal.open({
          templateUrl: 'views/watch/deleteWatchModal.html',
          controller: ModalInstanceDeleteCtrl
      });


      modalInstance.result.then(function () {

        $scope.dbDeleteQuery.get({ query  :  'id:'+$scope.dbId})
          .$promise.then(function() {

            $scope.doSearchWatch();

          }, function(reason) {
            alert('Failed id: ' + reason);
          })
        ;

      });

    };


    //  ***************************************
    //  modal instance
    var ModalInstanceDeleteCtrl = function ($scope, $modalInstance) {

      $scope.ok = function () {

        $modalInstance.close();//($scope.selected.item);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    };

    $scope.$watch('pagingOptionsSource', function (newVal, oldVal) {
      if (newVal !== oldVal && newVal.pageSize !== oldVal.pageSize) {
        $scope.doSearchSource();
        $scope.pagingOptionsSource.currentPage = 1;
      }
      if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
        $scope.doSearchSource();
      }
    }, true);


    $scope.$watch('pagingOptionsWatch', function (newVal, oldVal) {
      if (newVal !== oldVal && newVal.pageSize !== oldVal.pageSize) {
        $scope.doSearchWatch();
        $scope.pagingOptionsWatch.currentPage = 1;
      }
      if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
        $scope.doSearchWatch();
      }
    }, true);


    //$scope.doSearchSource();

    /*
     Domains menu
     */
    $scope.domains =  [
      {name:'Technologie',activites:[
        {name:'Publications scientifiques'},
        {name:'Brevets/marques'}
      ]},
      {name:'Economie/Politique',activites:[
        {name:'Organismes publics'},
        {name:'Etudes de marchés'},
        {name:'Bases de données entreprises'},
        {name:'Appel d\'offres'},
        {name:'Informations financières'}
      ]},
      {name:'Concurrence/Entreprises',activites:[
        {name:'Agriculture, Sylviculture, et pêche'},
        {name:'Industries extractives'},
        {name:'Industries manufacturières'},
        {name:'Production et distribution d\'électricité, gaz, vapeur, air conditionné'},
        {name:'Production et distribution d\'eau, assainissement, gestion des déchets et dépollution'},
        {name:'Construction'},
        {name:'Commerce, réparation d\'automobiles, et motocycles'},
        {name:'Transport et entreposage'},
        {name:'Hébergement et restauration'},
        {name:'Information et communication'},
        {name:'Activité financières et assurances'},
        {name:'Activités immobilières'},
        {name:'Activités spécialisées scientifiques et techniques'},
        {name:'Activités de service administratifs et de soutien'},
        {name:'Administration publique'},
        {name:'Enseignement'},
        {name:'Santé humaine, action sociale'},
        {name:'Arts, spectacles, activités récréatives'},
        {name:'Autres activités de services'},
        {name:'Activités de ménages'},
        {name:'Activités extra territoriales'},
      ]},
      {name:'Juridique/réglementaire'},
      {name:'Réseaux sociaux'},
      {name:'Presse',activites:[
        {name:'Agricole/Agroalimentaire'},
        {name:'Assurance'},
        {name:'Arts/Musique/Spectacle'},
        {name:'Automobile'},
        {name:'Autres services'},
        {name:'Batiment'},
        {name:'Bijoux'},
        {name:'Bois, Papier, Carton'},
        {name:'Communication'},
        {name:'Distribution'},
        {name:'Economie/ Finance'},
        {name:'Environnement'},
        {name:'Géopolitique, Défense'},
        {name:'Industrie & Techniques'},
        {name:'Informatique et réseaux'},
        {name:'Jeux et Jouets'},
        {name:'Juridique'},
        {name:'Petite enfance'},
        {name:'People'},
        {name:'Photo'},
        {name:'Restauration/Hotellerie'},
        {name:'Relation client/Ressources humaines'},
        {name:'Santé'},
        {name:'Transport'},
        {name:'Sport'},
        {name:'Tourisme & Voyages'},
        {name:'Urbanisme'},
        {name:'Vin et Boissons'},
        {name:'WebDesign et multimédia'}
      ]}
    ] ;
    $scope.domain = ''; //= $scope.domains[0];
    /*
     Activities menu
     */
    // $scope.activities =  [
    // ] ;
    $scope.activity = ''; //$scope.domains[0].activites[0];

    /*
     Folders menu
     */
    /*$scope.folders =  [
      {name:'Dossier 1'},
      {name:'Dossier 2'},
      {name:'Dossier 3'}
    ] ;
    $scope.folder = $scope.folders[2];*/

    /*
     Frequency menu
     */
    $scope.frequencies =  [
      {option:'1h'},
      {option:'12h'},
      {option:'24h'},
      {option:'48h'}

    ] ;
    $scope.frequency = $scope.frequencies[1];

    /*
     Notifications menu
     */
    $scope.notifications =  [
      {option:'Pas de notification'},
      {option:'email'}

    ] ;
    $scope.notification = $scope.notifications[0];



    //$scope.$on('CHECKRSS',function(){$scope.checkingSource=true});
    //$scope.$on('UNCKECKRSS',function(){$scope.checkingSource=false});

  // ***************************************************************
    // doSearchFolder
    // list the available sources
    $scope.doSearchFolder = function () {
      $scope.isError = false;

      // search all watchs if no source defined
      if (!$scope.model.sourceId) {
        $scope.model.sourceId = '*';
      }

      $scope.dbList.get({
                      type_s      : 'tree',
                      title_t     : 'wfolder',
                      user_s      : $username,
        }).$promise.then(function(result) {



          // angular.forEach(result.success.response.docs, function (item, index) {

          //   $scope.rowTabWatch[item.id]= index;

          // });

          // $scope.myDataWatch            = result.success.response.docs;
          // $scope.totalServerItemsWatch  = result.success.response.numFound;
          $scope.folders = [];
          $scope.folderArray = [];
          if(angular.isDefined(result.success.response.docs[0].content_s)){
            var tmp = JSON.parse(result.success.response.docs[0].content_s);
            var log = [];
            angular.forEach(tmp[0].nodes, function(value1, key1) {
              // if(angular.isArray(value1)){
              //   alert(angular.isArray(value1));

              //   angular.forEach(value1, function(value2, key2) {
                  
              //     if(angular.isArray(value2)){
              //       angular.forEach(value2, function(value3, key3) {
                      
              //         if(angular.isArray(value3)){
              //           $scope.forEach.push(value3);

              //           angular.forEach(value3, function(value4, key4) {
              //             //$scope.folders.push(key + ': ' + value);
              //           }, log);
              //           $scope.folders.push(vlue3.id+ ': ' + value3.title);

              //         }
              //         else $scope.folders.push(key3 + ': ' + value3);

              //       }, log);

              //     }
              //     else $scope.folders.push(key2 + ': ' + value2);
                
              //   }, log);

              // }
              // else
              $scope.folders.push({"id":value1.id ,"name":value1.title});
              $scope.folderArray[value1.id]=value1.title;
              angular.forEach(value1.nodes, function(value2, key2){
                $scope.folders.push({"id":value2.id , "name":value2.title});
                $scope.folderArray[value2.id]=value2.title;
                angular.forEach(value2.nodes, function(value3, key3){
                  $scope.folders.push({"id":value3.id, "name":value3.title});
                  $scope.folderArray[value3.id]=value3.title;
                  if(angular.isArray(value3.nodes)){
                    angular.forEach(value3.nodes, function(value4, key4){
                      $scope.folders.push({"id":value4.id, "name":value4.title});
                      $scope.folderArray[value4.id]=value4.title;
                    }, log);
                  }
                }, log);
              }, log);
            }, log);
            //$scope.folders = JSON.parse(result.success.response.docs[0].content_s);
            //$scope.folder = $scope.folders[1];
          }
        }, function(reason) {
          alert('Failed: ' + reason);
        });
    };
  $scope.doSearchFolder();
  });
