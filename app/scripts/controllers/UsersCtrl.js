'use strict';

angular.module('websoApp')
    .controller('UsersCtrl', function ($log, $cookieStore, $location, $scope,$resource,cfg,$modal) {

    // default sort function


        $scope.isSuccess              = false;
        $scope.isError                = false;
        $scope.errorMessage           = cfg.errorConnect;
        $scope.myData = [];

        /*
         Getting watch   List
         */

        $scope.userList = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl', type_s:'user',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});



        $scope.filterOptions = {
            filterText: "",
            useExternalFilter: false


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
            $scope.watchResult = $scope.userList.get({rows:pageSize,start:(page*pageSize-pageSize)},
                function() {        //call back function for asynchronous
                    if (typeof $scope.userResult.success !== "undefined") {
                      if (typeof $scope.watchResult.success.response === "undefined") {
                      }
                      else {
                        data = $scope.watchResult;




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

        //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        /*$scope.$watch('pagingOptions', function (newVal, oldVal) {
            if ((newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) || (newVal !== oldVal && newVal.pageSize !== oldVal.pageSize)) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);*/

        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
            }
        }, true);

//	    $scope.roles =  ['administrateur', 'veilleur', 'lecteur'];

      $scope.roles = [
        'administrateur',
        'veilleur'      ,
        'lecteur'
      ];

      $scope.rolesIndex = {
        'administrateur'  : 0,
        'veilleur'        : 1,
        'lecteur'         : 2
      };

    $scope.rolesTab = {};

      //$log.info($scope.roles[0].name);

	    //$scope.userRole = $scope.roles[2];

    $scope.sortInfo = {
      fields:['user_s'],
      directions:['asc']
    };

        $scope.gridOptionsSource = {
            data: 'myData',
            enablePaging: true,
            enableRowSelection : false,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            showFilter: true,
            enableSorting: true,
            sortInfo: $scope.sortInfo,

            //selectWithCheckboxOnly: 'true',
            //selectedItems: $scope.mySelections,
            columnDefs: [
                {width:'50px',field:'', displayName:  'Nb',cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
                {visible:false,width:'50px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'*',field:'user_s', displayName:  'Utilisateur' ,cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'role_s', displayName:  'Rôle',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                //{width:'*',field:'role_s', displayName:  'Modification du rôle',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"> <select ng-init="userRole = row.getProperty(\'role_s\')" data-ng-model="userRole" ng-options="userRole for userRole in roles"></select><button type="button" class="btn btn-xs" ng-click="modifyRole(row.getProperty(\'id\'), userRole, row.rowIndex)" ><span class="glyphicon glyphicon-refresh"></span></button></div>' },
              {width:'*',field:'', displayName:  'Modification du rôle',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"> <select ng-model="rolesTab[row.getProperty(\'user_s\')]" ng-options="userRole for userRole in roles"></select><button type="button" class="btn btn-xs" ng-click="modifyRole(row.getProperty(\'id\'), rolesTab[row.getProperty(\'user_s\')], row.rowIndex)" ><span class="glyphicon glyphicon-refresh"></span></button></div>' },

              {width:'*',field:'user_s', displayName:  'Suppression de l\'utilisateur', cellTemplate: ' <center><button type="button" class="btn btn-xs" ng-click="deleteCount(row.getProperty(\'id\'), row.getProperty(col.field), row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button></center>'}

            ]
        };

    /*$scope.getRole = function (index) {
      if ($scope.rolesTab[index] == 'veilleur') {
        return 1
      }
      else if ($scope.rolesTab[index] == 'administrateur') {
        return 0;
      }
      else {
        return 2;
      }
    };*/

    $scope.initRole = function (role) {
      return(role);
    }

    $scope.userList.get({type_s:'user'}).$promise.then(function(result) {

                // init rolesTab to construct the select column
                angular.forEach(result.success.response.docs, function (item, index) {
                  $scope.rolesTab[item.user_s]= item.role_s;
                });


                $scope.myData = result.success.response.docs;



                }, function(reason) {
                  alert('Failed: ' + reason);
    });

    /* $scope.userResult = $scope.userList.get({type_s:'user'},
        function() {        //call back function for asynchronous
            $scope.isError = false;
            if (typeof $scope.userResult.success !== "undefined") {
              if (typeof $scope.userResult.success.response === "undefined") {
              }
              else {
                $scope.myData = $scope.userResult.success.response.docs;

                //prepare list of user role for default select button
                angular.forEach($scope.userResult.success.response.docs, function (item, index) {
                  $scope.rolesTab.push(item.role_s);
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

    );
    */

//  modal instance
    var ModalInstanceDeleteCtrl = function ($scope, $modalInstance) {

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

// delete a user
    $scope.countDelete = $resource(cfg.urlServices+'db/:action',
          {action:'delete.pl', id:'', type_s:'user', callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});

    $scope.deleteCount = function (userId, username, index) {
        var usernameCookie = $cookieStore.get('username');
        var userRoleCookie = $cookieStore.get('userRole');

      $scope.userId   = userId;
      $scope.index  = index;
      var modalInstance = $modal.open({
        templateUrl: 'deleteUserModal.html',
        controller: ModalInstanceDeleteCtrl
      });

      modalInstance.result.then(function () {
        $scope.userDeleteResult = $scope.countDelete.get({
                id  :     userId,
                user_s : username
        });

        $scope.myData.splice($scope.index, 1);

        if(usernameCookie === username && userRoleCookie === 'administrateur'){
            $cookieStore.remove('Authenticated');
            $cookieStore.remove('username');
            $cookieStore.remove('password');
            $cookieStore.remove('userRole');
            $location.path('/home');
        }
      });
    };

    // modify the role of a user
    $scope.roleModify = $resource(cfg.urlServices+'db/:action',
        {action:'update.pl', id:'', type_s:'user', callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

    $scope.modifyRole = function (userId, role) {
        $scope.roleModify.get({ id : userId, role_s : role}).$promise.then(function(result) {

          angular.forEach($scope.myData, function (item, index) {
            if (item.id == userId) {
              $scope.rolesTab[item.user_s] = role;
              item.role_s = role;
            }
          });


          //$scope.myData[row].role_s = role;
          //$('.row').trigger('resize');
          //window.location.reload();
        }, function(reason) {
          alert('Failed: ' + reason);
        });

      //  window.location.reload();

    };
});