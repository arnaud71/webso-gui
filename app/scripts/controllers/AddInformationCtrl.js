'use strict';

angular.module('websoApp')
    .controller('AddInformationCtrl', function ($cookieStore, $scope, $resource, cfg, $modal) {

        /*
         Input fields - from sourceAdd & surveillanceAdd??
         */
        $scope.inputUrl     = ''; //$routeParameter.id_selection;
        $scope.inputTags    = '';
        $scope.inputTitle   = '';
        $scope.inputDetails = '';
        $scope.inputComments= '';
        $scope.inputFolder  = '';

        var $username = $cookieStore.get('username');      

        $scope.informationAdd = $resource(cfg.urlServices+'db/:action',
            {action:'put.pl', type_s:'validation',user_s: $username ,level_sharing_i:'1',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});

        $scope.doAdd = function () {
            $scope.informationAddResult = $scope.informationAdd.get({
                url_s  :      $scope.inputUrl,
                tags_s :      $scope.inputTags,
                title_t:      $scope.inputTitle,
                details_s:    $scope.inputDetails,
                //comments_s:   $scope.inputComments,
                folder_s:    $scope.inputFolder

            });
         //   var addInfo = alert('Information ajoutée');

            // Testing  Modal trigger
            var modalInstance = $modal.open({
                templateUrl: 'validateModal.html',
                controller: ModalInstanceCtrl
            });
        };
        $scope.validationOk = false;
        //if()

        //  modal instance

        var ModalInstanceCtrl = function ($scope, $modalInstance) {

            $scope.ok = function () {
                $modalInstance.close();//($scope.selected.item);
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        $scope.dbList = $resource(cfg.urlServices+'db/:action',
          {action:'get.pl',user_s:$username,callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});

        // ***************************************************************
        // doSearchFolder
        // list the available sources
        $scope.doSearchFolder = function () {
          $scope.isError = false;

          $scope.dbList.get({
                          type_s      : 'tree',
                          title_t     : 'vfolder',
                          user_s      : $username,
            }).$promise.then(function(result) {

              $scope.folders = [];
              var tmp = JSON.parse(result.success.response.docs[0].content_s);
              var log = [];
              angular.forEach(tmp[0].nodes, function(value1, key1) {
                // if(angular.isArray(value1)){

                $scope.folders.push({"id":value1.id ,"name":value1.title});
                angular.forEach(value1.nodes, function(value2, key2){
                  $scope.folders.push({"id":value2.id , "name":value2.title});
                  angular.forEach(value2.nodes, function(value3, key3){
                    $scope.folders.push({"id":value3.id, "name":value3.title});
                    if(angular.isArray(value3.nodes)){
                      angular.forEach(value3.nodes, function(value4, key4){
                        $scope.folders.push({"id":value4.id, "name":value4.title});
                      }, log);
                    }
                  }, log);
                }, log);
              }, log);
              //$scope.folders = JSON.parse(result.success.response.docs[0].content_s);
              //$scope.folder = $scope.folders[1];

            }, function(reason) {
              alert('Failed: ' + reason);
            });
        };
        $scope.doSearchFolder();

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
