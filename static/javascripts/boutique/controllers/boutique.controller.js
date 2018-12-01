/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.boutique.controllers')
    .controller('BoutiqueController', BoutiqueController);


  BoutiqueController.$inject = ['BoutiqueService', 'Authentication', '$scope', '$location' ];

  function BoutiqueController( BoutiqueService, Authentication, $scope, $location) {


     activate();
     $scope.expos = [];
     $scope.all_expos = [];
     $scope.showExpoEnCours = true;
     $scope.showExpoPassees = false;

     function activate() {
         BoutiqueService.getAllCreateurs(function(success, createurs){
            if(!success) return;

            $scope.createurs = createurs;
         });
     }

  };

})();