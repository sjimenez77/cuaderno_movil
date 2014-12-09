/* global appControllers */
'use strict';

appControllers.controller('HomeCtrl',[
    '$scope',
    '$window',
    '$ionicModal',
    '$timeout',
    '$ionicNavBarDelegate',
    'USER_ROLES',
    'AuthService',
    function($scope, $window, $ionicModal, $timeout, $ionicNavBarDelegate, USER_ROLES, AuthService) {
        // Form data for the login modal
        this.loginData = {};
        
        // User
        this.currentUser = null;
        this.userRoles = USER_ROLES;
        this.isAuthorized = AuthService.isAuthorized;
        
        this.setCurrentUser = function (user) {
            this.currentUser = user;
        };
    
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        this.closeLogin = function() {
            $scope.modal.hide();
        };
    
        // Open the login modal
        this.showLogin = function() {
            $scope.modal.show();
        };
        
        // Open the login modal
        this.logout = function() {
            // TODO: Logout in the service
        };
    
        // Perform the login action when the user submits the login form
        this.doLogin = function() {
            // TODO: Login in the service
            console.log('Doing login', this.loginData);
            
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                this.closeLogin();
            }, 1000);
        };
        
        // Go to signup template
        this.goSignUp = function() {
            console.log('Sign up');
            this.closeLogin();
            $window.location.href = '#/app/signup';
        };
    }
]);