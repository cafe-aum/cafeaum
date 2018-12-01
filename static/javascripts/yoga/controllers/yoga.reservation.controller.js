/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.yoga.controllers')
    .controller('YogaReservationController', YogaReservationController);

  YogaReservationController.$inject = ['YogaService', 'Authentication', 'MessagingService', '$scope', '$rootScope', 'moment', '$uibModal', '$location' ];

  function YogaReservationController( YogaService, Authentication, MessagingService, $scope, $rootScope, moment, $location) {

      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      $scope.reservationSuccessful = false;
      $scope.alert_message = undefined;
      $scope.loading = true;
      var timer;
      activate();

      function activate() {
         Authentication.getFullAccount(function(value){
            Authentication.fullAccount = value;
            $scope.account = value;
            if(angular.equals($scope.account,{})){
               YogaService.stagedReservationExit(false, undefined, false);
            }else{
               var pendingReservation;
               YogaService.getLocalePendingReservationByAccount($scope.account.id, function(success,pendingReservation){
                  if(!success || (pendingReservation===undefined) || (pendingReservation.length <= 0) ){
                     YogaService.stagedReservationExit(true, $scope.account, false);
                     return;
                  }
                  var now = new Date();

                  var start = new Date(pendingReservation.lesson.date);
                  $scope.lesson = pendingReservation.lesson;
                  $scope.nb_persons = pendingReservation.nb_persons;

                  $scope.meta = {};
                  $scope.meta.day = start.toLocaleDateString('fr-FR', options);
                  $scope.meta.start = start.getHours() + ":"+ (start.getMinutes() < 10 ? '0' : '') +  start.getMinutes();
                  $scope.meta.duration = $scope.lesson.duration;
                  $scope.meta.nb_places = $scope.lesson.nb_places;
                  $scope.meta.total_price = $scope.nb_persons * $scope.lesson.price;
                  $scope.meta.next_credits = $scope.account.credits - ($scope.nb_persons * $scope.lesson.price);
                  $scope.meta.remaining_time = 15 - Math.floor((((now-pendingReservation.created) % 86400000) % 3600000) / 60000);
                  if($scope.meta.remaining_time < 0){
                     YogaService.stagedReservationExit(true, $scope.account, true);
                     $scope.reservationSuccessful = false;
                  }
                  timer = window.setTimeout(expiredReservation, 1000 * 60  ); // 1min
                  $scope.loading = false;
               });
            }
         });
     }

     function expiredReservation(){
        $scope.meta.remaining_time--;
        if($scope.meta.remaining_time <= 0){
           alert("Votre réservation a expiré, veuillez recommencer une nouvelle réservation\n");
           YogaService.stagedReservationExit(true, $scope.account, true);
           $scope.reservationSuccessful = false;
        }else{
           timer = window.setTimeout(expiredReservation, 1000 * 60  );
        }
        $scope.$apply();
     }

     $scope.processReservation = function(lesson, account, nb_persons){
        $scope.loading = true;
        YogaService.createReservation(lesson, account, nb_persons, function(success, message, reservation_id){
           if(!success){
              $scope.alert_message = message;
              $scope.alert_message_color = "red";
              return;
           }else{
              clearTimeout(timer);
              $scope.reservationSuccessful = true;
              $scope.loading = false;
              $scope.alert_message = message;
              $scope.alert_message_color = "green";
              YogaService.deletePendingReservation(lesson, account, nb_persons, function(success,message){});
              MessagingService.sendYogaConfirmationToCustomerEmail(lesson, account, nb_persons, reservation_id, function(){});
              MessagingService.sendYogaConfirmationToStaffEmail(lesson, account, nb_persons, reservation_id, function(){});
           }
        });
     }

     $scope.exitReservation = function(lesson, account, nb_persons){
        $scope.loading = true;
        clearTimeout(timer);
        if($scope.reservationSuccessful){
           /* Reservation has been successful : pending reservation has already been cleaned */
           YogaService.stagedReservationExit(false, undefined, false);
        }else{
           /* exit on Failure or Cancelation : pending reservation must be cleaned */
           YogaService.stagedReservationExit(true, $scope.account, true);
        }
     }

          /* Function called when the cancellation button is clicked by user */
     $scope.cancelReservation = function(lesson, account){
        $scope.alert_message = [];

        YogaService.getReservation(lesson, account, function(success, reservation){
           if(!success){
              $scope.alert_message = message;
              $scope.alert_message_color = "red";
              return;
           }
           if (reservation == undefined){
                $scope.alert_message = "Impossible d'annuler cette réservation";
                $scope.alert_message_color = "red";
                return;
           }
           reservation = reservation[0];
           /* Delegate actual to YogaCancellationController on cancellation page */
           YogaService.stageCancellation(reservation, "calendar");
        }
     )};


  }
})();