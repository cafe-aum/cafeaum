/**
* Register controller
* @namespace thinkster.authentication.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.yoga.controllers')
    .controller('RechargeController', RechargeController);


  RechargeController.$inject = ['YogaService', 'Authentication', '$scope', '$location' ];

  function RechargeController( YogaService, Authentication, $scope, $location) {

     $scope.data = { montant_initial : 0,
                     montant_final : 0,
                     credit: 0,
                     selectedFormula: undefined,
                     formules: [],
                     reduction : 0,
                     transaction_submitted : false,
                     transaction_successful : false};

     $scope.state = {step_formule : true,
                     step_code_reduction : false,
                     step_payment_summary : false,
                     step_card_info : false,
                     step_payment_in_progress : false,
                     step_payment_success : false,
                     step_payment_error: false};

     /* Test card : */
     $scope.number = "4242-4242-4242-4242";
     $scope.expiry = "12/18";
     $scope.cvc =    "999";

     activate();

     function compareFormules(formuleA, formuleB){
       if(formuleA.montant < formuleB.montant){
          return -1;
       }
       if(formuleA.montant > formuleB.montant){
          return 1;
       }
       return 0;
    }

     function activate() {
         Authentication.getFullAccount(function(value){
            $scope.account = value;
            if(angular.equals($scope.account,{})){
               /* If not logged in, just get all the lessons */
               Authentication.gotoLoginAndBackTo('/yoga/recharge');
            }else{
               YogaService.getAllFormulas(function(success, formules){
                  if(!success){
                     Authentication.gotoLogin();
                  }else{
                     formules.forEach(function(formule){
                         formule.nb = 0;
                         formule.selected = false;
                         $scope.data.formules.push(formule);
                     });
                    // $scope.data.formules = formules;
                     $scope.data.formules.sort(compareFormules);
                  }
               })
            }
         });
     }


     $scope.tryReductionCode = function(code_reduction){
        if ((code_reduction.length < 6) && ($scope.data.reduction==0) ) return;

        YogaService.tryReductionCode(code_reduction, function(success, reduction){
           if(!success){
              $scope.data.reduction = 0;
           }else{
              $scope.data.reduction = reduction.pourcentage;
              $scope.error = undefined;
           }
        });
     }

     $scope.cancelPayment = function(){
        $scope.data.montant_initial = 0;
        $scope.data.montant_final = 0;
        $scope.data.credit = 0;
        $scope.data.reduction = 0;
        $scope.data.formules.forEach(function(f){
            f.nb = 0;
        });
        $scope.data.code_reduction = undefined;
        for (var k in $scope.state) {
            if ($scope.state.hasOwnProperty(k)) {
                $scope.state[k] = false;
            }
        }
        $scope.state.step_formule = true;
     }

     $scope.chooseFormula = function(){
        if($scope.data.montant_initial == 0){
           $scope.error = "Vous devez choisir une formule";
           return;
        }

        $scope.data.montant_final = $scope.data.montant_initial * (100 - $scope.data.reduction)/100;
        $scope.state.step_formule = false;
        $scope.state.step_code_reduction = false;
        $scope.state.step_payment_summary = true;
        $scope.error = undefined;
     }

     $scope.increaseFormuleNb = function(formule){
         formule.nb++;
         $scope.data.montant_initial += formule.montant;
         $scope.data.credit += formule.nb_cours;
     }

     $scope.decreaseFormuleNb = function(formule){
         if(formule.nb > 0) formule.nb--;

         if($scope.data.montant_initial >= formule.montant){
            $scope.data.montant_initial -= formule.montant;
         }

         if($scope.data.credit >= formule.nb_cours){
            $scope.data.credit -= formule.nb_cours;
         }
     }

     $scope.backToFormula = function(){
        $scope.state.step_formule = true;
        $scope.state.step_code_reduction = false;
        $scope.error = undefined;
     }

     $scope.tryReductionCodeIfAny = function(code_reduction){
        if( code_reduction ){
           if ( $scope.data.reduction != 0){
              $scope.data.montant_final = $scope.data.montant_initial * (100 - $scope.data.reduction)/100;
              $scope.state.step_code_reduction = false;
              $scope.state.step_payment_summary = true;
           }else{
              $scope.error = "Votre code de réduction n'est pas valide";
           }
        }else{
           $scope.data.montant_final = $scope.data.montant_initial;
           $scope.state.step_code_reduction = false;
           $scope.state.step_payment_summary = true;
           $scope.error = undefined;
        }
     }

     $scope.backToReductionCode = function(){
        $scope.state.step_payment_summary = false;
        $scope.state.step_code_reduction = false;
        $scope.state.step_formule = true;
        $scope.error = undefined;
     }

     $scope.gotoPaymentForm = function(){
        $scope.state.step_payment_summary = false;
        $scope.state.step_card_info = true;
        $scope.error = undefined;
     }


     // Stripe Response Handler
     $scope.stripeCallback = function (code, result) {
        if (result.error) {
            $scope.error = "Une erreur est survenue lors de la transaction. Votre compte n'a pas été débité.";
            //window.alert('it failed! error: ' + result.error.message);
        } else {
            $scope.token = result.id;
            $scope.data.montant_final = $scope.data.montant_initial * (100 - $scope.data.reduction)/100;
            if($scope.data.montant_final == 0){
               $scope.error = "Vous devez choisir une formule";
               return;
            }
            $scope.state.step_card_info = false;
            $scope.state.step_payment_in_progress = true;

            YogaService.proceedTransaction(
               $scope.account,
               $scope.data.montant_final,
               $scope.data.credit,
               $scope.token,
               function(success, message){
                  $scope.state.step_payment_in_progress = false;
                  if(!success){
                     $scope.error = message;
                     $scope.success = undefined;
                     $scope.state.step_payment_error = true;
                     $scope.state.step_payment_success = false;
                  }else{
                     $scope.success = "Votre compte a bien été rechargé";
                     $scope.error = undefined;
                     $scope.state.step_payment_error = false;
                     $scope.state.step_payment_success = true;

                     Authentication.requestFullAccount($scope.account.email, function(success, account){
                         $scope.account = account;
                     });
                  }
               }
            );
        }
     };

     $scope.backToPaymentSummary = function(){
        $scope.state.step_payment_summary = true;
        $scope.state.step_card_info = false;
        $scope.error = undefined;
     }

     $scope.changeCardFrom = function(){
        $scope.error = undefined;
        $scope.success = undefined;
     }

     $scope.gotoCalendar = function(){
        $location.url('/yoga/calendrier');
     }
  };

})();