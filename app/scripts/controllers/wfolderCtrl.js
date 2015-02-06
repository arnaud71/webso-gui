'use strict';

angular.module('websoApp')
  .controller('wfolderCtrl', function ($filter, $cookieStore, $scope, cfg, $resource) {

    var $username = $cookieStore.get('username');

    $scope.addResource = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl',user_s:$username,callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}}
    );

    $scope.dbList = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',user_s:$username,callback:'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

    $scope.dbQuery = $resource(cfg.urlServices+'db/:action',
      {action:'query.pl', qt:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

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
        title_t  :  'wfolder',
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
        title_t         : 'wfolder',
        content_s       : $filter('json')($scope.model.data)
      },function () {
        var $wfolder = [];
        angular.forEach($scope.model.data, function(value1, key1) {
          // if(angular.isArray(value1)){

          $wfolder.push({"id":value1.id ,"name":value1.title});
          angular.forEach(value1.nodes, function(value2, key2){
            $wfolder.push({"id":value2.id , "name":value2.title});
            angular.forEach(value2.nodes, function(value3, key3){
              $wfolder.push({"id":value3.id, "name":value3.title});
              if(angular.isArray(value3.nodes)){
                angular.forEach(value3.nodes, function(value4, key4){
                  $wfolder.push({"id":value4.id, "name":value4.title});
                });
              }
            });
          });
        });
        $cookieStore.put('wfolder', $wfolder);
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
        type_s    : 'watch',
        user_s    : $username
      }).$promise.then(function(result) {
        if(result.error){
          $scope.isError = true;
          $scope.errorMessage = result.error;
        }
        else{
          $scope.isError = false;
          if (typeof result.success.response !== 'undefined') {
            $scope.folder = angular.fromJson(result.success.response.docs);
            angular.forEach($scope.folder, function(val, key){
              val.source_name_ss = [];
              angular.forEach(val.source_id_ss, function(v, k) {
                $scope.dbList.get({
                  type_s:'source',
                  id: v,
                  user_s:$username
                }).$promise.then(function(res){
                  if(result.error){
                    $scope.isError = true;
                    $scope.errorMessage = result.error;
                  }
                  else{
                    $scope.isError = false;
                    val.source_name_ss.push(res.success.response.docs[0].title_t);
                  }
                });
              });
            });
          }
        }
      },
      //error
      function () {
        $scope.isError = true;
      });
    };

    $scope.viewMore = function(id){
      $scope.viewDocs = true;

      $scope.dbList.get({
        id        : id,
        type_s    : 'watch',
        user_s    : $username
      }).$promise.then(function(result) {
        if(result.error){
          $scope.isError = true;
          $scope.errorMessage = result.error;
        }
        else{
          $scope.isError = false;
          if (typeof result.success.response !== 'undefined') {
            $scope.watch = angular.fromJson(result.success.response.docs);
            angular.forEach($scope.watch, function(val, key){
              val.documents = '';
              angular.forEach(val.source_id_ss, function(v, k) {
                var $fq = '';
                if(val.query_s){
                  $fq = 'content_t:'+val.query_s+ ' OR title_t:'+val.query_s;
                }
                $scope.dbQuery.get({
                  q:  'type_s:document AND source_id_ss:'+v+' AND user_s:'+$username,
                  fq: $fq
                }).$promise.then(function(res){
                  if(result.error){
                    $scope.isError = true;
                    $scope.errorMessage = result.error;
                  }
                  else{
                    $scope.isError = false;
                    $scope.test = res;
                    val.documents=res.success.response.docs;
                    // alert('type_s:document id: '+v+' user_s:'+$username);
                  }
                });
              });
            });
          }
        }
      });
    }

    $scope.resetViewMore = function(){
      $scope.viewDocs = false;
      $scope.watch = '';
    }

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