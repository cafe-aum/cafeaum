/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.yoga.controllers')
    .controller('YogaTarifsController', YogaTarifsController);

  YogaTarifsController.$inject = ['YogaService', 'Authentication', '$scope', '$rootScope', 'moment', '$uibModal', '$location' ];

  function YogaTarifsController( YogaService, Authentication, $scope, $rootScope, moment, $location) {

      $scope.tarifs = [];

      activate();

      function activate() {
          YogaService.getAllTarifs(function(success, tarifs){
              if( success ){
                  $scope.tarifs = tarifs;
              }
          });
        /* Authentication.getFullAccount(function(value){
            Authentication.fullAccount = value;
            $scope.account = value;
            $scope.animators = YogaService.getAllAnimators(function(success, animators){
               if(!success){
                  YogaService.gotoCalendar();
                  return;
               }
               $scope.animators = animators;
            });
         });*/
     }
  }
})();