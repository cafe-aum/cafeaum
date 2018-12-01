(function () {
  'use strict';

  angular
    .module('cafeyoga.evenements.services')
    .factory('EvenementsService', EvenementsService);

  EvenementsService.$inject = ['$http','$q', '$location'];

  /**
  * @namespace Reservations
  * @returns {Factory}
  */
  function EvenementsService($http, $q, $location) {
    /**
    * @name Reservations
    * @desc The Factory to be returned
    */
    var EvenementsService = {
       getAllEvenements: getAllEvenements,
       getAllExpos: getAllExpos,

       getEvenementsDisplay: getEvenementsDisplay,
       evenementsDisplay : evenementsDisplay,
       displayStates : {'en_cours' : true,
                       'passees' : false}
    }

    return EvenementsService;

    ////////////////////

    function getAllEvenements(callback) {
        return $http.get('api/v1/evenements/')
           .then(
               function(data, status, headers, config){
                   callback(true, data.data);
               },
               function(data, status, headers, config){
                  callback(false, undefined);
               }
           );
    }

    function getAllExpos(callback) {
        return $http.get('api/v1/evenements/expos/')
           .then(
               function(data, status, headers, config){
                   callback(true, data.data);
               },
               function(data, status, headers, config){
                  callback(false, undefined);
               }
           );
    }

    function evenementsDisplay(section){
       Object.keys(EvenementsService.displayStates).forEach(function(key) {
           if(key === section){
              EvenementsService.displayStates[key] = true;
           }else{
              EvenementsService.displayStates[key] = false;
           }
       });
    }

    function getEvenementsDisplay(){
       return EvenementsService.displayStates;
    }
  }
})();

