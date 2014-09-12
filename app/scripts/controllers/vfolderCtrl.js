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
        alert("Vous êtes sur le point de supprimer un dossier et tout son sontenu");
        //if(){
            //scope.remove();
        //}
    };

    $scope.toggle = function(scope) {
      if(scope.$modelValue.id = 1){
        alert("modification non autorisée");
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
          alert("Vous êtes limité à 4 niveau de dossier.");
      }
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
      //$(".col-lg-4").toggleClass("col-lg-5").toggleClass("col-lg-4");
      //$(".col-lg-8").toggleClass("col-lg-7").toggleClass("col-lg-8");

    };

    $scope.loadTree = function () {
      $scope.solrResult = $scope.solrResource.get({
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

    $scope.folderList = function(scope) {
      //alert('+folder_s:'+scope.$modelValue.title);
      $scope.solrResult = $scope.solrResource.get({
          q   : '+folder_s:"'+scope.$modelValue.title+'"AND+user_s:'+$username,
          //fq  : '+user_s:'+$username

        },
        function () {
          $scope.isError = false;

          if (typeof $scope.solrResult.response !== "undefined") {
            //if (typeof solrResult !== 'undefined') {
              //if ($scope.solrResult.response.numFound !== 'undefined') {
              $scope.folder = angular.fromJson($scope.solrResult.response.docs);
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

    // default value


    $scope.model = {
      edit : false,
      data : [{
        "id": 1,
        "title": $username,
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