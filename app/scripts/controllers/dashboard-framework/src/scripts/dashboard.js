/*
 * The MIT License
 * 
 * Copyright (c) 2013, Sebastian Sdorra
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @ngdoc directive
 * @name adf.directive:adfDashboard
 * @element div
 * @restrict ECA
 * @scope
 * @description
 * 
 * `adfDashboard` is a directive which renders the dashboard with all its 
 * components. The directive requires a name attribute. The name of the
 * dashboard can be used to store the model.
 */

'use strict';

angular.module('adf')
  .directive('adfDashboard', function($rootScope, $log, $modal, $cookieStore, $resource, dashboard, cfg){

 function giveTitleToWidget(widget){
    var title;
    switch (widget) {
        case 'affichageCollectesMultisources':
            title = 'Collectes multisources';
            break;
        case 'affichageDossiersSurveillance':
            title = 'Dossiers de surveillances';
            break;
        case 'affichageDossiersValidation':
            title = 'Dossiers de validation';
            break;
        case 'affichageFluxTwitter':
            title = 'Flux twitter';
            break;
        case 'affichageSource':
            title = 'Sources';
            break;
        case 'affichageSurveillance':
            title = 'Surveillances';
            break;
    }
    return title;
 };

 function giveIdToWidget(widgets){
  if(widgets.length === 0){
    return 1;
  }else{
    return parseInt(widgets[widgets.length - 1].id) + 1;
  }
 };
  
  function getUserCookies(){
    var informations = [];
    informations[0] = $cookieStore.get('username');
    informations[1] = $cookieStore.get('userRole');
    return informations;
  };

  function addWidgetToSolr(widgetName, widgetTitle, isEnable, widgetWeight, userWidgetId, widgetId){
        $rootScope.widgetAdd = $resource(cfg.urlServices+'db/:action',
          {action:'put.pl', type_s:'widget', callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});

        $rootScope.widgetAdd.get({
            widgetName_s  : widgetName,
            widgetTitle_s  : widgetTitle,
            widgetEnable_s : isEnable,
            widgetWeight_s : widgetWeight,
            userWidgetId_s : userWidgetId,
            widgetId_s : widgetId
        })
  };

    function copyWidgets(source, target){
      if ( source.widgets && source.widgets.length > 0 ){
        var w = source.widgets.shift();
        while (w){
          target.widgets.push(w);
          w = source.widgets.shift();
        }
      }
    }

    function fillStructure(model, columns, counter){
      angular.forEach(model.rows, function(row){
        angular.forEach(row.columns, function(column){
          if (!column.widgets){
            column.widgets = [];
          }
          if ( columns[counter] ){
            copyWidgets(columns[counter], column);
            counter++;
          }
        });
      });
      return counter;
    }
    
    function readColumns(model){
      var columns = [];
      angular.forEach(model.rows, function(row){
        angular.forEach(row.columns, function(col){
          columns.push(col);
        });
      });
      return columns;
    }
            
    function changeStructure(model, structure){
      var columns = readColumns(model);
      model.rows = structure.rows;
      var counter = 0;
      while ( counter < columns.length ){
        counter = fillStructure(model, columns, counter);
      }
    }
    
    function createConfiguration(type){
      var cfg = {};
      var config = dashboard.widgets[type].config;
      if (config){
        cfg = angular.copy(config);
      }
      return cfg;
    }

    return {
      replace: true,
      restrict: 'EA',
      transclude : false,
      scope: {
        structure: '@',
        name: '@',
        collapsible: '@',
        adfModel: '='
      },
      controller: function($scope){
        // sortable options for drag and drop
        $scope.sortableOptions = {
          connectWith: ".column",
          handle: ".fa-arrows",
          cursor: 'move',
          tolerance: 'pointer',
          placeholder: 'placeholder',
          forcePlaceholderSize: true,
          opacity: 0.4
        };
        
        var name = $scope.name;
        var model = $scope.adfModel;
        if ( ! model || ! model.rows ){
          var structureName = $scope.structure;
          var structure = dashboard.structures[structureName];
          if (structure){
            if (model){
              model.rows = angular.copy(structure).rows;
            } else {
              model = angular.copy(structure);
            }
            model.structure = structureName;
          } else {
            $log.error( 'could not find structure ' + structureName);
          }
        } 
        
        if (model) {
          if (!model.title){
            model.title = 'Dashboard';
          }
          $scope.model = model;
        } else {
          $log.error('could not find or create model');
        }

        // edit mode
        $scope.editMode = false;
        $scope.editClass = "";

        $scope.toggleEditMode = function(){
          $scope.editMode = ! $scope.editMode;
          if ($scope.editClass === ""){
            $scope.editClass = "edit";
          } else {
            $scope.editClass = "";
          }
          if (!$scope.editMode){
            $rootScope.$broadcast('adfDashboardChanged', name, model);
          }
        };
        
        // edit dashboard settings
        $scope.editDashboardDialog = function(){
          var editDashboardScope = $scope.$new();
          editDashboardScope.structures = dashboard.structures;
          var instance = $modal.open({
            scope: editDashboardScope,
            templateUrl: 'scripts/controllers/dashboard-framework/src/templates/dashboard-edit.html'
          });
          $scope.changeStructure = function(name, structure){
            $log.info('change structure to ' + name);
            changeStructure(model, structure);
          };
          editDashboardScope.closeDialog = function(){
            instance.close();
            editDashboardScope.$destroy();
          };
        };

        // add widget dialog
        $scope.addWidgetDialog = function(){
          var userInformations = getUserCookies();          
          var userId, widgetName;
          $scope.informations = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});
          // Interroger Solr pour avoir l'identifiant de l'utilisateur en cours de session       
          $scope.informations.get({user_s : userInformations[0], type_s:'user'}).$promise.then(function(user) {
                userId = user.success.response.docs[0].id;
            // Interroger Solr pour savoir si l'utilisateur en cours a des widgets sur son dashboard  
            $scope.informations.get({userWidgetId_s : userId, type_s:'widget'}).$promise.then(function(widg) { 
                var addScope = $scope.$new();
                addScope.widgets = dashboard.widgets;
                var opts = {
                  scope: addScope,
                  templateUrl: 'scripts/controllers/dashboard-framework/src/templates/widget-add.html'
                };
                var instance = $modal.open(opts);
                addScope.addWidget = function(widget){
                if(widg.success.response.docs.length >= 10){
                  alert('nombre de widgets maximum atteint');
                }else{
                var widgetId;
                  var w = {
                    id: giveIdToWidget(widg.success.response.docs),
                    type: widget,
                    config: createConfiguration(widget)
                  };
                  // ajout du widget au dashboard
                  addScope.model.rows[0].columns[0].widgets.unshift(w);
                  // id du widget
                  widgetId = addScope.model.rows[0].columns[0].widgets[0].id;
                  // titre du widget
                  widgetName = giveTitleToWidget(widget); 
                  // ajout du widget a la base Solr
                  addWidgetToSolr(widget, widgetName, true, 1, userId, widgetId);
                }
                  // fermeture du la fenetre modal
                  instance.close();
                  addScope.$destroy();
                };
                addScope.closeDialog = function(){
                  instance.close();
                  addScope.$destroy();
                };
          });
        });
      };
    },
      link: function ($scope, $element, $attr) {
        // pass attributes to scope
        $scope.name = $attr.name;
        $scope.structure = $attr.structure;
      },
      templateUrl: 'scripts/controllers/dashboard-framework/src/templates/dashboard.html'
    };
  });