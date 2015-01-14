'use strict';

angular.module('websoApp')
    .controller('AddInformationCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $upload, $filter) {

        /*
         Input fields - from sourceAdd & surveillanceAdd??
         */
        $scope.inputUrl     = ''; //$routeParameter.id_selection;
        $scope.inputTags    = '';
        $scope.inputTitle   = '';
        $scope.inputDetails = '';
        $scope.inputComments= '';
        $scope.inputFolder  = '';
        var error = {};

        var $username = $cookieStore.get('username');      

        $scope.informationAdd = $resource(cfg.urlServices+'db/:action',
            {action:'put.pl', type_s:'validation',user_s: $username ,level_sharing_i:'1',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});


        $scope.doAdd = function () {
          if($scope.inputTitle == '' || $scope.inputFolder == '' || $scope.inputComments == '') {
            alert($filter('i18n')('_ERROR_VALIDATE_ADD_'));
          }
          else{
            $scope.informationAddResult = $scope.informationAdd.get({
                url_s     : $scope.inputUrl,
                tags_s    : $scope.inputTags,
                title_t   : $scope.inputTitle,
                detail_s  : $scope.inputDetails,
                comment_s : $scope.inputComments,
                folder_i  : $scope.inputFolder.id,
                folder_s  : $scope.inputFolder.name,
            });
            // var addInfo = alert('Information ajoutée');

            // Testing  Modal trigger
            var modalInstance = $modal.open({
                templateUrl: 'validateModal.html',
                controller: ModalInstanceCtrl
            });
          }
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

        // $scope.onFileSelect = function($files) {
        //   //$files: an array of files selected, each file has name, size, and type.
        //   for (var i = 0; i < $files.length; i++) {
        //     var file = $files[i];
        //     $scope.upload = $upload.upload({
        //       //url: cfg.urlServices+'file/upload-test1.py',
        //       url: cfg.urlServices+'file/file_upload.pl', //upload.php script, node.js route, or servlet url
        //       //method: 'POST' or 'PUT',
        //       method: 'POST',
        //       headers: {'Access-Control-Request-Method': 'PUT, POST, OPTIONS'},
        //       //withCredentials: true,
        //       data: {myObj: $scope.myModelObj},
        //       file: file, // or list of files ($files) for html5 only
        //       //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
        //       // customize file formData name ('Content-Disposition'), server side file variable name. 
        //       //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
        //       // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
        //       //formDataAppender: function(formData, key, val){}
        //     }).progress(function(evt) {
        //       console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        //     }).success(function(data, status, headers, config) {
        //       // file is uploaded successfully
        //       console.log(data);
        //     });
        //     //.error(...)
        //     //.then(success, error, progress); 
        //     // access or attach event listeners to the underlying XMLHttpRequest.
        //     //.xhr(function(xhr){xhr.upload.addEventListener(...)})
        //   }
        //   /* alternative way of uploading, send the file binary with the file's content-type.
        //      Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
        //      It could also be used to monitor the progress of a normal http post/put request with large data*/
        //   // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
        // };
$scope.onFileSelect = function(file) {
        $scope.errorMsg = '';
        $scope.successMsg = '';
        $scope.file='';
        file.progress = '';

        var data = $scope.formUpload ? {
          username: $scope.username
        } : {};

        file.upload = $upload.upload({
          // url: 'https://angular-file-upload-cors-srv.appspot.com/upload' + $scope.getReqParams(),
          url: cfg.urlServices+'file/file_upload_2.pl',
          // url: cfg.urlServices+'file/file_upload.pl',
          method: 'POST',
          headers: {
            'Access-Control-Request-Method': 'PUT, POST, OPTIONS'
          },
          data: data,
          file: file,
          fileFormDataName: 'myFile',
        });

        file.upload.then(function(response) {
          // $timeout(function() {
            // file.result = response.data;
            if(response.data.error){
              $scope.errorMsg = response.data.error;
            }
            else if(response.data.success){
              $scope.successMsg = response.data.success;
            }
          // });
        }, function(response) {
          // if (response.status > 0)
          //   $scope.errorMsg = response.status + ': ' + response.data;
          // else
          // $scope.errorMsg = response;
        });

        file.upload.progress(function(evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          $scope.progress=file.progress;
        });

        file.upload.xhr(function(xhr) {
          // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
        $scope.file = file;
}
    });
