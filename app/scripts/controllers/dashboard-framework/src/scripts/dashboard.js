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
  .directive('adfDashboard', function($rootScope, $log, $modal, $cookieStore, $resource, dashboard, serviceWidgets, cfg){

  // add a widget to Solr
  function addWidgetToSolr(widgetType, widgetTitle, isEnable, widgetWeight, userWidget, addScope){
        $rootScope.widgetAdd = $resource(cfg.urlServices+'db/:action',
          {action:'put.pl', type_s:'widget', callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});

        $rootScope.widgetAdd.get({
            widget_type_s  : widgetType,
            title_t        : widgetTitle,
            enable_s       : isEnable,
            weight_s       : widgetWeight,
            user_s          : userWidget,
            param_s         : '',
            query_s         : ''
        }).$promise.then(function(widg){
          if(widg.success){
            var w = {
                id: widg.id,
                type: widgetType,
                config: widg.query_s,
                param: widg.param_s
            };
            // $rootScope.solr = $resource(cfg.urlDB+'solr/collection1/:action',
            //   {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
            //   {get:{method:'JSONP'}});
            $rootScope.solr = $resource(cfg.urlServices+'db/:action',
              {action:'query.pl', qt:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
              {get:{method:'JSONP'}});

            $rootScope.solr.get({q:'type_s:widget'}).$promise.then(function(widg) {
              // add the widget to the front-end dashboard
              var array = serviceWidgets.getNbWidgetsMaxInWichColumn(widg.success.response.numFound - 1);
              if(array[0] === array[1] && array[0] === array[2]){
                addScope.model.rows[0].columns[0].widgets.unshift(w);
              }else{
                if(array[0] !== array[1] && array[1] === array[2]){
                  addScope.model.rows[0].columns[1].widgets.unshift(w);
                }else{
                    if(array[0] === array[1] && array[1] !== array[2]){
                      addScope.model.rows[0].columns[2].widgets.unshift(w); 
                    }
                }
              }
            });
          }
        });
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
    
    // change dashboard's structure
    function changeStructure(model, structure){
      var columns = readColumns(model);
      model.rows = structure.rows;
      var counter = 0;
      while ( counter < columns.length ){
        counter = fillStructure(model, columns, counter);
      }
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
        $scope.editMode = true;
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

        // delete all widgets
        $scope.closeAll = function(){
          var userInformations = serviceWidgets.getUserIdents();          
          var editDashboardScope = $scope.$new();
          editDashboardScope.widgets = dashboard.widgets;
          var opts = {
            scope: editDashboardScope,
            templateUrl: 'scripts/controllers/dashboard-framework/src/templates/dashboard-delete-all-widgets.html'
          };

          var widgetsNotExist = {
            scope: editDashboardScope,
            templateUrl: 'scripts/controllers/dashboard-framework/src/templates/widgets-not-exist.html'
          };

          var instance;
          
          $scope.informations = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});
            // Request to Solr to know if the current user have some widgets on his dashboard
            // and add the widget
            $scope.informations.get({user_s : userInformations[0], type_s:'widget'}).$promise.then(function(widg) {
              if(widg.success.response.docs.length > 0){
                instance = $modal.open(opts);

                editDashboardScope.valideDialog = function() {
                  editDashboardScope.closeDialog();
                  $scope.widgetsDelete = $resource(cfg.urlServices+'db/:action',
                            {action:'delete.pl', callback:"JSON_CALLBACK"},
                            {get:{method:'JSONP'}});
                  $scope.widgetsDeleteResult = $scope.widgetsDelete.get({
                    type_s:'widget', 
                    user_s:userInformations[0]
                  });
                  window.location.reload();
                };

              }else{
                instance = $modal.open(widgetsNotExist);
              }
            });

          editDashboardScope.closeDialog = function(){
            instance.close();
            editDashboardScope.$destroy();          
          }
        };

        // add widget dialog
        $scope.addWidgetDialog = function(){
          var addScope = $scope.$new();
          addScope.widgets = dashboard.widgets;
          var opts = {
            scope: addScope,
            templateUrl: 'scripts/controllers/dashboard-framework/src/templates/widget-add.html'
          };

          var instance = $modal.open(opts);

          addScope.addWidget = function(widget){
            var userInformations = serviceWidgets.getUserIdents(), widgetTitle, array, w;
            // close the modal frame
            addScope.closeDialog();
            // widget's title
            widgetTitle = serviceWidgets.getTitleWidget(widget);
            // add the widget to Solr
            addWidgetToSolr(widget, widgetTitle, true, 1, userInformations[0], addScope);
          };

          addScope.closeDialog = function(){
            instance.close();
            addScope.$destroy();
          };
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