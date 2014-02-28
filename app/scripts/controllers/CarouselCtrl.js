'use strict';

/*

 CarouselCtrl

 */

angular.module('websoApp')
    .controller('CarouselCtrl', ['$scope', function ($scope) {

        $scope.myInterval = 8000;
        var slides = $scope.slides = [];
        $scope.addSlide = function() {
            //var newWidth = 600 + slides.length;
            slides.push({
                image: 'images/definition_veille.jpg',
                text: ['Webso','Recherche','Validation','Diffusion'][slides.length % 4]
            });
        };
        for (var i=0; i<4; i++) {
            $scope.addSlide();
        }

    }]);