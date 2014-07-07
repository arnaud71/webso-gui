'use strict';

angular.module('websoApp')
  .controller('vfolderCtrl', function ($filter, $cookieStore, $scope, cfg, $resource) {

    var $username = $cookieStore.get('username');

    $scope.addResource = $resource(cfg.urlServices+'db/:action',
      {action:'put.pl',user_s:$username,callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}}
    );

    // to query solr as a search engine
    $scope.solrResource = $resource(cfg.urlDB+'solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}}
    );


    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggle = function(scope) {
      scope.toggle();
    };

    $scope.moveLastToTheBegginig = function () {
      var a = $scope.model.data.pop();
      $scope.model.data.splice(0,0, a);
    };

    $scope.newSubItem = function(scope) {
      var nodeData = scope.$modelValue;
      nodeData.nodes.push({
        id: nodeData.id * 10 + nodeData.nodes.length,
        title: nodeData.title + '.' + (nodeData.nodes.length + 1),
        nodes: []
      });
    };

    var getRootNodesScope = function() {
      return angular.element(document.getElementById("tree-root")).scope();
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
    };

    $scope.loadTree = function () {
      $scope.solrResult       = $scope.solrResource.get({
          q   : '+title_t:vfolder',
          fq  : '+type_s:tree +user_s:'+$username

        },
        function () {
          $scope.isError = false;

          if (typeof $scope.solrResult.response !== "undefined") {
            //if (typeof solrResult !== 'undefined') {
              //if ($scope.solrResult.response.numFound !== 'undefined') {
              $scope.model.data = angular.fromJson($scope.solrResult.response.docs[0].content_s);
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

    // default value


    $scope.model = {
      edit : false,
      data : [{
        "id": 1,
        "title": "dossier",
        "nodes": [
          {
            "id": 11,
            "title": "dossier.1",
            "nodes": [
              {
                "id": 111,
                "title": "dossier.1.1",
                "nodes": []
              }
            ]
          },
          {
            "id": 12,
            "title": "dossier.2",
            "nodes": []
          }
        ],
      }]
    };


    $scope.loadTree();
});