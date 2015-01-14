'use strict';

websoApp.controller('dashboardCtrl', function($scope, $cookieStore, $resource, serviceWidgets, cfg, $filter){
  // function who gets the user's widgets
  // and place them on the dashboard according the structure :
  // 1 line and 3 columns : each column will be sized col-md-4
  var getWidgetsUser = function(username, model){
    var widgets = [];

    // request to get informations
    // $scope.solr = $resource(cfg.urlDB+'solr/collection1/:action',
    //   {action:'browse', q:'user_s:'+username, fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
    //   {get:{method:'JSONP'}});
    $scope.solr = $resource(cfg.urlServices+'db/:action',
      {action:'query.pl', qt:'browse', q:'user_s:'+username, fq:'', wt:'json' , hl:'true' , start:'0', 'indent':'true','json.wrf':'JSON_CALLBACK'},
      {get:{method:'JSONP'}});

        // solr query whether the current user has on his dashboard widgets
        $scope.solr.get({sort:'date_dt desc', rows:100, fq:'type_s:widget'}).$promise.then(function(widg) {
            if(widg.success.response.numFound > 0){
              var array = serviceWidgets.getNbWidgetsMaxInWichColumn(widg.success.response.numFound);
              var $j = 0, $i = 0, nbWidgetsCourant = 0;
                  // main loop stops when all the widgets are positioned in the dashboard
                  while($i < widg.success.response.numFound){
                    // main loop stops when all the widgets are positioned in one column
                    while(nbWidgetsCourant < array[$j]){
                      var conf = {};
                      widgets[$i] = widg.success.response.docs[$i].widget_type_s;
                      conf['content'] = widg.success.response.docs[$i].query_s;
                      w = {
                        title: widg.success.response.docs[$i].title_t,
                        type: widgets[$i],
                        id: widg.success.response.docs[$i].id,
                        config: conf
                      };
                      if(widg.success.response.docs[$i]){
                          // add the widget to the column j
                          model.rows[0].columns[$j].widgets.unshift(w);
                          // increment the number of widgets on the current column 
                          nbWidgetsCourant++;
                          // increment the total number of widgets of 1
                          $i++;  
                      }
                    }
                    // reset to zero the number of widgets
                    nbWidgetsCourant = 0;
                    // increment the number of columns of 1
                    $j++;
                  }
              }
              $scope.model = model;
        });
    };

    var model = {
      title: $filter('i18n')('_DASHBOARD_'),
      structure: "4-8",
      // line 1
      rows: [{
        // column 1
        columns: [{
          styleClass: "col-md-4",
          widgets: [{
          }]
        // column 2
        },{
          styleClass: "col-md-4",
          widgets: [{
          }]
        // column 3
        },{
          styleClass: "col-md-4",
          widgets: [{
          }]
        }]
      }]
    };

    // hide widgets displayed by default
  var w;
  model.rows[0].columns[0].widgets.shift(w);
    model.rows[0].columns[1].widgets.shift(w);
    model.rows[0].columns[2].widgets.shift(w);  
  $scope.model = model;

  var userInformations = serviceWidgets.getUserIdents();
  getWidgetsUser(userInformations[0], model);
});