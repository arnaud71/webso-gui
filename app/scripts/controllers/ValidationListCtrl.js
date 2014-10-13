'use strict';

angular.module('websoApp')
  .controller('ValidationListCtrl', function ($cookieStore, $scope,$resource,cfg,$modal) {

        $scope.mySelections = [];
        var $username = $cookieStore.get('username');
        var $userRole = $cookieStore.get('userRole');
        $scope.isError                = false;
        $scope.errorMessage           = cfg.errorConnect;

        /*
        Getting validation doc
         */
        /*if($userRole === 'administrateur'){
          $scope.validationList = $resource(cfg.urlServices+'db/:action',
              {action:'get.pl', type_s:'validation',user_s:'*',callback:"JSON_CALLBACK"},
              {get:{method:'JSONP'}});
        }else{*/
          $scope.validationList = $resource(cfg.urlServices+'db/:action',
              {action:'get.pl', type_s:'validation',user_s:$username,callback:"JSON_CALLBACK"},
              {get:{method:'JSONP'}});
       // }

        $scope.doSearch = function () {
            $scope.validationResult = $scope.validationList.get();
        };

        $scope.doSearch();

    /*
     COPY source list
     */



    $scope.filterOptions = {
      filterText: "",
      useExternalFilter: false


    };

    $scope.sortInfo = {
      fields:['creation_dt'],
      directions:['desc']
    };


    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
      pageSizes: [10,100,1000],
      pageSize: 10,
      currentPage: 1
    };

    $scope.setPagingData = function(data, page, pageSize){
      $scope.totalServerItems = data.success.response.numFound;
      data = data.success.response.docs;
      //var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
      $scope.myData = data;
      if (!$scope.$$phase) {
        $scope.$apply();
      }
    };

    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
     // setTimeout(function () {
        var data;
        $scope.validationResult = $scope.validationList.get({rows:pageSize,start:(page*pageSize-pageSize)},
          function() {        //call back function for asynchronous
            $scope.isError = false;
            if (typeof $scope.validationResult.success !== "undefined") {
              if (typeof $scope.validationResult.success.response === "undefined") {
              }
              else {
                data = $scope.validationResult;
                $scope.setPagingData(data, page, pageSize);
                //$('.row').trigger('resize');
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

      //}, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
      if ((newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) || (newVal !== oldVal && newVal.pageSize !== oldVal.pageSize)) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);

    $scope.$watch('filterOptions', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }
    }, true);


    $scope.gridOptionsSource = {
      data: 'myData',
      enablePaging: true,
      enableRowSelection : true,
      multiSelect: false,
      showFooter: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      filterOptions: $scope.filterOptions,
      showFilter: true,

      //selectWithCheckboxOnly: 'true',
      selectedItems: $scope.mySelections,
        afterSelectionChange: function () {
            $scope.selectedIDs = [];
            angular.forEach($scope.mySelections, function ( item ) {
                $scope.selectedIDs.push( item.content_t ) ;
            });
        },
      sortInfo            : $scope.sortInfo,
      columnDefs: [
        {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
        {visible:false,width:'50px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'*',field:'url_s', displayName:  'Source',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
        {width:'*',field:'title_t', displayName:  'Title', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'tags_s', displayName:  'Tag', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
     //   {width:'100px',field:'domain_s', displayName:  'Domaine', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'folder_s', displayName:  'Dossier', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'user_s', displayName:  'Auteur', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},

        // {width:'100px',field:'IsWatched_b', displayName:  'Surveillance', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
        {width:'100px',field:'', displayName:  'Gestion', cellTemplate: ' <button type="button" class="btn btn-xs" ng-click="doDelete(row.getProperty(\'id\'),row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button>  <a ng-href="{{row.getProperty(\'url_s\')}}" target="_blank"><span class="glyphicon glyphicon-link"></span></a><!-- <button type="button" class="btn btn-xs" ng-click="test(source.id,source.url_s)"><span class="glyphicon glyphicon-pencil"></span></button>-->'}

      ]
    };


    $scope.doSearch = function () {
      $scope.sourceResult = $scope.sourceList.get({type_s:'source'},
        function() {        //call back function for asynchronous
          $scope.isError = false;
          if (typeof $scope.sourceResult.success.response === "undefined") {}
          else {
            $scope.myData = $scope.sourceResult.success.response.docs;

            $('.row').trigger('resize');
          }
        },
        //error
        function () {
          $scope.isError = true;

        }
      );


    };

    /*
     Deleting source
     */

    $scope.validationDelete = $resource(cfg.urlServices+'db/:action',
      {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.doDelete = function (sourceId,index) {


        /*
         Confirm dialogs
         */

        //var deleteSource = confirm('Etes vous sûr de vouloir supprimer cette validation?');



            var modalInstance = $modal.open({
              templateUrl: 'deleteValidationModal.html',
              controller: ModalInstanceDeleteCtrl

            });

            modalInstance.result.then(function () {
              $scope.validationDelete.get({
                id: sourceId,
                user_s: $username
              }).$promise.then(function () {

                  $scope.myData.splice(index, 1);


                }, function (reason) {
                  alert('Failed id: ' + reason);
                })

            })



    };

    var ModalInstanceDeleteCtrl = function ($scope, $modalInstance) {

      $scope.ok = function () {

        $modalInstance.close();//($scope.selected.item);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

    };



    //$scope.doSearch();



  });

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1