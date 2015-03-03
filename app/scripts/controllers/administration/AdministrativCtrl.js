'use strict';

angular.module('websoApp')
  .controller('AdministrativCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $filter, sharedService) {

        $scope.dbg = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl', callback:'JSON_CALLBACK'},
            {get:{method:'JSONP'}});

        $scope.dbp = $resource(cfg.urlServices+'db/:action',
            {action:'put.pl', callback:'JSON_CALLBACK'},
            {put:{method:'JSONP'}});

        $scope.dbc = $resource(cfg.urlServices+'db/:action',
            {action:'change.pl', callback:'JSON_CALLBACK'},
            {change:{method:'JSONP'}});

        $scope.myData = [];
        $scope.views  = [
            {'showCompList':false},
            {'addComp':false},
            {'addGroup':false},
            {'addUser':false}
        ];

        $scope.formCompany = [];
        $scope.formGroup   = [];
        $scope.formUser    = [];

        var $company = 'c_fe746f2d498f80b73e80c27ebf0c9c1c';

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

        $scope.sortInfo = {
            fields:['name_s'],
            directions:['asc']
        };

        $scope.companyGridList = {
            data: 'myData',
            enablePaging: true,
            enableRowSelection : false,
            enableCellEdit: true,
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
                {width:'*',field:'name_s', displayName:  'Entreprise' ,cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'admin_id_ss', displayName:  'admin(s)',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'user_max_i',  displayName:  'Max users',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'group_max_i', displayName:  'Max groupes',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'permission_ss', displayName:  'Permissions', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'110px',field:'', displayName:  $filter('i18n')('_CRUD_MANAGEMENT_'), cellTemplate: ''//' <center><button type="button" class="btn btn-xs" ng-click="delete(row.getProperty(\'id\'), row.getProperty(\'user_s\'), row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button> <button type="button" class="btn btn-xs" ng-click="save(row.getProperty(\'id\'), row.getProperty(\'user_s\'), row.rowIndex)" ><span class="glyphicon glyphicon-save"></span></button></center>'
                }
            ]
        };

        $scope.groupGridList = {
            data: 'myData',
            enablePaging: true,
            enableRowSelection : false,
            enableCellEdit: true,
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
                {width:'*',field:'name_s', displayName:  'Group' ,cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'permission_ss', displayName:  'Permissions', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'110px',field:'', displayName:  $filter('i18n')('_CRUD_MANAGEMENT_'), cellTemplate: ''//' <center><button type="button" class="btn btn-xs" ng-click="delete(row.getProperty(\'id\'), row.getProperty(\'user_s\'), row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button> <button type="button" class="btn btn-xs" ng-click="save(row.getProperty(\'id\'), row.getProperty(\'user_s\'), row.rowIndex)" ><span class="glyphicon glyphicon-save"></span></button></center>'
                }
            ]
        };

        $scope.UserGridList = {
            data: 'myData',
            enablePaging: true,
            enableRowSelection : false,
            enableCellEdit: true,
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
                {width:'*',field:'firstame_s', displayName:  'First Name' ,cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'lastname_s', displayName:  'Last Name',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'mail_s', displayName:  'Mail', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'group_id_s', displayName:  'Group',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                {width:'*',field:'role_s', displayName:  'Role',cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()">{{row.getProperty(col.field)}}</div>' },
                
                {width:'110px',field:'', displayName:  $filter('i18n')('_CRUD_MANAGEMENT_'), cellTemplate: ''//' <center><button type="button" class="btn btn-xs" ng-click="delete(row.getProperty(\'id\'), row.getProperty(\'user_s\'), row.rowIndex)" ><span class="glyphicon glyphicon-trash"></span></button> <button type="button" class="btn btn-xs" ng-click="save(row.getProperty(\'id\'), row.getProperty(\'user_s\'), row.rowIndex)" ><span class="glyphicon glyphicon-save"></span></button></center>'
                }
            ]
        };

        $scope.showCompanyList = function (){

            $scope.views.showCompList = true;
            $scope.views.showGroupList = false;
            $scope.views.showUserList = false;
            $scope.views.addComp  = false;
            $scope.views.addGroup = false;
            $scope.views.addUser  = false;

            $scope.dbg.get({
                type_s: 'company'
            }).$promise.then(function(result){
                $scope.companyList = result.success.response.docs;
                $scope.myData = result.success.response.docs;
            });
        }

        $scope.showGroupList = function (){

            $scope.views.showCompList = false;
            $scope.views.showGroupList = true;
            $scope.views.showUserList = false;
            $scope.views.addComp  = false;
            $scope.views.addGroup = false;
            $scope.views.addUser  = false;

            $scope.dbg.get({
                type_s: 'group',
                company_id_s: $company
            }).$promise.then(function(result){
                $scope.groupList = result.success.response.docs;
                $scope.myData = result.success.response.docs;
            });
        }

        $scope.showUserList = function (){

            $scope.views.showCompList = false;
            $scope.views.showGroupList = false;
            $scope.views.showUserList = true;
            $scope.views.addComp  = false;
            $scope.views.addGroup = false;
            $scope.views.addUser  = false;

            $scope.dbg.get({
                type_s: 'user',
                company_id_s: $company
            }).$promise.then(function(result){
                $scope.userList = result.success.response.docs;
                $scope.myData = result.success.response.docs;
            });
        }

        $scope.newCompany = function(){

            $scope.dbp.put({
                type_s:'company',
                name_s: $scope.formCompany.name,
                user_max_i : $scope.formCompany.maxUser,
                group_max_i : $scope.formCompany.maxGroup,
                // admin_id_ss : user_s
                // permission_ss : perms
            }).$promise.then(function(){
                var modalInstance = $modal.open({
                    templateUrl: 'OkayModal.html',
                    controller: ModalInstanceCtrl
                });
            });
        }

         $scope.newGroup = function(){
            // alert("name: "+$scope.formGroup.name+", perms: "+$scope.formGroup.permissions);
            $scope.dbp.put({
                type_s:'group',
                name_s: $scope.formGroup.name,
                company_id_s  : $company,
                permission_ss : $scope.formGroup.permissions
            }).$promise.then(function(){
                var modalInstance = $modal.open({
                    templateUrl: 'OkayModal.html',
                    controller: ModalInstanceCtrl
                });
            });
        }

         $scope.newUser = function(){
            alert("fisrt name: "+$scope.formUser.firstName+", last name: "+$scope.formUser.lastName+" email: "+$scope.formUser.email+" group: "+$scope.formUser.group.id);
            // $scope.dbp.put({
            //     type_s:'user',
            //     firstname_s : $scope.formUser.firstName,
            //     lastname_s  : $scope.formUser.lastastName,
            //     mail_s      : $scope.formUser.email,
            //     group_id_s  : $scope.formUser.group.id,
            // }).$promise.then(function(){
            //     var modalInstance = $modal.open({
            //         templateUrl: 'OkayModal.html',
            //         controller: ModalInstanceCtrl
            //     });
            // });
        }

        $scope.formAddCompany = function(){
            $scope.views.addComp  = true;
            $scope.views.addGroup = false;
            $scope.views.addUser  = false;
            $scope.views.showCompList  = false;
            $scope.views.showGroupList = false;
            $scope.views.showUserList  = false;
        }

        $scope.formAddGroup = function(){
            $scope.views.addGroup = true;
            $scope.views.addUser  = false;
            $scope.views.addComp  = false;
            $scope.views.showCompList  = false;
            $scope.views.showGroupList = false;
            $scope.views.showUserList  = false;
        }

        $scope.formAddUser = function(){
            $scope.views.addUser  = true;
            $scope.views.addGroup = false;
            $scope.views.addComp  = false;
            $scope.views.showCompList  = false;
            $scope.views.showGroupList = false;
            $scope.views.showUserList  = false;

            $scope.dbg.get({
                type_s: 'group',
                company_id_s: $company
            }).$promise.then(function(result){
                $scope.groupList = result.success.response.docs;
                $scope.myData = result.success.response.docs;
            });
        }

        $scope.updateCompany = function(){
            $scope.dbc.change({
                id : $id,
                name_s: $name,
                user_max_i : $nbu,
                group_max_i : $nbg,
                // admin_id_ss : user_s
                // permission_ss : perms
            }).$promise.then(function(){
                // var modal = open...
            });
        }

        //  modal instance
        var ModalInstanceCtrl = function ($scope, $modalInstance) {

            $scope.ok = function () {
                $modalInstance.close();
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

  });