(function () {
  'use strict';

  angular
    .module('cafeyoga.layout', [
      'cafeyoga.layout.controllers',
      'cafeyoga.layout.services'
    ]);

  angular
    .module('cafeyoga.layout.controllers', []);

  angular
    .module('cafeyoga.layout.services', ['ngCookies']);
})();