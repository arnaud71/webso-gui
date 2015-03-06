angular.module('filters', []).
  filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);

angular.module('mySharedService', [])
  .factory('sharedService', function($rootScope) {
    return {
      broadcast: function(msg) {
          $rootScope.$broadcast('handleBroadcast', msg); 
      }
    };
  });

angular.module('filters', []).
  filter('importanceColor', function() {
    return function(num) {
      // return String(text).replace(/<[^>]+>/gm, '');
      var $color = 'white';
      switch(num){
        case 1: $color = 'green';
        break;
        case 2: $color = 'yellow';
        break;
        case 3: $color = 'orange';
        break;
        case 4: $color = 'red';
        break;
      }
      return $color;
    }
  }
);
