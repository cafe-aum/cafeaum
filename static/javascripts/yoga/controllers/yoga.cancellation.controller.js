/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.yoga.controllers')
    .controller('YogaCancellationController', YogaCancellationController);

  YogaCancellationController.$inject = ['YogaService', 'Authentication', '$scope', '$rootScope', 'moment', '$location', 'MessagingService' ];

  function YogaCancellationController( YogaService, Authentication, $scope, $rootScope, moment, $location, MessagingService) {

      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      $scope.cancellationSuccessful = false;
      $scope.alert_message = undefined;
      $scope.loading = true;
      activate();

      function prepare_cancellation(reservation){
          var start = new Date(reservation.lesson.date);
          $scope.lesson = reservation.lesson;
          $scope.reservation = reservation;
          $scope.nb_persons = reservation.nb_personnes;

          $scope.meta = {};
          $scope.meta.day = start.toLocaleDateString('fr-FR', options);
          $scope.meta.start = start.getHours() + ":"+(start.getMinutes() < 10 ? '0' : '') +  start.getMinutes();
          $scope.meta.duration = $scope.lesson.duration;
          $scope.meta.nb_places = $scope.lesson.nb_places;
          $scope.meta.total_price = $scope.nb_persons * $scope.lesson.price;
          $scope.meta.next_credits = $scope.account.credits + ($scope.nb_persons * $scope.lesson.price);
          $scope.loading = false;
      }

      function activate() {
         var path = $location.url().split('/');

         /* Si l'utilisateur a cliqué sur le lien /yoga/annulation/<réservation> */
         if(path.length == 4){
             Authentication.getFullAccount(function(value){
                Authentication.fullAccount = value;
                $scope.account = value;
                if(angular.equals($scope.account,{})){
                   Authentication.gotoLoginAndBackTo($location.url());
                }else{
                   YogaService.getReservationById(path[3], function(success, reservations){
                      if(!success){
                          $scope.alert_message = "Réservation invalide";
                          YogaService.stagedReservationExit(false, undefined, false);
                          return;
                      }
                      var reservation = reservations[0];

                      if(reservation.account.id != $scope.account.id){
                          $scope.alert_message = "Cette réservation ne vous appartient pas";
                          YogaService.stagedReservationExit(false, undefined, false);
                          return;
                      }
                      prepare_cancellation(reservation);
                   });
                }
             });
         }else{
            /* Si l'utilisateur annule directement depuis le calendrier */
            Authentication.getFullAccount(function(value){
            Authentication.fullAccount = value;
            $scope.account = value;
            if(angular.equals($scope.account,{})){
               YogaService.stagedReservationExit(false, undefined, false);
            }else{
               var pendingCancellation = YogaService.getPendingCancellationByAccount($scope.account.id);
               if(pendingCancellation == undefined){
                  YogaService.stagedCancellationExit(true, $scope.account.id, false);
                  return;
               }
               prepare_cancellation(pendingCancellation);
            }
         });
         }

     }

     $scope.processCancellation = function(){
        $scope.loading = true;
        YogaService.cancelReservation($scope.lesson, $scope.account, function(success, message){
           $scope.loading = false;
           if(!success){
              $scope.alert_message = message;
              $scope.alert_message_color = "red";
              return;
           }else{
              $scope.cancellationSuccessful = true;
              $scope.alert_message = message;
              $scope.alert_message_color = "green";
              MessagingService.sendYogaCancellationToCustomerEmail(
                 $scope.lesson,
                 $scope.account,
                 $scope.reservation.nb_personnes,
                 $scope.reservation.id,
                 function(success, message){}
              );
              MessagingService.sendYogaCancellationToStaffEmail(
                 $scope.lesson,
                 $scope.account,
                 $scope.reservation.nb_personnes,
                 $scope.reservation.id,
                 function(success, message){}
              );
           }
        });
     }

     $scope.exitCancellation = function(lesson, account, nb_persons){
        if($scope.reservationSuccessful){
           /* Reservation has been successful : pending reservation has already been cleaned */
           YogaService.stagedCancellationExit(false, undefined, false);
        }else{
           /* exit on Failure or Cancelation : pending reservation must be cleaned */
           YogaService.stagedCancellationExit(true, $scope.account.id, true);
        }
     }

     $scope.gotoCalendar = function(){YogaService.gotoCalendar();}
  }
})();