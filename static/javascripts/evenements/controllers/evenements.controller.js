(function () {
  'use strict';

  angular
    .module('cafeyoga.evenements.controllers')
    .controller('EvenementsController', EvenementsController);


  EvenementsController.$inject = ['EvenementsService', 'Authentication', '$scope', '$location' ];

  function EvenementsController( EvenementsService, Authentication, $scope, $location) {

     activate();
     $scope.evenements = [];
     $scope.expos = [];
     $scope.all_expos = [];

     $scope.event_to_show = undefined;
     $scope.state = { showExpoEnCours : true,
                      showExpoPassees : false,
                      showDetails : false,
                    };
     var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

     function activate() {
         EvenementsService.getAllEvenements(function(success, evenements){
            if(!success) return;
            evenements.forEach(function(evenement){
               evenement.summary = evenement.texte.slice(0, 128) + "...";
               var date =  moment(evenement.date).toDate();
               evenement.locale_date =  date.toLocaleDateString('fr-FR', options);
               evenement.locale_date = evenement.locale_date.charAt(0).toUpperCase() + evenement.locale_date.slice(1);
               evenement.heure_debut = date.getHours() + "h"+
                                       (date.getMinutes() < 10 ? '0' : '') +
                                       date.getMinutes();
               var date_fin = moment(evenement.date).add(evenement.duree, 'm').toDate();
               evenement.heure_fin = date_fin.getHours() + "h"+
                                     (date_fin.getMinutes() < 10 ? '0' : '') +
                                     date_fin.getMinutes();
               $scope.evenements.push(evenement);
            });
         });

         EvenementsService.getAllExpos(function(success, expos){
            if(!success) return;
            $scope.all_expos = expos;
            expos.forEach(function(e){
               if(e.en_cours){
                  $scope.currentExposition = e;
               }else{
                  $scope.expos.push(e);
               }
            })
         });

         $scope.$watch(function() { return EvenementsService.getEvenementsDisplay(); }, function (newValue) {
                 $scope.state.showExpoEnCours = newValue['en_cours'];
                 $scope.state.showExpoPassees = newValue['passees'];
         }, true);
     }

     $scope.showDetails = function(evenement){
        $scope.event_to_show = evenement;
        $scope.state.showDetails = true;
     }

     $scope.hideDetails = function(){
        $scope.event_to_show = undefined;
        $scope.state.showDetails = false;
     }

     $scope.$on("$destroy", function(){
        EvenementsService.evenementsDisplay('en_cours');
     });

  };

})();