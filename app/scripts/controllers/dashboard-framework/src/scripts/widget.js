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

'use strict';

angular.module('adf')
  .directive('adfWidget', function($log, $modal, $rootScope, $resource, cfg, dashboard, serviceWidgets) {

  	// modify a widget's informations
    function modifyWidget(title, ident, widgetContent, isEnable){
        $rootScope.widgetModify = $resource(cfg.urlServices+'db/:action',
          {action:'update.pl', id:'', type_s:'widget', callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});

        $rootScope.widgetModify.get({
        	title_t 		: title,
        	id 				: ident, 
        	query_s 		: widgetContent,
        	enable_s 		: isEnable
        });
    };

    function preLink($scope, $element, $attr){
      var definition = $scope.definition;
      if (definition) {
        var w = dashboard.widgets[definition.type];
        if (w) {
          // pass title
          if (!definition.title && !definition.content){
            definition.title = w.title;
            definition.content = w.content;
          }
          // pass edit mode
          $scope.editMode = $attr.editMode;

          // pass copy of widget to scope
          $scope.widget = angular.copy(w);

          // create config object
          var config = definition.config;
          if (config) {
            if (angular.isString(config)) {
              config = angular.fromJson(config);
            }
          } else {
            config = {};
          }
          // pass config to scope
          $scope.config = config;
          // get a widget's state (activated ou desactivated)
          $scope.informations = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});
          	// set the widget's state in front-end
            $scope.informations.get({id : definition.id, type_s:'widget'}).$promise.then(function(widg) {
              if(widg.success.response.numFound > 0){
                var isCollapsed;
                if(widg.success.response.docs[0].enable_s === "true"){
                  isCollapsed = false;
                }else{
                  isCollapsed = true;
                }
                $scope.isCollapsed = isCollapsed;
              }else{
                $scope.isCollapsed = false;
              }
            });
        } else {
          $log.warn('could not find widget ' + type);
        }
      } else {
        $log.debug('definition not specified, widget was probably removed');
      }
    }
    
    function postLink($scope, $element, $attr) {
      var definition = $scope.definition;
      if (definition) {
        // bind close function
        $scope.close = function() {
          var editScope = $scope.$new();
          
          var opts = {
            scope: editScope,
            templateUrl: 'scripts/controllers/dashboard-framework/src/templates/widget-delete.html'
          };
          var instance = $modal.open(opts);

          editScope.valideDialog = function() {
			instance.close();
			editScope.$destroy();
			var column = $scope.col;
	          if (column) {
	            var index = column.widgets.indexOf(definition);
	            var widgetId = column.widgets[index].id;
	            // delete the corresponding widget
	            $scope.widgetDelete = $resource(cfg.urlServices+'db/:action',
	              {action:'delete.pl', id:'',callback:"JSON_CALLBACK"},
	              {get:{method:'JSONP'}});
					$scope.widgetDeleteResult = $scope.widgetDelete.get({
					  id  : widgetId
					});

					if (index >= 0) {
					column.widgets.splice(index, 1);
					}
					$element.remove();
	          }
          };

          editScope.closeDialog = function(){
            instance.close();
            editScope.$destroy();            
          }
        };
        
        // bind reload function
        $scope.reload = function(){
          $scope.$broadcast('widgetReload');
        };

        // bind edit function
        $scope.edit = function() {
          var editScope = $scope.$new();
          
          var opts = {
            scope: editScope,
            templateUrl: 'scripts/controllers/dashboard-framework/src/templates/widget-edit.html'
          };

          var instance = $modal.open(opts);
          editScope.valideDialog = function() {
            var definition = $scope.definition;
            if (definition) {
              var column = $scope.col;
              if (column) {
                var index = column.widgets.indexOf(definition);
                var widgetId = column.widgets[index].id;            
              }
            }
            
            instance.close();
            editScope.$destroy();
            
            var widget = $scope.widget;
            if (widget.edit && widget.edit.reload){
              // reload content after edit dialog is closed
              $scope.$broadcast('widgetConfigChanged');
            }
            // load the widget's modifications in Solr
            modifyWidget(definition.title, widgetId, definition.config.content, true);

          };
          editScope.closeDialog = function(){
            instance.close();
            editScope.$destroy();            
          }
        };
        // activate a widget
        $scope.activateWidget = function() {
			modifyWidget(definition.title, definition.id, definition.config.content, $scope.isCollapsed);
			$scope.isCollapsed = false;
        };
        // desactivate a widget
        $scope.desactivateWidget = function() {
			modifyWidget(definition.title, definition.id, definition.config.content, $scope.isCollapsed);
			$scope.isCollapsed = true;
		};

      } else {
        $log.debug('widget not found');
      }
    }

    return {
      replace: true,
      restrict: 'EA',
      transclude: false,
      templateUrl: 'scripts/controllers/dashboard-framework/src/templates/widget.html',
      scope: {
        definition: '=',
        col: '=column',
        editMode: '@',
        collapsible: '='
      },
      compile: function compile($element, $attr, transclude) {
        
        /**
         * use pre link, because link of widget-content
         * is executed before post link widget
         */ 
        return {
          pre: preLink,
          post: postLink
        };
      }
    };

  });