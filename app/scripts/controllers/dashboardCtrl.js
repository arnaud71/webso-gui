'use strict';

websoApp.controller('dashboardCtrl', function($scope, $cookieStore, $resource, cfg){
	// fonction qui retourne les informatiosn de l'utilisateur stockées dans les cookies
	var getUserCookies = function(){
		var informations = [];
		informations[0] = $cookieStore.get('username');
		informations[1] = $cookieStore.get('userRole');
		return informations;
	};

// fonction qui calcul le nombre de widgets maximum sur chaque colonne
function nbWidgetsMaxInWichColumn(nbWidgets){
  var array = [], $i;
  // calculer la dision entiere
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

	// fonction qui renvois les widgets de l'utilisateur en cours de session
  // et les place sur le dashboard selon le format suivant :
  // 1 ligne et 3 colonnes : chaque colonne sera de taille col-md-4
	var getWidgetsUser = function(username, model){
    var widgets = [];

    // requete de renvois d'informations
    $scope.informations = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

        // Interroger Solr pour savoir si l'utilisateur en cours a des widgets sur son dashboard  
        $scope.informations.get({user_s : username, type_s:'widget'}).$promise.then(function(widg) {
            if(widg.success.response.numFound > 0){
              var array = nbWidgetsMaxInWichColumn(widg.success.response.numFound);
              var $j = 0, $i = 0, nbWidgetsCourant = 0;
                  // boucle principale s'arretant lorsque tous les widgets sont positionnés dans le dashboard
                  while($i < widg.success.response.numFound){
                    // boucle s'arretant quand tous les widgets sont positionnés dans une colonne
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
                          // ajouter le widget sur la colonne j
                          model.rows[0].columns[$j].widgets.unshift(w);
                          // incrementer le nombre de widgets courants sur la colonne courante 
                          nbWidgetsCourant++;
                          // incrementer le nombre total de widgets de 1
                          $i++;  
                      }
                    }
                    // remettre a zero le nombre de widgets courants
                    nbWidgetsCourant = 0;
                    // incrementer le nombre de colonnes de 1
                    $j++;
                  }
              }
              $scope.model = model;
		    });
  };
    var model = {
      title: "Tableau de bord",
      structure: "4-8",
      // ligne 1
      rows: [{
        // colonne 1
        columns: [{
          styleClass: "col-md-4",
          widgets: [{
          }]
        // colonne 2
        },{
          styleClass: "col-md-4",
          widgets: [{
          }]
        // colonne 3  
        },{
          styleClass: "col-md-4",
          widgets: [{
          }]
        }]
      }]
    };
    // masquer les widgets affichés par defaut
	var w;
	model.rows[0].columns[0].widgets.shift(w);
  model.rows[0].columns[1].widgets.shift(w);
  model.rows[0].columns[2].widgets.shift(w);  
	$scope.model = model;

	var userInformations = getUserCookies();
	getWidgetsUser(userInformations[0], model);
});