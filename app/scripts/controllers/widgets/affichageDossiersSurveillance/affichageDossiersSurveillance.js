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

angular.module('sample.widgets.affichageDossiersSurveillance', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('affichageDossiersSurveillance', {
        title: 'Dossiers de surveillances',
        description: 'Dossiers de surveillances',
        controller: 'dossierSurveillanceCtrl',
        templateUrl: 'scripts/controllers/widgets/affichageDossiersSurveillance/affichageDossiersSurveillance.html',
        reload: true,
        edit: {
          templateUrl: 'scripts/controllers/widgets/affichageDossiersSurveillance/edit.html',
          controller: 'dossierSurveillanceEditCtrl'
        }
      });
  }).controller('dossierSurveillanceCtrl', function($scope, $resource, cfg, serviceWidgets){

  var currentUsername = serviceWidgets.getUserIdents();

    $scope.solr = $resource(cfg.urlDB+'solr/collection1/:action',
      {action:'browse', q:'', fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

      $scope.solrResult       = $scope.solr.get({sort:'updating_dt desc', rows:5, q:'user_s:' + currentUsername[0],fq:'type_s:watch'});
  }).controller('dossierSurveillanceEditCtrl', function($scope){
  });