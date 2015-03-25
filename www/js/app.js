/* global app:true angular cordova StatusBar USER_ROLES */
'use strict';

// Ionic Cuaderno de Campo App

var app = angular.module('cuaderno', [
    'ionic',
    'cuaderno.controllers',
    'cuaderno.services',
    'cuaderno.utils',
    'ngCordova',
    'pascalprecht.translate'
])

// Server Host
.constant('SERVER_ADDRESS', {
    host: 'http://192.168.1.21/cuadernov2/cuadernov2/app/api/io.php'
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
    admin: 'A',
    distribuidor: 'D',
    cooperativa: 'C',
    productor: 'P',
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

.run(function($localStorage, Session) {
    // Create session if it is stored
    var sessionStored = $localStorage.getObject('session');
    if (!angular.equals(sessionStored, {})) {
        console.log('Session stored:', sessionStored);
        Session.create(sessionStored.id, sessionStored.userId, sessionStored.userRole);
    }
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
    
    .state('app.help', {
        url: "/help",
        views: {
            'menuContent' :{
                templateUrl: "templates/help.html",
                controller: 'HelpCtrl as help'
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
            authorizedRoles: [USER_ROLES.distribuidor, USER_ROLES.cooperativa, USER_ROLES.productor]
        }
    })
    
    .state('app.parcela', {
        url: "/parcelas/:parcelaId",
        views: {
            'menuContent' :{
                templateUrl: "templates/parcela.html",
                controller: 'ParcelaCtrl as parcela'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.distribuidor, USER_ROLES.cooperativa, USER_ROLES.productor]
        }
    })

    
    .state('app.actions', {
        url: "/actions",
        views: {
            'menuContent' :{
                templateUrl: "templates/actions.html",
                controller: 'ActionsCtrl as actions'
            }
        },
        data: {
            authorizedRoles: [USER_ROLES.distribuidor, USER_ROLES.cooperativa, USER_ROLES.productor]
        }
    });
        
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
})

// Translation enabled
.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        'BACK': 'Back',
        'OPTIONS': 'Options',
        'LOADING': 'Loading',
        'REMOVE': 'Remove',
        'A': 'Administrator',
        'D': 'Distributor',
        'C': 'Cooperative',
        'P': 'Productor'
    });
    
    $translateProvider.translations('es', {
        'BACK': 'Volver',
        'OPTIONS': 'Opciones',
        'LOADING': 'Cargando',
        'REMOVE': 'Borrar',
        'A': 'Administrador',
        'D': 'Distribuidor',
        'C': 'Cooperativa',
        'P': 'Productor'
    });
    
    $translateProvider.preferredLanguage('es');
}]);

// Modules instantiation
var appControllers = angular.module('cuaderno.controllers', []);
var appServices = angular.module('cuaderno.services', []);
var appUtils = angular.module('cuaderno.utils', []);