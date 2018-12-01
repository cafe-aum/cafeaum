(function () {
  'use strict';

  angular
    .module('cafeyoga.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/register', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/register.html'
    }).when('/login', {
      controller: 'LoginController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/login.html'
    }).when('/monespace', {
      controller: 'RegisterController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/monespace.html'
    }).when('/settings', {
      controller: 'SettingsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/settings.html'
    }).when('/suppression-compte', {
      controller: 'DeletionController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/delete_account.html'
    }).when('/password-forgotten', {
      controller: 'RecoveryController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/password_forgotten.html'
    }).when('/recovery/:token', {
      controller: 'RecoveryController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/authentication/update_password.html'
    }).when('/boutique', {
      controller: 'BoutiqueController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/boutique/boutique.html'
    }).when('/yoga/calendrier', {
      controller: 'YogaController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/yoga/calendar.html'
    }).when('/yoga/tarifs', {
      controller: 'YogaTarifsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/yoga/tarifs.html'
    }).when('/yoga/reservation', {
      controller: 'YogaReservationController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/yoga/reservation.html'
    }).when('/yoga/annulation', {
      controller: 'YogaCancellationController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/yoga/cancellation.html'
    }).when('/yoga/annulation/:reservation', {
      controller: 'YogaCancellationController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/yoga/cancellation.html'
    }).when('/yoga/professeurs', {
      controller: 'YogaAnimatorsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/yoga/animateurs.html'
    }).when('/presentation',{
      controller: 'LandingPageController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/general/presentation.html'
    }).when('/restaurant',{
      controller: 'RestaurantController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/restaurant/nosproduits.html'
    }).when('/restaurant/nosproduits',{
      controller: 'NosProduitsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/restaurant/nosproduits.html'
    }).when('/restaurant/notrecharte',{
      controller: 'RestaurantController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/restaurant/notrecharte.html'
    }).when('/restaurant/carte',{
      controller: 'CarteController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/restaurant/carte.html'
    }).when('/restaurant/reservation',{
      controller: 'RestaurantController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/restaurant/reservation.html'
    }).when('/contact',{
      controller: 'ContactController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/general/contact.html'
    }).when('/',{
      controller: 'LandingPageController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/general/landingpage.html'
    })/*.when('/boutique/createurs',{
      controller: 'BoutiqueController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/boutique/boutique.html'
    }).when('/boutique/expositions',{
      controller: 'BoutiqueController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/boutique/expositions.html'
    })*/.when('/evenements',{
      controller: 'EvenementsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/evenements/evenements.html'
    }).when('/evenements/calendrier',{
      controller: 'EvenementsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/evenements/calendrier.html'
    }).when('/evenements/expositions',{
      controller: 'EvenementsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/evenements/expositions.html'
    }).when('/mentions',{
      controller: 'LandingPageController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/general/mentions_legales.html'
    }).when('/cguv',{
      controller: 'LandingPageController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/general/cguv.html'
    }).otherwise({
       redirectTo:"/"
    });
  }
})();