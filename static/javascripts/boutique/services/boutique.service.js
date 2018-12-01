/**
* Authentication
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.boutique.services')
    .factory('BoutiqueService', BoutiqueService);

  BoutiqueService.$inject = ['$http','$q', '$location'];

  /**
  * @namespace Reservations
  * @returns {Factory}
  */
  function BoutiqueService($http, $q, $location) {
    /**
    * @name Reservations
    * @desc The Factory to be returned
    */
    var BoutiqueService = {
       getAllCreateurs: getAllCreateurs,

    }

    return BoutiqueService;

    ////////////////////

    function getAllCreateurs(callback) {
        return $http.get('api/v1/boutique/createurs/')
           .then(
               function(data, status, headers, config){
                   callback(true, data.data);
               },
               function(data, status, headers, config){
                  callback(false, undefined);
               }
           );
    }

  }
})();

