'use strict';

angular.module('websoApp')
  .controller('AddWatchCtrl', function ($cookieStore, $scope,$resource,cfg,$modal,$log,$http) {

    var $username = $cookieStore.get('username');

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
      inputUrl    : '',
      inputTags   : '',
      inputTitle  : '',
      inputQuery  : '',
      mySourceSelections : []
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
        angular.forEach($scope.model.mySourceSelections, function ( item ) {
          $scope.model.inputTitle = item.title_t;
          $scope.model.inputUrl   = item.url_s;
          $scope.model.inputTags  = item.tags_s;

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
        {visible:false,width:'50px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
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
    var $username = $cookieStore.get('username');

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



    // ***************************************************************
    // doSearchSource
    // list the available sources
    $scope.doSearchSource = function () {
      $scope.sourceResult = $scope.dbList.get({type_s:'source'},
        function() {        //call back function for asynchronous
          if (typeof $scope.sourceResult.success.response === "undefined") {}
          else {
            $scope.myDataSource = $scope.sourceResult.success.response.docs;

            $('.row').trigger('resize');
          }
        }
      );

    };


    // ***************************************************************
    // doSearchWatch
    // list the available sources
    $scope.doSearchWatch = function () {
      $scope.watchResult = $scope.dbList.get({type_s:'watch'},
        function() {        //call back function for asynchronous
          if (typeof $scope.sourceResult.success.response === "undefined") {}
          else {
            $scope.myDataWatch = $scope.watchResult.success.response.docs;

            $('.row').trigger('resize');
          }
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
        //domain_s:       $scope.domain.name,
        //activity_s:     $scope.activity.name,
        refresh_s       : $scope.frequency.option

      },function () {

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
        //source_id_s:    $scope.sourceAddResult.success.id,
        notification_s: $scope.notification.option

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
      $scope.solrResult       = $scope.solrResource.get({q:$scope.inputQuery}

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
    // to delete a source from the DB
    $scope.sourceDelete = function (dbId,index) {
      var dbSource = confirm('Etes vous sûr de vouloir supprimer cette source?');
      if (dbSource) {
        alert('Suppression confirmée');

        /*
         Delete from Docs
         */
        $scope.sourceAddResult = $scope.dbDelete.get({
          id  :     dbId
        });
        /*
         Delete from table
         */
        $scope.myDataSource.splice(index, 1);
      }


    };

    // ***************************************************************
    // watchDelete
    // to delete a watch from the DB
    $scope.watchDelete = function (dbId,index) {
      var dbSource = confirm('Etes vous sûr de vouloir supprimer cette surveillance?');
      if (dbSource) {
        alert('Suppression confirmée');

        /*
         Delete from Docs
         */
        $scope.sourceAddResult = $scope.dbDelete.get({
          id  :     dbId
        });
        /*
         Delete from table
         */
        $scope.myDataWatch.splice(index, 1);
      }


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

