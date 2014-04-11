'use strict';

angular.module('websoApp')
    .controller('AddSourceCtrl', function ($scope,$resource,cfg, $modal,$log) {

        /*
        Globals
         */
        $scope.resultAdd = '';


        /*
         Input fields - from sourceAdd
         */
        $scope.inputUrl = '';
        $scope.inputTags = '';
        $scope.inputTitle = '';
        $scope.inputDomain = '';
        $scope.inputActivity = '';
     //   $scope.inputCreationDate = Date.now();



        $scope.sourceAdd = $resource(cfg.urlServices+':action',
            {action:'put.pl', type_s:'source',user_s:'user_0', level_sharing_i:'1' ,source_type_s:'rss',isWatched_b:'false',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doAdd = function () {
            $scope.sourceAddResult = $scope.sourceAdd.get({
                url_s  :          $scope.inputUrl,
                tags_ss:          $scope.inputTags,
                title_t:          $scope.inputTitle,
                domain_s:         $scope.inputDomain,
                refresh_s:        $scope.frequency.option,
                activity_s:       $scope.inputActivity
            });
           // var addWatch = alert('Source ajoutée');

            // Testing  Modal trigger
            var modalInstance = $modal.open({
                templateUrl: 'addSourceModal.html',
                controller: ModalInstanceCtrl
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

/*
 "url_s": "http://www.plos.org/feed/",
 "type_s": "source",
 "user_s": "user_0",
 "level_sharing_i": 1,
 "source_type_s": "rss",
 "id": "s_8e53acb2ab186c690ad1448f3fa26a75",
 "_version_": 1460213573609324500

 */

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1
