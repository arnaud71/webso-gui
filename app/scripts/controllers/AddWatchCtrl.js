'use strict';

angular.module('websoApp')
  .controller('AddWatchCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $log, $http, serviceWidgets, dashboard) {

    var $username = $cookieStore.get('username');

    $scope.isError                = false;
    $scope.errorMessage           = cfg.errorConnect;

    $scope.filterOptions = {
      filterText        : "",
      useExternalFilter : false
    };


    $scope.pagingOptions = {
      pageSizes     : [1000],
      pageSize      : 1000,
      currentPage   : 1
    };


    // use this type of declaration to avoid scope problem (between tabs)
    $scope.model = {
      inputUrl            : '',
      inputTags           : '',
      inputTitle          : '',
      inputQuery          : '',
      sourceId            : 0,
      watchId             : 0,
      docAvailable        : 0,
      mySourceSelections  : [],
      myWatchSelections   : []
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
          $scope.domain.name      = item.domain_s;
          $scope.activity.name    = item.activity_s;
          $scope.frequency.option = item.refresh_s;
          $scope.model.sourceId   = item.id;
        });
        $scope.doSearchWatch();
      },
      enablePaging        : true,
      enableRowSelection  : true,
      enableColumnResize  : true,
      multiSelect         : false,
      showFooter          : true,
      totalServerItems    : 'totalServerItems',
      pagingOptions       : $scope.pagingOptions,
      filterOptions       : $scope.filterOptions,
      showFilter          : true,

      //selectWithCheckboxOnly: 'true',
      //selectedItems: $scope.mySelections,
      columnDefs: [
        {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
        {visible:false,width:'50px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'*',field:'url_s', displayName:  'Source',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },
        {width:'*',field:'title_t', displayName:  'Title', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'tags_s', displayName:  'Tag', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'domain_s', displayName:  'Domaine', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'user_s', displayName:  'Auteur', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'IsWatched_b', displayName:  'Surveillance', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'', displayName:  'Gestion', cellTemplate: ' <button type="button" class="btn btn-xs" ng-click="sourceDelete(row.getProperty(\'id\'),row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button><button type="button" class="btn btn-xs" ng-click="test(source.id,source.url_s)"><span class="glyphicon glyphicon-pencil"></span></button>'}

      ]
    };


    $scope.gridOptionsWatch = {
      data                : 'myDataWatch',
      selectedItems       : $scope.model.myWatchSelections,
      afterSelectionChange: function () {
        angular.forEach($scope.model.myWatchSelections, function ( item ) {

          $scope.model.inputQuery     = item.query_s;
          $scope.folder.name          = item.folder_s;
          $scope.notification.option  = item.notification_s;
          $scope.model.watchId        = item.id;

        });
      },
      enablePaging        : true,
      enableRowSelection  : true,
      multiSelect         : false,
      showFooter          : true,
      totalServerItems    : 'totalServerItems',
      pagingOptions       : $scope.pagingOptions,
      filterOptions       : $scope.filterOptions,
      showFilter          : true,

      //selectWithCheckboxOnly: 'true',
      //selectedItems: $scope.mySelections,
      columnDefs: [
        {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
        {visible:false,width:'100px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {visible:false,width:'100px',field:'source_id_s', displayName:  'sourceId', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'*',field:'url_s', displayName:  'Source',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><a href="{{row.getProperty(col.field)}}" target="_blank">{{row.getProperty(col.field)}}</a></div>' },
        {width:'*',field:'title_t', displayName:  'Title', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'tags_s', displayName:  'Tag', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'domain_s', displayName:  'Domaine', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'user_s', displayName:  'Auteur', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'folder_s', displayName:  'Dossier', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'query_s', displayName:  'Requête', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},

        {width:'100px',field:'', displayName:  'Gestion', cellTemplate: ' <button type="button" class="btn btn-xs" ng-click="watchDelete(row.getProperty(\'id\'),row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button><button type="button" class="btn btn-xs" ng-click="test(source.id,source.url_s)"><span class="glyphicon glyphicon-pencil"></span></button>'}

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
    function addWidgetToSolr(widgetId, widgetType, widgetTitle, isEnable, widgetWeight, userWidget){
          $scope.widgetAdd = $resource(cfg.urlServices+'db/:action',
            {action:'put.pl', type_s:'widget', callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

          $scope.widgetAdd.get({
              id              : widgetId,
              widget_type_s   : widgetType,
              title_t         : widgetTitle,
              enable_s        : isEnable,
              weight_s        : widgetWeight,
              user_s          : userWidget,
              query_s         : ''
          })
    };

    // add widget : principal function
    function addWidget(widgetType){
      var userInformations = serviceWidgets.getUserIdents();
      var userWidget, widgetTitle;
      $scope.informations = $resource(cfg.urlServices+'db/:action',
        {action:'get.pl',callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

        // username
        userWidget = userInformations[0];

        // Request Solr to know if the current user have some widgets on the dashboard
        $scope.informations.get({user_s : userWidget, type_s:'widget'}).$promise.then(function(widg) {
            var addScope = $scope.$new();
            addScope.widgets = dashboard.widgets;

            if(widg.success.response.docs.length >= 10){
              alert('nombre de widgets maximum atteint');
            }else{
                var widgetId;
                var w = {
                  id: serviceWidgets.getIdWidget(widg.success.response.docs),
                  type: widgetType,
                  config: serviceWidgets.getWidgetConfiguration(widgetType)
                };
                // id du widget
                widgetId = serviceWidgets.getIdWidget(widg.success.response.docs);
                // titre du widget
                widgetTitle = serviceWidgets.getTitleWidget(widgetType); 
                // ajout du widget a la base Solr
                addWidgetToSolr(widgetId, widgetType, widgetTitle, true, 1, userWidget);
            }
            addScope.$destroy();
        });
    };

    // ***************************************************************
    // doSearchSource
    // list the available sources
    $scope.doSearchSource = function () {
      $scope.sourceResult = $scope.dbList.get({type_s:'source'},
        function() {        //call back function for asynchronous
          $scope.isError = false;
          if (typeof $scope.sourceResult.success !== "undefined") {
            if (typeof $scope.sourceResult.success.response === "undefined") {
            }
            else {
              $scope.myDataSource = $scope.sourceResult.success.response.docs;

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

      );

    };


    // ***************************************************************
    // doSearchWatch
    // list the available sources
    $scope.doSearchWatch = function () {
      $scope.isError = false;
      $scope.watchResult = $scope.dbList.get({type_s:'watch',source_id_s:$scope.model.sourceId},
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
      );

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
        domain_s        : $scope.domain.name,
        activity_s      : $scope.activity.name,
        refresh_s       : $scope.frequency.option

      },function () {
          if (typeof $scope.sourceAddResult.success === "undefined") {}
          else {
            $scope.model.sourceId = sourceAddResult.success.id;
            if (sourceAddResult.nb_doc_added>0) {
              $scope.model.docAvailable = 1;
            }
          }
      },function(){
          if($scope.model.valueCheckBoxSource === true){
            addWidget('affichageSource', $scope.model.inputTitle);
          }
      });


      var modalInstance = $modal.open({
        templateUrl: 'addSourceModal.html',
        controller: ModalInstanceCtrl
      });


    };



    // ***************************************************************
    // doAddWatch
    // add a watch in the DB
    $scope.doAddWatch = function () {
      $scope.watchAddResult = $scope.addResource.get({
        type_s:         'watch',
        url_s  :        $scope.model.inputUrl,
        title_t:        $scope.model.inputTitle,
        tags_ss :       $scope.model.inputTags,
        domain_s:       $scope.domain.name,
        activity_s:     $scope.activity.name,
        folder_s:       $scope.folder.name,
        query_s:        $scope.model.inputQuery,
        source_id_s:    $scope.model.sourceId,
        //source_id_s:    $scope.sourceAddResult.success.id,
        notification_s: $scope.notification.option

      }, function(){
          if($scope.model.valueCheckBoxWatch === true){
            addWidget('affichageSurveillance', $scope.model.inputTitle);
          }
      });


      // var addWatch = alert('Surveillance ajoutée');
      // Testing  Modal trigger
      var modalInstance = $modal.open({
        templateUrl: 'addWatchModal.html',
        controller: ModalInstanceCtrl
      });


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
          $scope.sourceChecked = true;
        });
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
        // delete the source
        //$scope.sourceAddResult = $scope.dbDelete.get({
        //  id  :     $scope.dbId
        //});

        $scope.sourceAddResult = $scope.dbDeleteQuery.get({
          query  :  'id:'+$scope.dbId
        });

        // delete watches linked to the source
        $scope.sourceAddResult = $scope.dbDeleteQuery.get({
          query  :  'source_id_s:'+$scope.dbId
        });

        // delete documents linked to the source
        $scope.sourceAddResult = $scope.dbDeleteQuery.get({
          query  :  'source_id_ss:'+$scope.dbId
        });

        $scope.myDataSource.splice($scope.index, 1);


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
        $scope.sourceAddResult = $scope.dbDelete.get({
          id  :     $scope.dbId
        });
        $scope.myDataWatch.splice($scope.index, 1);

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


    //$scope.doSearchSource();

    /*
     Domains menu
     */
    $scope.domains =  [
      {name:'domaine 1'},
      {name:'domaine 2'},
      {name:'domaine 3'}
    ] ;
    $scope.domain = $scope.domains[2];
    /*
     Activities menu
     */
    $scope.activities =  [
      {name:'Secteur dactivité 1'},
      {name:'Secteur dactivité 2'},
      {name:'Secteur dactivité 3'}
    ] ;
    $scope.activity = $scope.activities[2];

    /*
     Folders menu
     */
    $scope.folders =  [
      {name:'Dossier 1'},
      {name:'Dossier 2'},
      {name:'Dossier 3'}
    ] ;
    $scope.folder = $scope.folders[2];

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
  });

