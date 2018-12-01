/**
* Layout
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

  angular
    .module('cafeyoga.layout.services')
    .factory('Layout', Layout);

  Layout.$inject = ['$cookies','$mdMedia'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Layout($cookies, $mdMedia) {

    var Layout = {
      detectScreenOrientation: detectScreenOrientation,
      detectMdScreen: detectMdScreen,
      detectGtMdScreen: detectGtMdScreen,
      setUserAcceptedCookies:setUserAcceptedCookies,
      getUserAcceptedCookies:getUserAcceptedCookies,
      cookiesAcceptedForSession:false,

      toastShown: false,
      isToastShown:isToastShown,
      toastShow : toastShow,
      toastHide : toastHide,

      setSideNavBar: setSideNavBar,
      getSideNavBar: getSideNavBar,
      sideNavBar : 'profile',
    };

    return Layout;

    function detectScreenOrientation() {
       return $mdMedia('portrait');
    }

    function detectMdScreen(){
       return $mdMedia('md');
    }

    function detectGtMdScreen(){
       return $mdMedia('gt-md');
    }

    function setUserAcceptedCookies(){
       $cookies.userAcceptedCookies = 'true';
       window.localStorage.setItem('userAcceptedCookies','true');
       Layout.cookiesAcceptedForSession = true;
    }

    function getUserAcceptedCookies(){
       var storage = window.localStorage.getItem('userAcceptedCookies');
       if (Layout.cookiesAcceptedForSession || storage || $cookies.userAcceptedCookies) {
          return true;
       }
       return false;
    }

    function isToastShown(){
       return Layout.toastShown;
    }

    function toastShow(){
      Layout.toastShown = true;
    }

    function toastHide(){
      Layout.toastShown = false;
    }

    function setSideNavBar(item){
       if( Layout.sideNavBar!==item ){
          Layout.sideNavBar=item;
       }
    }

    function getSideNavBar(){
        return Layout.sideNavBar;
    }
  }
})();