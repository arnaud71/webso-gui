'use strict';

angular.module('websoApp')
    .controller('AddSourceCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $log) {

        /*
        Globals
         */
        $scope.resultAdd = '';


        /*
         Input fields - from sourceAdd
         */
        $scope.inputUrl       = '';
        $scope.inputTags      = '';
        $scope.inputTitle     = '';
        $scope.inputDomain    = '';
        $scope.inputActivity  = '';
        var $username = $cookieStore.get('username');
        var $token    = $cookieStore.get('token');
        var $token_timeout = $cookieStore.get('token_timeout');

     //   $scope.inputCreationDate = Date.now();



        $scope.sourceAdd = $resource(cfg.urlServices+':action',
            {action:'db/put.pl', type_s:'source',user_s:$username,level_sharing_i:'1' ,source_type_s:'RSS',isWatched_b:'false',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doAdd = function () {
            $scope.sourceAddResult = $scope.sourceAdd.get({
                url_s  :          $scope.inputUrl,
                tags_ss:          $scope.inputTags,
                title_t:          $scope.inputTitle,
                domain_s:         $scope.inputDomain,
                refresh_s:        $scope.frequency.option,
                activity_s:       $scope.inputActivity
            }).$promise.then(function(){
                //Send message to update list
                sharedService.broadcast('Update');
                // Testing  Modal trigger
                var modalInstance = $modal.open({
                    templateUrl: 'addSourceModal.html',
                    controller: ModalInstanceCtrl
                });
            }, function(reason) {
                alert('Failed: ' + reason);
            });
        };



        //  modal instance

        var ModalInstanceCtrl = function ($scope, $modalInstance) {

            $scope.ok = function () {
                $modalInstance.close();//($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

    $scope.frequencies =  [
      {option:'1h'},
      {option:'12h'},
      {option:'24h'},
      {option:'48h'}
    ] ;
    $scope.frequency = $scope.frequencies[1];

    });
