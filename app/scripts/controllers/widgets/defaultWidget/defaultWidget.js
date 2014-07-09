/* *
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
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

angular.module('sample.widgets.defaultWidget', ['adf.provider', 'highcharts-ng'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('defaultWidget', {
        title: 'Widget par defaut',
        description: 'Widget par defaut',
        controller: 'defaultWidgetCtrl',
        templateUrl: 'scripts/controllers/widgets/defaultWidget/defaultWidget.html',
        reload: true,
        resolve: {
          data: function(config){
            if (config.sourceContent){
              return config.sourceContent;
            }
          }
        },
        edit: {
          templateUrl: 'scripts/controllers/widgets/defaultWidget/edit.html',
          controller: 'defaultWidgetEditCtrl'
        }
      });
  }).controller('defaultWidgetCtrl', function($scope, data){
      var seriesData = [];
      seriesData.push([1, 2]);
      seriesData.push([10, 15]);
      seriesData.push([50, 22]);
      seriesData.push([100, 5]);
      seriesData.push([59, 29]);
      seriesData.push([45, 80]);

      seriesData.sort(function(a, b){
        return a[0] - b[0];
      });
      $scope.chartConfig = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false
        },
        title: {
          text: data
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        series: [{
          type: 'pie',
          name: data,
          data: seriesData
        }]
      };      
  }).controller('defaultWidgetEditCtrl', function($scope){
});
