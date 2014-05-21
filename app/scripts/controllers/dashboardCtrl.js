'use strict';

angular.module('websoApp')
  .controller('DashboardViewCtrl', function ($scope, $modal) {

    $scope.dashboardTitle = 'Tableau de bord';
    $scope.haveElements = false;


    $scope.addElements = function () {
      // affichage de la fenetre modal pour selectionner des éléments
      var modalInstance = $modal.open({
        templateUrl: 'validateModal.html',
        controller: ModalInstanceCtrl
      });
    };

    //  Instance du modal
    var ModalInstanceCtrl = function ($scope, $modalInstance) {
      $scope.elements = ['Affichage d\'une source','Affichage d\'une surveillance','Affichage d\'un dossier de surveillance','Affichage d\'un flux twitter en temps réel'];

      $scope.valider = function () {
        $modalInstance.close();
      };

      $scope.annuler = function () {
        $modalInstance.dismiss('cancel');
      };
    };

  });