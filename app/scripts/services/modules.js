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