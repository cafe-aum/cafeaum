/**
* LandingPageController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.controllers')
    .controller('LandingPageController', LandingPageController);

  LandingPageController.$inject = ['$scope', 'Authentication', 'Layout', '$mdMedia', '$mdToast'];

  /**
  * @namespace NavbarController
  */
  function LandingPageController($scope, Authentication, Layout, $mdMedia, $mdToast) {
    var vm = this;

    $scope.account = {};

    $scope.items = [
       {text:"Restaurant",
        text_xs:"Restaurant",
        notes:"Découvrir notre carte ou réserver une table",
        img:"/static/img/landingpage/RESTAURANT.png",
        link:"/restaurant/carte"},
       {text:"Yoga",
        text_xs:"Yoga",
        notes:"Découvrir nos cours et nos professeurs",
        img:"/static/img/landingpage/YOGA.png",
        link:"/yoga/calendrier"},
       {text:"Boutique & Expositions",
        text_xs:"Boutique",
        notes:"Découvrir nos artisans partenaires",
        img:"/static/img/landingpage/BOUTIQUE.png",
        link:"/boutique/createurs"},
       {text:"Evenements",
        text_xs:"Evenements",
        notes:"Découvrir nos évènements",
        img:"/static/img/landingpage/EVENEMENTS.png",
        link:"/evenements"},
    ];

    $scope.portrait = $mdMedia('portrait');
    $scope.landscape = $mdMedia('landscape');

    this.$doCheck = function(){
       var view = angular.element( document.querySelector( '#view' ) );
       if( Layout.detectGtMdScreen() ){
          view.addClass('cy-view-landscape');
          view.removeClass('cy-view-portrait');
          return;
       }else{
          $scope.portrait = Layout.detectScreenOrientation();
          if($scope.portrait){
             view.removeClass('cy-view-landscape');
             view.addClass('cy-view-portrait');
          }else{
             view.addClass('cy-view-landscape');
             view.removeClass('cy-view-portrait');
          }
       }
    }

    $scope.showToast = function() {
        $mdToast.show(
          $mdToast.simple()
             .textContent('Votre profil a bien été mis à jour')
             .position("top right")
             .hideDelay(3000)
        );
    }

    /**
    * @name logout
    * @desc Log the user out
    * @memberOf thinkster.layout.controllers.NavbarController
    */
    $scope.logout = function() {
      Authentication.logout(false);
      $scope.account = {};
    }

    activate();
    function activate() {
       Authentication.getFullAccount(function(value){
           $scope.account = value;
           if(!angular.equals($scope.account,{})){
               $scope.display_name = $scope.account.first_name + " " + $scope.account.last_name;
               /*if($scope.display_name.length > 15) {
                   $scope.display_name = $scope.display_name.substring(0,12)+"...";
               }*/
           }
       });
       if(!Layout.getUserAcceptedCookies() && !Layout.isToastShown()){
          Layout.toastShow();
          var toast = $mdToast.simple()
                   .textContent('En poursuivant votre navigation sur ce site, vous acceptez l’utilisation de cookies pour vous proposer une meilleure qualité de service')
                   .action('J\'accepte')
                   .highlightAction(true)
                   .position('top')
                   .hideDelay(0);

          $mdToast.show(toast).then(function(response) {
             if ( response == 'ok' ) {
                Layout.setUserAcceptedCookies();
                Layout.toastHide();
             }
          });
       }

    }
  }
})();