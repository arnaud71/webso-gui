'use strict';

websoApp.controller('DashboardViewCtrl', function ($scope, $cookieStore, $modal, $resource, serviceDashboard, cfg) {
/***************************************************************************************************************/  

  // fonction qui mis a jours le contenu du dashboard associe a l'utilisateur en cours
  var setDashboardInformations = function(username){
    var userId, widgets = [];
    // requete de renvois d'informations
    $scope.informations = $resource(cfg.urlServices+'db/:action',
      {action:'get.pl',callback:"JSON_CALLBACK"},
      {get:{method:'JSONP'}});

    // Interroger Solr pour avoir l'identifiant de l'utilisateur en cours de session       
    $scope.informations.get({user_s : username, type_s:'user'}).$promise.then(function(user) {
        userId = user.success.response.docs[0].id;
        // Interroger Solr pour savoir si l'utilisateur en cours a des widgets sur son dashboard  
        $scope.informations.get({userWidgetId_s : userId, type_s:'widget'}).$promise.then(function(user) {
            if(user.success.response.numFound > 0){
                // afficher le dashboard avec les widgets ajoutes
                serviceDashboard.setBooleanHaveWidgetOnDash(true);
                serviceDashboard.setBooleanNotHaveWidgetOnDash(false);
                var $i = 0;
                while($i < user.success.response.numFound){
                  widgets[$i] = user.success.response.docs[$i].widgetName_s;
                  $i++;
                }
                $scope.widgets = widgets;
            }else{
                // afficher le dashboard sans les widgets mais avec un bouton d'ajout de widgets
                serviceDashboard.setBooleanHaveWidgetOnDash(false);
                serviceDashboard.setBooleanNotHaveWidgetOnDash(true);                
            }
            $scope.dashboardTitle = 'Tableau de bord';
            $scope.haveElements = serviceDashboard.haveWidgetOnDash();
            $scope.notHaveElements = serviceDashboard.notHaveWidgetsOnDash();        
        });
    });
  };

/****************************************************************************************************************/  

  // fonction qui retourne les informatiosn de l'utilisateur stockées dans les cookies
  var getUserCookies = function(){
    var informations = [];
    informations[0] = $cookieStore.get('username');
    informations[1] = $cookieStore.get('userRole');
    return informations;
  };

/****************************************************************************************************************/  

  // fonction qui ajoute un widget a la base solr 
  var addWidget = function(widgetName, isEnable, widgetWeight, userWidgetId){
      $scope.widgetAdd = $resource(cfg.urlServices+'db/:action',
          {action:'put.pl', type_s:'widget', callback:"JSON_CALLBACK"},
          {get:{method:'JSONP'}});
        $scope.widgetAddResult = $scope.widgetAdd.get({
            widgetName_s  : widgetName,
            widgetEnable_s : isEnable,
            widgetWeight_s : widgetWeight,
            userWidgetId_s : userWidgetId
        });
  };

  // renvoyer des informations de l'utilisateur en cours de session
  var userInformations = getUserCookies();
  // mise à jours des informations du service dashboard
  setDashboardInformations(userInformations[0]);

/****************************************************************************************************************/  

  // affichage de la fenetre modal pour selectionner des éléments
    $scope.addElements = function () {
      var modalInstance = $modal.open({
        templateUrl: 'validateModal.html',
        controller: ModalInstanceCtrl
      });
    };

    //  Instance du modal
    var ModalInstanceCtrl = function ($scope, $modalInstance, serviceDashboard) {
    var identUser;
      $scope.elements = [
        {id : 1, text : 'Affichage d\'une source'},
        {id : 2, text : 'Affichage d\'une surveillance'},
        {id : 3, text : 'Affichage d\'un dossier de surveillance'},
        {id : 4, text : 'Affichage d\'un flux twitter en temps réel'}
      ]; 
      $scope.object = {
        elements: []
      };
      
      // fonction pour selectionner tous les widgets
      $scope.checkAll = function() {
    $scope.object.elements = $scope.elements.map(function(item) { return item.text; });
      };

      // fonction pour déselectionner tous les widgets
      $scope.uncheckAll = function() {
        $scope.object.elements = [];
      };

      // fonction pour ajouter des widgets sur le dashboard de l'utilisateur
      $scope.Add = function () {
          var userId;
          $scope.informations = $resource(cfg.urlServices+'db/:action',
            {action:'get.pl',callback:"JSON_CALLBACK"},
            {get:{method:'JSONP'}});
          // Interroger Solr pour avoir l'identifiant de l'utilisateur en cours de session       
          $scope.informations.get({user_s : userInformations[0], type_s:'user'}).$promise.then(function(user) {
              userId = user.success.response.docs[0].id;
                var $i = 0;
                while($i < $scope.object.elements.length){
                  if(!($scope.object.elements[$i] === "undefined")){
                    addWidget($scope.object.elements[$i], true, 1, userId);
                  }
                  $i++;
                }
          });
        setDashboardInformations(userInformations[0]);
        $modalInstance.close();
      };

      // fonction pour annuler la selection des widgets
      $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };

});