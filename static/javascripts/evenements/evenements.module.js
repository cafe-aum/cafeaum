(function () {
  'use strict';

  var yoga = angular
    .module('cafeyoga.evenements', [
      'cafeyoga.evenements.controllers',
      'cafeyoga.evenements.services'
    ]);



  angular
    .module('cafeyoga.evenements.controllers', [
      'angularMoment',
      'ui.bootstrap',
      'cafeyoga.authentication.services',
  ]);

  angular
    .module('cafeyoga.evenements.services', []);

})();