'use strict';

angular.module('websoApp')
    .controller('AddInformationCtrl', function ($cookieStore, $scope,$resource,cfg, $modal) {

        /*
         Input fields - from sourceAdd & surveillanceAdd??
         */
        $scope.inputUrl     = '';
        $scope.inputTags    = '';
        $scope.inputTitle   = '';
        $scope.inputDetails = '';
        var $username = $cookieStore.get('username');      

        $scope.informationAdd = $resource(cfg.urlServices+'db/:action',
            {action:'put.pl', type_s:'validation',user_s: $username ,level_sharing_i:'1',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doAdd = function () {
            $scope.informationAddResult = $scope.informationAdd.get({
                url_s  :     $scope.inputUrl,
                tags_s : $scope.inputTags,
                title_t: $scope.inputTitle,
                details_s: $scope.inputDetails

            });
         //   var addInfo = alert('Information ajoutée');

            // Testing  Modal trigger
            var modalInstance = $modal.open({
                templateUrl: 'validateModal.html',
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

    });

/*

 angular.module('websoApp')
 .controller('addInfoCtrl', function ($scope,$resource) {

 //  $scope.inputType    = 'rss';
 $scope.inputLevel   = 0;
 // $scope.inputUser    = 'user_1';
 $scope.inputUrl     ='';
 $scope.inputTitle   = '';
 $scope.inputDetail = '';
 $scope.inputComment= '';
 $scope.inputRefresh = 1440; // per day


 $scope.informationAdd = $resource('http://albator.hesge.ch/cgi-bin/webso/sources/:action',
 {action:'put_Information.json', source_user:'user_2' ,information_url:'',information_type:'information',information_title:'',information_detail:'',information_comment:'',information_level_sharing:'0',callback:"JSON_CALLBACK"},
 {get:{method:'JSONP'}});

 $scope.doAdd = function () {

 $scope.informationAddResult = $scope.informationAdd.get({

 information_url:     $scope.inputUrl,
 information_type:    $scope.inputType,
 //information_user:    $scope.inputUser,
 information_level_sharing:   $scope.inputLevel,
 information_title:   $scope.inputTitle,
 information_detail:   $scope.inputDetail,
 information_comment:   $scope.inputComment
 });
 };




 });

 */

//http://albator.hesge.ch/cgi-bin/webso/sources/get.json?&source_user=user_1
