/* global app:true angular cordova StatusBar */
'use strict';

// Ionic Cuaderno de Campo App

var app = angular.module('cuaderno', ['ionic', 'cuaderno.controllers', 'cuaderno.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.signup', {
      url: "/signup",
      views: {
        'menuContent' :{
          templateUrl: "templates/signup.html"
        }
      }
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    .state('app.parcelas', {
      url: "/parcelas",
      views: {
        'menuContent' :{
          templateUrl: "templates/parcelas.html",
          controller: 'ParcelasCtrl'
        }
      }
    })

    .state('app.single', {
      url: "/parcelas/:parcelaId",
      views: {
        'menuContent' :{
          templateUrl: "templates/parcela.html",
          controller: 'ParcelaCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/parcelas');
});

// Modules instantiation
var appControllers = angular.module('cuaderno.controllers', []);
var appServices = angular.module('cuaderno.services', []);