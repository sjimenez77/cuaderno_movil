/* global app:true angular cordova StatusBar USER_ROLES */
'use strict';

// Ionic Cuaderno de Campo App

var app = angular.module('cuaderno', [
    'ionic',
    'cuaderno.controllers',
    'cuaderno.services',
    'ngCordova',
    'pascalprecht.translate'
])

// Server Host
.constant('SERVER_ADDRESS', {
    host: 'http://192.168.1.110'
})

// Auth events
.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
})

// User roles
.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    distribuidor: 'distribuidor',
    tecnico: 'tecnico',
    productor: 'productor',
    guest: 'guest'
})

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

.run(function ($rootScope, AUTH_EVENTS, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        if (!AuthService.isAuthorized(authorizedRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
                // user is not allowed
                console.log("User not authorized");
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            } else {
                // user is not logged in
                console.log("User not authenticated");
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl as app'
    })
    
    .state('app.home', {
        url: "/home",
        views: {
            'menuContent' :{
                templateUrl: "templates/home.html",
                controller: 'HomeCtrl as home'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.guest]
        }
    })
    
    .state('app.signup', {
        url: "/signup",
        views: {
            'menuContent' :{
                templateUrl: "templates/signup.html",
                controller: 'SignUpCtrl as signUp'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.guest]
        }
    })
    
    .state('app.parcelas', {
        url: "/parcelas",
        views: {
            'menuContent' :{
                templateUrl: "templates/parcelas.html",
                controller: 'ParcelasCtrl as parcelas'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.distribuidor, USER_ROLES.tecnico, USER_ROLES.productor]
        }
    })
    
    .state('app.parcela.single', {
        url: "/parcelas/:parcelaId",
        views: {
            'menuContent' :{
                templateUrl: "templates/parcela.html",
                controller: 'ParcelaCtrl as parcela'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.distribuidor, USER_ROLES.tecnico, USER_ROLES.productor]
        }
    });
        
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
})

// Translation enabled
.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        'BACK': 'Back',
        'OPTIONS': 'Options'
    });
    
    $translateProvider.translations('es', {
        'BACK': 'Volver',
        'OPTIONS': 'Opciones'
    });
    
    $translateProvider.preferredLanguage('es');
}]);

// Modules instantiation
var appControllers = angular.module('cuaderno.controllers', []);
var appServices = angular.module('cuaderno.services', []);