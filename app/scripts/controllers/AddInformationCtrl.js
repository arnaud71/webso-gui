'use strict';

angular.module('websoApp')
  .controller('AddInformationCtrl', function ($cookieStore, $scope, $resource, cfg, $modal, $upload, $filter, sharedService) {

    /*
     Input fields - from sourceAdd & surveillanceAdd??
     */
    $scope.inputUrl     = ''; //$routeParameter.id_selection;
    $scope.inputTags    = '';
    $scope.inputTitle   = '';
    $scope.inputDetails = '';
    $scope.inputComments= '';
    $scope.inputFolder  = '';
    $scope.fileName     = '';
    $scope.fileHash     = '';
    $scope.inputImportance   = '';
    $scope.createFolderModal = [];
    $scope.folderArray = [];
    var error = {};

    var $username = $cookieStore.get('username');
    var $token    = $cookieStore.get('token');
    var $token_timeout = $cookieStore.get('token_timeout');

    $scope.informationAdd = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl', type_s:'validation',user_s: $username ,level_sharing_i:'1',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.dataGet = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl', callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    $scope.dataChange = $resource(cfg.urlServices+'db/:action',
      {action:'change.pl', callback:"JSON_CALLBACK"},
      {put:{method:'JSONP'},
      post:{method:'POST'}});


    $scope.doAdd = function () {
      if($scope.inputTitle == '' || $scope.inputFolder == '' || $scope.inputComments == '' || $scope.inputTags == '' || $scope.inputImportance == '') {
        alert($filter('i18n')('_ERROR_VALIDATE_ADD_'));
      }
      else{
        if($scope.fileHash){
          $scope.fileID = 'f_'+$scope.fileHash;
        }
        alert($scope.inputImportance);
        $scope.informationAddResult = $scope.informationAdd.get({
            url_s     : $scope.inputUrl,
            tags_ss   : $scope.inputTags,
            title_t   : $scope.inputTitle,
            detail_s  : $scope.inputDetails,
            comment_s : $scope.inputComments,
            folder_i  : $scope.inputFolder.id,
            folder_s  : $scope.inputFolder.name,
            file_s    : $scope.fileID,
            importance_i: $scope.inputImportance
        }).$promise.then(function(){
            //Send message to update list
            sharedService.broadcast('Update');
            var modalInstance = $modal.open({
              templateUrl: 'validateModal.html',
              controller: ModalInstanceCtrl
            });
            $scope.inputUrl     = '';
            $scope.inputTags    = '';
            $scope.inputTitle   = '';
            $scope.inputDetails = '';
            $scope.inputComments= '';
            $scope.inputFolder  = '';
            $scope.fileName     = '';
            $scope.fileHash     = '';
            $scope.inputImportance   = '';
            $scope.createFolderModal = [];
          }, function(reason) {
            alert('Failed: ' + reason);
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
          // $scope.folderArray = [];
          var tmp = JSON.parse(result.success.response.docs[0].content_s);
          var log = [];
          angular.forEach(tmp[0].nodes, function(value1, key1) {
            $scope.folders.push({"id":value1.id ,"name":value1.title});
            $scope.folderArray[value1.id]=value1.title;
            angular.forEach(value1.nodes, function(value2, key2){
              $scope.folders.push({"id":value2.id , "name":value2.title});
              $scope.folderArray[value2.id]=value2.title;
              angular.forEach(value2.nodes, function(value3, key3){
                $scope.folders.push({"id":value3.id, "name":value3.title});
                $scope.folderArray[value3.id]=value3.title;
                if(angular.isArray(value3.nodes)){
                  angular.forEach(value3.nodes, function(value4, key4){
                    $scope.folders.push({"id":value4.id, "name":value4.title});
                    $scope.folderArray[value4.id]=value4.title;
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

      var data = {
        token: $token,
        token_timeout : $token_timeout
      };

      file.upload = $upload.upload({
        // url: 'https://angular-file-upload-cors-srv.appspot.com/upload' + $scope.getReqParams(),
        url: cfg.urlServices+'file/file_upload.pl',
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
            $scope.fileName = response.data.name;
            $scope.fileHash = response.data.hash;
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

    $scope.createFolder = function(){
      var modalInstance = $modal.open({
        scope: $scope,
        templateUrl : 'createFolderModal.html',
        controller  : ModalInstanceCtrl,
      });

      modalInstance.result.then(function () {
        if(angular.isUndefined($scope.createFolderModal.folderName) || ($scope.createFolderModal.folderName == '') || angular.isUndefined($scope.createFolderModal.parentFolder) || ($scope.createFolderModal.parentFolder == '')) alert($filter('i18n')('_WRONG_MAIL_FORMAT_'));
        else{
          var $folderID = 0;
          if($scope.createFolderModal.parentFolder >= 1000){
            alert('Vous êtes limité à 4 niveau de dossier.');
          }
          else{
            $folderID = $scope.createFolderModal.parentFolder*10+1

            while(angular.isDefined($scope.folderArray[$folderID])){
              $folderID++;
            }
            alert($folderID);
          }

          $scope.dataGet.get({
            user_s:$username,
            type_s:'tree',
            title_t:'vfolder'
          }).$promise.then(function(res){
            // alert(res.success.response.docs[0].content_s);
            // alert($scope.createFolderModal.parentFolder);
            var folder = angular.fromJson(res.success.response.docs[0].content_s);
            // alert(folder);

          })
          // $scope.sendMail.send({
          //   token         : $token,
          //   token_timeout : $token_timeout,
          //   url_s         : $scope.shareForm.url,
          //   tags          : $scope.shareForm.tags,
          //   titre         : $scope.shareForm.title,
          //   // content_en    : $scope.shareForm.content,
          //   content       : $scope.shareForm.content,
          //   // content_fr    : $scope.shareForm.content,
          //   commentaire   : $scope.shareForm.coment,
          //   // folder_s      : $scope.shareForm.folder.name,
          //   // folder_i      : $scope.shareForm.folder.id,
          //   langue        : doc.lang_s,
          //   date          : doc.date_dt,
          //   mail          : $scope.shareForm.mail
          // });
        }
      });
      $scope.doSearchFolder();
    }

    //  ***************************************
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
