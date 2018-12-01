(function () {
  'use strict';

  var restaurant = angular
    .module('cafeyoga.restaurant', [
        'cafeyoga.restaurant.controllers',
        'cafeyoga.restaurant.services'
    ]);

  angular
    .module('cafeyoga.restaurant.controllers', ['cafeyoga.authentication.services']);

  /* Service */
  angular
    .module('cafeyoga.restaurant.services', []);

})();