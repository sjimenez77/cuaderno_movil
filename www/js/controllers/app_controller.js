/* global appControllers */
'use strict';

appControllers.controller('AppCtrl',[
    '$scope',
    '$window',
    '$ionicModal',
    '$timeout',
    '$ionicNavBarDelegate',
    '$ionicPopup',
    '$cordovaProgress',
    'USER_ROLES',
    'AuthService',
    function($scope, $window, $ionicModal, $timeout, $ionicNavBarDelegate, $ionicPopup, $cordovaProgress, USER_ROLES, AuthService) {
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
            this.loginData = {};
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
                    this.errorMessages.push('Nombre de usuario vacío');
                if (this.loginData.password === '' || this.loginData.password === undefined)
                    this.errorMessages.push('Contraseña vacía');
                if (this.loginData.password !== undefined && this.loginData.password.length < 6)
                    this.errorMessages.push('Contraseña menor de 6 caracteres');

                this.showLoginErrors();
            } else {
                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                this.loginData.task = 'mobile_login';
                AuthService.login(this.loginData);
            }

            // TODO: Login in the service
            console.log('Doing login', this.loginData);
        };

        // An alert dialog with the login errors
        this.showLoginErrors = function() {
            var templateString = '<label>';
            angular.forEach(this.errorMessages, function(key, value) {
                templateString += '<p class="assertive"><i class="ion-star" data-pack="default"></i> ' + key + '</p>';
            });
            templateString += '</label>';
            
            var alertPopup = $ionicPopup.alert({
                title: 'Errores encontrados',
                subTitle: 'Revise los siguientes errores',
                template: templateString,
                okText: 'Entendido',
            });

            alertPopup.then(function(res) {
                console.log(self.errorMessages);
            });
        };

        // Go to signup template
        this.goSignUp = function() {
            $window.location.href = '#/app/signup';
        };

        // Copy object 'this' to access their methods or variables
        // in other js scopes
        var self = this;
    }
]);