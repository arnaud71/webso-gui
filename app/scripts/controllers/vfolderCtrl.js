'use strict';

angular.module('websoApp')
  .controller('vfolderCtrl', function ($filter, $cookieStore, $scope, cfg, $resource, $modal) {

    var $username = $cookieStore.get('username');
    var $token    = $cookieStore.get('token');
    var $token_timeout = $cookieStore.get('token_timeout');
    $scope.url    = cfg.urlServices+'file/download.pl?token='+$token+'&token_timeout='+$token_timeout;

    $scope.addResource = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl',user_s:$username,callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}}
    );

    $scope.dbList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',user_s:$username,callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

    $scope.sendMail = $resource(cfg.urlServices+':action',
      {action: 'send.pl', callback:'JSON_CALLBACK', token: $token, token_timeout: $token_timeout},
      {send: {method: 'JSONP'}});


    $scope.remove = function(scope) {
      alert('Vous êtes sur le point de supprimer un dossier et tout son sontenu');
      //if(){
          //scope.remove();
      //}
    };

    $scope.toggle = function(scope) {
      if(scope.$modelValue.id === 1){
        alert('modification non autorisée');
      }
      scope.toggle();
    };

    $scope.moveLastToTheBegginig = function () {
      var a = $scope.model.data.pop();
      $scope.model.data.splice(0,0, a);
    };

    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      if(nodeData.id <= 1000){
        nodeData.nodes.push({
          id: nodeData.id * 10 + nodeData.nodes.length,
          title: nodeData.title + '.' + (nodeData.nodes.length + 1),
          nodes: []
        });
      }
      else{
        alert('Vous êtes limité à 4 niveau de dossier.');
      }
    };

    var getRootNodesScope = function() {
      return angular.element(document.getElementById('tree-root')).scope();
    };

    $scope.collapseAll = function() {
      var scope = getRootNodesScope();
      scope.collapseAll();
    };

    $scope.expandAll = function() {
      var scope = getRootNodesScope();
      scope.expandAll();
    };

    $scope.editTree = function () {
      $scope.model.edit = true;
      $scope.loadTree();
      //$('.col-lg-4').toggleClass('col-lg-5').toggleClass('col-lg-4');
      //$('.col-lg-8').toggleClass('col-lg-7').toggleClass('col-lg-8');

    };

    $scope.loadTree = function () {
      $scope.dbList.get({
        title_t  :  'vfolder',
        type_s   :  'tree',
        user_s   :  $username
      }).$promise.then(function(result) {
        $scope.isError = false;

        if (typeof result.success.response !== 'undefined') {
          //if (typeof solrResult !== 'undefined') {
            //if ($scope.solrResult.response.numFound !== 'undefined') {
            $scope.model.data = angular.fromJson(result.success.response.docs[0].content_s);
            //alert($scope.folder);
            //log($scope.solrResult.response.docs[0].content_s);
          //}
        }
      },
        //error
        function () {
          $scope.isError = true;

        });
    };

    $scope.saveTree = function () {

      $scope.sourceSaveTree = $scope.addResource.get({
        type_s          : 'tree',
        title_t         : 'vfolder',
        content_s       : $filter('json')($scope.model.data)
      },function () {
        var $vfolder = [];
        angular.forEach($scope.model.data, function(value1, key1) {
          // if(angular.isArray(value1)){

          $vfolder.push({"id":value1.id ,"name":value1.title});
          angular.forEach(value1.nodes, function(value2, key2){
            $vfolder.push({"id":value2.id , "name":value2.title});
            angular.forEach(value2.nodes, function(value3, key3){
              $vfolder.push({"id":value3.id, "name":value3.title});
              if(angular.isArray(value3.nodes)){
                angular.forEach(value3.nodes, function(value4, key4){
                  $vfolder.push({"id":value4.id, "name":value4.title});
                });
              }
            });
          });
        });
        $cookieStore.put('vfolder', $vfolder);
      },
      // error
      function(){

      });

      $scope.model.edit = false;
    };

    $scope.cancelTree = function () {
      $scope.model.edit = false;
      $scope.loadTree();
    };

    $scope.folderList = function(scope) {
      //alert('+folder_s:'+scope.$modelValue.title);
      if(scope.$modelValue.id == 1){
        scope.$modelValue.id = '*';
      }
      $scope.dbList.get({
        folder_i  : scope.$modelValue.id,
        type_s    : 'validation',
        user_s    : $username,
      }).$promise.then(function(result) {
        if(result.error){
          $scope.isError = true;
          $scope.errorMessage = result.error;
        }
        else{
          $scope.isError = false;
          if (typeof result.success.response !== 'undefined') {
            //if (typeof solrResult !== 'undefined') {
              //if ($scope.solrResult.response.numFound !== 'undefined') {
              $scope.folder = angular.fromJson(result.success.response.docs);
              //alert($scope.folder);
              //log($scope.solrResult.response.docs[0].content_s);
            //}
          }
        }
      },
      //error
      function () {
        $scope.isError = true;

      });
    };

    $scope.shareDoc = function (doc, type) {

      $scope.shareForm = {};
      if (type == 'solr') {
        $scope.shareForm.url = doc.url_s;
        $scope.shareForm.title = doc.title_t;
        $scope.shareForm.content = doc.content_t;
      }
      else if (type == 'online') {
        $scope.shareForm.url = doc.link;
        $scope.shareForm.title = doc.title;
        $scope.shareForm.content = doc.description;
      }
      $scope.shareForm.tags     = '';
      $scope.shareForm.folder   = '';
      $scope.shareForm.comment  = '';
      $scope.shareForm.mail     = '';

      var modalInstance = $modal.open({
        scope: $scope,
        templateUrl : 'views/modals/shareModal.html',
        controller  : ModalInstanceCtrl,
      });

      modalInstance.result.then(function () {
        if($scope.shareForm.mail == '' || angular.isUndefined($scope.shareForm.mail)) alert($filter('i18n')('_WRONG_MAIL_FORMAT_'));
        else{
          $scope.sendMail.send({
            token         : $token,
            token_timeout : $token_timeout,
            url_s         : $scope.shareForm.url,
            tags          : $scope.shareForm.tags,
            titre         : $scope.shareForm.title,
            // content_en    : $scope.shareForm.content,
            content       : $scope.shareForm.content,
            // content_fr    : $scope.shareForm.content,
            commentaire   : $scope.shareForm.coment,
            // folder_s      : $scope.shareForm.folder.name,
            // folder_i      : $scope.shareForm.folder.id,
            langue        : doc.lang_s,
            date          : doc.date_dt,
            mail          : $scope.shareForm.mail
          });
        }
      });
    };

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

    // default value


    $scope.model = {
      edit : false,
      data : [{
        'id': 1,
        'title': $username,
        'nodes': [
          {
            'id': 11,
            'title': 'dossier.1',
            'nodes': [
              {
                'id': 111,
                'title': 'dossier.1.1',
                'nodes': []
              }
            ]
          },
          {
            'id': 12,
            'title': 'dossier.2',
            'nodes': []
          }
        ],
      }]
    };


    $scope.loadTree();
  });