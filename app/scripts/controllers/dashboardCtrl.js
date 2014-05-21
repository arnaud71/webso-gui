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
      $scope.elements = [
        'Affichage d\'une source',
        'Affichage d\'une surveillance',
        'Affichage d\'un dossier de surveillance',
        'Affichage d\'un flux twitter en temps réel'
      ]; 

      $scope.object = {
        elements: []
      };

      $scope.checkAll = function() {
        $scope.object.elements = angular.copy($scope.elements);
      };

      $scope.uncheckAll = function() {
        $scope.object.elements = [];
      };

      $scope.Ajouter = function () {
        $modalInstance.close();
      };

      $scope.Annuler = function () {
        $modalInstance.dismiss('cancel');
      };
    };

  });