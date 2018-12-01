(function () {
  'use strict';

  var app = angular
    .module('cafeyoga', [
      'ngMaterial',
      'ngMessages',
      'angularPayments',
      'cafeyoga.config',
      'cafeyoga.routes',
      'cafeyoga.authentication',
      'cafeyoga.yoga',
      'cafeyoga.restaurant',
      'cafeyoga.boutique',
      'cafeyoga.evenements',
      'cafeyoga.layout',
      'cafeyoga.utils',
    ]);

  angular
    .module('cafeyoga.routes', ['ngRoute']);

  angular
    .module( 'cafeyoga.config',[]);

  angular
    .module('cafeyoga')
    .run(run);

   run.$inject = ['$http', '$location', '$rootScope'];

   /**
   * @name run
   * @desc Update xsrf $http headers to align with Django's defaults
   */
   function run($http, $location, $rootScope) {
     $http.defaults.xsrfHeaderName = 'X-CSRFToken';
     $http.defaults.xsrfCookieName = 'csrftoken';

     var history = [];
     $rootScope.$on('$routeChangeSuccess', function() {
        history.push($location.$$path);
     });
     $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
     };

   }

  app.filter('isEmpty', [function() {
    return function(object) {
       return angular.equals({}, object);
    }
  }]);
  app.filter('isEmptyArray', [function() {
    return function(object) {
       return angular.equals([], object);
    }
  }]);
})();