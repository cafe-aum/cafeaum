(function () {
  'use strict';

  var yoga = angular
    .module('cafeyoga.boutique', [
      'cafeyoga.boutique.controllers',
      'cafeyoga.boutique.services'
    ]);



  angular
    .module('cafeyoga.boutique.controllers', [
      'angularMoment',
      'ui.bootstrap',
      'cafeyoga.authentication.services',
  ]);

  angular
    .module('cafeyoga.boutique.services', []);

})();