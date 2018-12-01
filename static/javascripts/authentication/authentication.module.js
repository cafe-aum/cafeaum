(function () {
  'use strict';

  angular
    .module('cafeyoga.authentication', [
      'cafeyoga.authentication.controllers',
      'cafeyoga.authentication.services',
      'vcRecaptcha'
    ]);

  angular
    .module('cafeyoga.authentication.controllers', [
       'cafeyoga.yoga.services']);

  angular
    .module('cafeyoga.authentication.services', ['ngCookies']);
})();