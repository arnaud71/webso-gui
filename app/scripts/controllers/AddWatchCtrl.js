'use strict';

angular.module('websoApp')
    .controller('AddWatchCtrl', function ($scope,$resource,cfg,$modal,$log) {

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



    $scope.gridOptionsSource = {
      data                : 'myData',
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
        {width:'100px',field:'', displayName:  'Gestion', cellTemplate: ' <button type="button" class="btn btn-xs" ng-click="doDelete(row.getProperty(\'id\'),row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button><button type="button" class="btn btn-xs" ng-click="test(source.id,source.url_s)"><span class="glyphicon glyphicon-pencil"></span></button>'}

      ]
    };

    $scope.tabs = [
      { title:"Ajouter source"},
      { title:"Sélectionner source"}
    ];



    $scope.checkingSource = false;
    $scope.sourceChecked  = false;



    $scope.sourceList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl', type_s:'source',user_s:'user_0',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.addResource = $resource(cfg.urlServices+'db/:action',
        {action:'put.pl',user_s:'user_0', level_sharing_i:'1',callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}}
    );

    $scope.solrResource = $resource(cfg.urlDB+'solr/collection1/:action',
        {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
        {get:{method:'JSONP'}}
    );



    $scope.checkSourceResource = $resource(cfg.urlServices+'harvester/RSS/:action',
        {action:'check_rss.pl',callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}}
    );

        $scope.doSearchSource = function () {
          $scope.sourceResult = $scope.sourceList.get({type_s:'source'},
          function() {        //call back function for asynchronous
            if (typeof $scope.sourceResult.success.response === "undefined") {}
            else {
            $scope.myData = $scope.sourceResult.success.response.docs;

            $('.row').trigger('resize');
            }
          }
          );


        };

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

    $scope.testWatch = function() {
      $scope.solrResult       = $scope.solrResource.get({q:$scope.inputQuery}

      );
    }


    //  modal instance

    var ModalInstanceCtrl = function ($scope, $modalInstance) {

        $scope.ok = function () {
            $modalInstance.close();//($scope.selected.item);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    $scope.sourceDelete = $resource(cfg.urlServices+'db/:action',
      {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.doDelete = function (sourceId,index) {
      var deleteSource = confirm('Etes vous sûr de vouloir supprimer cette source?');
      if (deleteSource) {
        alert('Suppression confirmée');

        /*
         Delete from Docs
         */
        $scope.sourceAddResult = $scope.sourceDelete.get({
          id  :     sourceId
        });
        /*
         Delete from table
         */
        $scope.myData.splice(index, 1);
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


//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1
