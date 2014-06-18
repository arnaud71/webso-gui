'use strict';

angular.module('websoApp')
    .controller('UsersCtrl', function ($cookieStore, $location, $scope,$resource,cfg,$modal) {

        $scope.isSuccess = false;

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
                    if (typeof $scope.watchResult.success.response === "undefined") {}
                    else {
                        data = $scope.watchResult;
                        $scope.setPagingData(data,page,pageSize);
                        //$('.row').trigger('resize');
                    }
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

	    $scope.roles =  ['administrateur', 'veilleur', 'lecteur'];
	    $scope.userRole = $scope.roles[2];

        $scope.gridOptionsSource = {
            data: 'myData',
            enablePaging: true,
            enableRowSelection : false,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            filterOptions: $scope.filterOptions,
            showFilter: true,

            //selectWithCheckboxOnly: 'true',
            //selectedItems: $scope.mySelections,
            columnDefs: [
                {width:'50px',field:'', displayName:  'Nb', cellTemplate: '<div class="ngCellText">{{(row.rowIndex+1)+(pagingOptions.pageSize*pagingOptions.currentPage-pagingOptions.pageSize)}}</div>'},
                {visible:false,width:'50px',field:'id', displayName:  'Id', cellTemplate: '<div class="ngCellText" ng-bind-html="row.getProperty(col.field)"></div>'},
                {width:'*',field:'user_s', displayName:  'Utilisateur',cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'role_s', displayName:  'Rôle',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'', displayName:  'Modification du rôle',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"> <select data-ng-model="userRole" ng-options="userRole for userRole in roles"></select><button type="button" class="btn btn-xs" ng-click="modifyRole(row.getProperty(\'id\'), userRole, row.rowIndex)" ><span class="glyphicon glyphicon-refresh"></span></button></div>' },
                {width:'*',field:'user_s', displayName:  'Suppression de l\'utilisateur', cellTemplate: ' <center><button type="button" class="btn btn-xs" ng-click="deleteCount(row.getProperty(\'id\'), row.getProperty(col.field), row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button></center>'}

            ]
        };


    $scope.userResult = $scope.userList.get({type_s:'user'},
        function() {        //call back function for asynchronous
            if (typeof $scope.userResult.success.response === "undefined") {}
            else {
                $scope.myData = $scope.userResult.success.response.docs;

                $('.row').trigger('resize');
            }
        }
    );

// suppression d'un utilisateur
        $scope.countDelete = $resource(cfg.urlServices+'db/:action',
          {action:'delete.pl', id:'', type_s:'user_s', callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});

    $scope.deleteCount = function (userId, username, index) {
            var usernameCookie = $cookieStore.get('username');
            var userRoleCookie = $cookieStore.get('userRole');
        /*
         Confirm dialogs
         */
        var deleteSource = confirm('Etes vous sûr de vouloir supprimer cet utilisateur ?');
        if (deleteSource) {
            /*
             Delete from Docs
             */
            $scope.sourceAddResult = $scope.countDelete.get({
                id  :     userId,
                user_s : username
            });
            /*
             Delete from ng-grid table
             */
            $scope.userResult.success.response.docs.splice(index, 1);

            if(usernameCookie === username && userRoleCookie === 'administrateur'){
                $cookieStore.remove('Authenticated');
                $cookieStore.remove('username');
                $cookieStore.remove('password');
                $cookieStore.remove('userRole');
                $location.path('/home');
            }
            window.location.reload();
        }
    };

    // modification du role de l'utilisateur
    $scope.roleModify = $resource(cfg.urlServices+'db/:action',
        {action:'update.pl', id:'', type_s:'user', callback:"JSON_CALLBACK"},
        {get:{method:'JSONP'}});

    $scope.modifyRole = function (userId, role) {
        $scope.roleModify.get({ id : userId, role_s : role});
        window.location.reload();
    };
});