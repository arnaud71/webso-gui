'use strict';

/*

 CarouselCtrl

 */

angular.module('websoApp')
    .controller('CarouselCtrl', ['$scope','cfg', function ($scope,cfg) {
        var $name = cfg.plateformName;
        $scope.myInterval = 8000;
        var slides = $scope.slides = [];
        var $msg_version = $name+', version '+cfg.versionWebso;
        $scope.addSlide = function() {
            //var newWidth = 600 + slides.length;
            slides.push({
                image: 'images/technology-2.jpg',
                text: [$msg_version, $name+' : la plateforme de veille pour tous','Recherche Avancée','Validation de l\'information pertinente','Diffusion par newsletter et rapport'][slides.length % 4]
            });
        };
        for (var i=0; i<4; i++) {
            $scope.addSlide();
        }

    }]);