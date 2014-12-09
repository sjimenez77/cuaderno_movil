/* global appControllers */
'use strict';

appControllers.controller('AppCtrl',[
    '$window',
    '$ionicModal',
    '$timeout',
    '$ionicNavBarDelegate',
    'USER_ROLES',
    'AuthService',
    function($window, $ionicModal, $timeout, $ionicNavBarDelegate, USER_ROLES, AuthService) {
        // Form data for the login modal
        this.loginData = {};
        
        // User
        this.currentUser = null;
        this.userRoles = USER_ROLES;
        this.isAuthorized = AuthService.isAuthorized;
        
        this.setCurrentUser = function (user) {
            this.currentUser = user;
        };
    
        // Open the login modal
        this.logout = function() {
            // TODO: Logout in the service
        };
    
        // Go to signup template
        this.goSignUp = function() {
            console.log('Sign up');
            $window.location.href = '#/app/signup';
        };
    }
]);