'use strict';

websoApp.controller('dashboardCtrl', function($scope, $cookieStore, $resource, cfg){
	// function returns the user information stored in the cookies
	var getUserCookies = function(){
		var informations = [];
		informations[0] = $cookieStore.get('username');
		informations[1] = $cookieStore.get('userRole');
		return informations;
	};

// function that calculates the maximum number of widgets on each column
function nbWidgetsMaxInWichColumn(nbWidgets){
  var array = [], $i;
  var div = Math.floor(nbWidgets/3);
  var mod = nbWidgets % 3;
  if(mod === 0){
    for($i = 0; $i < 3; $i++)
      array[$i] = div;
  }else {
    if(mod === 1){
        array[0] = div + 1;
        array[1] = div;
        array[2] = div;
    } else {
        if(mod === 2){
          array[0] = div + 1;
          array[1] = div + 1;
          array[2] = div;
        }
    }
  }
  return array;
}

  // function who gets the user's widgets
  // and place them on the dashboard according the structure :
  // 1 line and 3 columns : each column will be sized col-md-4
	var getWidgetsUser = function(username, model){
    var widgets = [];

    // request to get informations
    $scope.informations = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

        // solr query whether the current user has on his dashboard widgets
        $scope.informations.get({user_s : username, type_s:'widget'}).$promise.then(function(widg) {
            if(widg.success.response.numFound > 0){
              var array = nbWidgetsMaxInWichColumn(widg.success.response.numFound);
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
      title: "Tableau de bord",
      structure: "4-8",
      // line 1
      rows: [{
        // column 1
        columns: [{
          styleClass: "col-md-4",
          widgets: [{
          }]
        // column 1
        },{
          styleClass: "col-md-4",
          widgets: [{
          }]
        // column 1  
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

	var userInformations = getUserCookies();
	getWidgetsUser(userInformations[0], model);
});