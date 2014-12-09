/* global appControllers */
'use strict';

appControllers.controller('AppCtrl',[
    '$scope',
    '$window',
    '$ionicModal',
    '$timeout',
    '$ionicNavBarDelegate',
    'USER_ROLES',
    'AuthService',
    function($scope, $window, $ionicModal, $timeout, $ionicNavBarDelegate, USER_ROLES, AuthService) {
        // Form data for the login modal
        this.modal = null;
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
            self.modal = modal;
        });

        // Triggered in the login modal to close it
        this.closeLogin = function() {
            this.modal.hide();
            this.errorMessages = [];
        };
    
        // Open the login modal
        this.showLogin = function() {
            this.modal.show();
        };
        
        // Open the login modal
        this.logout = function() {
            // TODO: Logout in the service
        };

        // Perform the login action when the user submits the login form
        this.doLogin = function() {
            this.errorMessages = [];

            if (this.loginData.username === undefined ||
                this.loginData.username === '' ||
                this.loginData.password === undefined ||
                this.loginData.password.length < 6) {
                // Errors
                if (this.loginData.username === undefined || this.loginData.username === '')
                    this.errorMessages.push('El nombre de usuario no puede estar vacío');
                if (this.loginData.password === '' || this.loginData.password === undefined)
                    this.errorMessages.push('La contraseña no puede estar vacía');
                if (this.loginData.password !== undefined && this.loginData.password.length < 6)
                    this.errorMessages.push('La contraseña no puede tener menos de 6 caracteres');
            } else {
                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function() {
                    self.closeLogin();
                }, 1000);
            }

            // TODO: Login in the service
            console.log('Doing login', this.loginData);
        };

        this.hideLoginErrors = function() {
            this.errorMessages = [];
        };

        // Go to signup template
        this.goSignUp = function() {
            console.log('Sign up');
            $window.location.href = '#/app/signup';
        };

        // Copy 'this' object to access their methods or variables
        var self = this;
    }
]);