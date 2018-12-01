/**
* NavbarController
* @namespace thinkster.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.controllers')
    .controller('SideNavbarController', SideNavbarController);

  SideNavbarController.$inject = ['$scope',
                                  '$location',
                                  '$window',
                                  'Authentication',
                                   'RestaurantService',
                                  'BoutiqueService',
                                  'EvenementsService',
                                  'Layout',
                                  '$routeParams'];

  /**
  * @namespace NavbarController
  */
  function SideNavbarController($scope,
                                $location,
                                $window,
                                Authentication,
                                RestaurantService,
                                BoutiqueService,
                                EvenementsService,
                                Layout,
                                $routeParams) {

    $scope.sectionsList =
        {'restaurant' :  { title : 'Restaurant',
                           displaySubItems: false,
                           subitems : {'carte' : {title: 'Notre carte',
                                               link:'/restaurant/carte',
                                               currentLocation : false,
                                               icon:"",
                                               subitems:{}
                                               }
                                      ,
                                      'nosproduits': {title: 'Nos produits',
                                                       link:'/restaurant/nosproduits',
                                                       currentLocation : false,
                                                       icon:"",
                                                       subitems: {'nosproducteurs': {title: 'Nos fournisseurs',
                                                                                     click:'selectNosProducteurs()',
                                                                                     currentLocation : true,
                                                                                     icon:"chevron_right"}
                                                                  ,
                                                                  'notrecharte': {title: 'Notre charte',
                                                                                  click:'selectNotreCharte()',
                                                                                  currentLocation : false,
                                                                                  icon:""}

                                                                   }
                                                       }
                                      ,
                                      'reservation' : {title: 'Réserver une table',
                                                       link:'/restaurant/reservation',
                                                       currentLocation : false,
                                                       icon:"",
                                                       subitems:{}
                                                       }
                                      }
                           }
        ,
        'yoga' :         { title : 'Yoga',
                           displaySubItems: false,
                           subitems : {'calendrier' : {title: 'Calendrier des cours',
                                                      link:'/yoga/calendrier',
                                                      currentLocation : false,
                                                      icon:"",
                                                      subitems:[]
                                                      }
                                      ,
                                      'professeurs' : {title: 'Nos professeurs',
                                                      link:'/yoga/professeurs',
                                                      currentLocation : false,
                                                      icon:"",
                                                      subitems:[]
                                                      }
                                      ,
                                      'tarifs' : {title: 'Tarifs',
                                                      link:'/yoga/tarifs',
                                                      currentLocation : false,
                                                      icon:"",
                                                      subitems:[]
                                                      }
                                      ,
                                      }

                           }
        ,
        'boutique' :     { title : 'Boutique',
                           displaySubItems: false,
                           subitems : {/*'createurs':{title: 'Notre boutique',
                                                   link:'/boutique/createurs',
                                                   currentLocation : false,
                                                   icon:"",
                                                   subitems:{}
                                                   }
                                       ,
                                       'expositions' : {title: 'Nos expositions',
                                                        link:'/boutique/expositions',
                                                        currentLocation : false,
                                                        icon:"",
                                                        subitems:{'en_cours': {title: 'Exposition en cours',
                                                                               click:'selectExpoEnCours()',
                                                                               currentLocation : true,
                                                                               icon:"chevron_right"}
                                                                  ,
                                                                  'passees': {title: 'Expositions passées',
                                                                              click:'selectExpoPassees()',
                                                                              currentLocation : false,
                                                                              icon:""}

                                                                   }
                                                        }
                                       */}
                           }
        ,
        'evenements' :   { title : 'Evènements',
                           link: '/evenements',
                           displaySubItems: false,
                           subitems : {'calendrier':
                                                  {title: 'Calendrier',
                                                  currentLocation : false,
                                                  link:'/evenements/calendrier',
                                                  icon:"",
                                                  subitems:{}
                                                  }
                                       ,
                                       'expositions': { title: 'Expositions',
                                                        currentLocation : false,
                                                        link:'/evenements/expositions',
                                                        icon:"",
                                                        subitems:{'en_cours': {title: 'En cours',
                                                                              currentLocation : true,
                                                                              click:function(){$scope.selectEvenementsAVenir()},
                                                                              icon:"chevron_right",
                                                                              subitems:{}
                                                                             }
                                                                  ,
                                                                  'passees':  {title: 'Passées',
                                                                              currentLocation : false,
                                                                              click:function(){$scope.selectEvenementsPasses()},
                                                                              icon:"",
                                                                              subitems:{}
                                                                              }
                                                                  }
                                                        }

                                       },

                         }
        ,
        'settings' :     { title : 'Mon compte',
                           link: '/settings',
                           displaySubItems: false,
                           subitems : {'profile': {title: 'Mon profil',
                                                  currentLocation : true,
                                                  click:function(){$scope.selectUpdateProfile()},
                                                  icon:"chevron_right",
                                                  subitems:{}
                                                  }
                                       ,
                                       'lessons':{title: 'Mes cours',
                                                  currentLocation : false,
                                                  click:function(){$scope.selectLessonsHistoric()},
                                                  icon:"",
                                                  subitems:{}
                                                  }
                                       ,
                                       'historic':{title: 'Mes transactions',
                                                  currentLocation : false,
                                                  click:function(){$scope.selectTransactionsHistoric()},
                                                  icon:"",
                                                  subitems:{}
                                                  }
                                       ,
                                       'recharge' : {title: 'Recharger mon compte',
                                                    currentLocation : false,
                                                    click:function(){$scope.selectRecharge()},
                                                    icon:"",
                                                    subitems:{}
                                                    }
                                       }
                         }
        };


    $scope.getStyle = function(item){
       if(item.currentLocation){
          return {'color' : '#54622e', 'font-weight':'700'};
       }
       else{
          return {'color' : '#A87E43', 'font-weight':'700'};
       }
    }

    $scope.getSubStyle = function(subitem){
       if(subitem.currentLocation){
          return {'color' : '#54622e', 'font-weight':'700'};
       }
       else{
          return {'color' : '#A87E43', 'font-weight':'500'};
       }
    }

    $scope.selectSubSection = function(subitem){
       var target = $scope.currentSection.subitems[subitem];
       if(target.hasOwnProperty('link')){
           $location.url(target.link);
       }else{
           target.click();
       }
    }

    $scope.selectSubItem = function(item, key,subitem){
        if($scope.currentSectionKey === 'restaurant'){
           RestaurantService.displayText(key);
        }
        else if($scope.currentSectionKey === 'boutique'){
           BoutiqueService.displayText(key);
        }else if($scope.currentSectionKey === 'evenements'){
           EvenementsService.evenementsDisplay(key);
        }

        var section = $scope.sectionsList[$scope.currentSectionKey];
        var subSection = section.subitems[item];

        Object.keys(subSection.subitems).forEach(function(k) {
           if(k==key){
              subSection.subitems[k].currentLocation = true;
              subSection.subitems[k].icon = "chevron_right";
           }else{
              subSection.subitems[k].currentLocation = false;
              subSection.subitems[k].icon = "";
           }
        });
    }

    $scope.selectNosProducteurs = function(){
         RestaurantService.displayText('nosproducteurs');
    }

    $scope.selectNotreCharte = function(){
         RestaurantService.displayText('notrecharte');
    }

    $scope.selectExpoEnCours= function(){
         BoutiqueService.displayText('en_cours');
    }

    $scope.selectExpoPassees = function(){
         BoutiqueService.displayText('passees');
    }

    $scope.selectRecharge = function(){
         $scope.currentSection.subitems['profile'].currentLocation = false;
         $scope.currentSection.subitems['profile'].icon = "";
         $scope.currentSection.subitems['lessons'].currentLocation = false;
         $scope.currentSection.subitems['lessons'].icon = "";
         $scope.currentSection.subitems['historic'].currentLocation = false;
         $scope.currentSection.subitems['historic'].icon = "";
         $scope.currentSection.subitems['recharge'].currentLocation = true;
         $scope.currentSection.subitems['recharge'].icon = "chevron_right";
         Authentication.settingsDisplay('recharge');
    }

    $scope.selectUpdateProfile = function(){
         $scope.currentSection.subitems['profile'].currentLocation = true;
         $scope.currentSection.subitems['profile'].icon = "chevron_right";
         $scope.currentSection.subitems['lessons'].currentLocation = false;
         $scope.currentSection.subitems['lessons'].icon = "";
         $scope.currentSection.subitems['historic'].currentLocation = false;
         $scope.currentSection.subitems['historic'].icon = "";
         $scope.currentSection.subitems['recharge'].currentLocation = false;
         $scope.currentSection.subitems['recharge'].icon = "";
         Authentication.settingsDisplay('profile');
    }

    $scope.selectLessonsHistoric = function(){
         $scope.currentSection.subitems['profile'].currentLocation = false;
         $scope.currentSection.subitems['profile'].icon = "";
         $scope.currentSection.subitems['lessons'].currentLocation = true;
         $scope.currentSection.subitems['lessons'].icon = "chevron_right";
         $scope.currentSection.subitems['historic'].currentLocation = false;
         $scope.currentSection.subitems['historic'].icon = "";
         $scope.currentSection.subitems['recharge'].currentLocation = false;
         $scope.currentSection.subitems['recharge'].icon = "";
         Authentication.settingsDisplay('lessons');
    }

    $scope.selectTransactionsHistoric = function(){
         $scope.currentSection.subitems['profile'].currentLocation = false;
         $scope.currentSection.subitems['profile'].icon = "";
         $scope.currentSection.subitems['lessons'].currentLocation = false;
         $scope.currentSection.subitems['lessons'].icon = "";
         $scope.currentSection.subitems['historic'].currentLocation = true;
         $scope.currentSection.subitems['historic'].icon = "chevron_right";
         $scope.currentSection.subitems['recharge'].currentLocation = false;
         $scope.currentSection.subitems['recharge'].icon = "";
         Authentication.settingsDisplay('historic');
    }

    $scope.selectEvenementsAVenir = function(){
         $scope.currentSection.subitems['en_cours'].currentLocation = true;
         $scope.currentSection.subitems['en_cours'].icon = "chevron_right";
         $scope.currentSection.subitems['passees'].currentLocation = false;
         $scope.currentSection.subitems['passees'].icon = "";
         EvenementsService.evenementsDisplay('en_cours');
    }

    $scope.selectEvenementsPasses = function(){
         $scope.currentSection.subitems['en_cours'].currentLocation = false;
         $scope.currentSection.subitems['en_cours'].icon = "";
         $scope.currentSection.subitems['passees'].currentLocation = true;
         $scope.currentSection.subitems['passees'].icon = "chevron_right";
         EvenementsService.evenementsDisplay('passees');
    }

    activate();

    function activate() {
         var location = $location.path().split('/').slice(1);
         $scope.currentSection = $scope.sectionsList[location[0]];
         $scope.currentSectionKey = location[0];
         if(location.length > 1){
             $scope.currentSubSection = $scope.currentSection.subitems[location[1]];
             $scope.currentSubSection.currentLocation = true;
             $scope.currentSubSection.icon = "chevron_right";
         }

         if($scope.currentSectionKey=='settings'){
             $scope.$watch(function() { return Layout.getSideNavBar(); }, function (newValue) {
                 if(newValue==='recharge'){
                    $scope.selectRecharge();
                 }else if(newValue==='transaction'){
                    $scope.selectTransactionsHistoric();
                 }else{
                    $scope.selectUpdateProfile();
                 }
             }, true);
         }
    }
  }
})();