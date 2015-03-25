/* global appControllers angular */
'use strict';

appControllers.controller('AppCtrl',[
    '$scope',
    '$rootScope',
    '$window',
    '$ionicModal',
    '$timeout',
    '$ionicNavBarDelegate',
    '$ionicPopup',
    '$cordovaProgress',
    '$localStorage',
    '$state',
    'USER_ROLES',
    'AUTH_EVENTS',
    'AuthService',
    function($scope, $rootScope, $window, $ionicModal, $timeout, $ionicNavBarDelegate, $ionicPopup, $cordovaProgress, $localStorage, $state, USER_ROLES, AUTH_EVENTS, AuthService) {
        // Form data for the modals
        this.modalLogin = null;
        this.modalContact = null;
        this.loginData = {};
        this.contactData = {};
        
        // User
        this.currentUser = null;
        var userStored = $localStorage.getObject('user');        
        if (!angular.equals(userStored, {})) {
            console.log('User stored:', userStored);
            this.currentUser = userStored;
        }

        this.userRoles = USER_ROLES;
        this.isAuthorized = AuthService.isAuthorized;
        
        this.setCurrentUser = function (user) {
            this.currentUser = user;
        };

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            self.modalLogin = modal;
        });

        // Create the contact modal that we will use later
        $ionicModal.fromTemplateUrl('templates/contact.html', {
            scope: $scope
        }).then(function(modal) {
            self.modalContact = modal;
        });

        // Triggered in the login modal to close it
        this.closeLogin = function() {
            this.modalLogin.hide();
            this.errorMessages = [];
        };
    
        // Open the login modal
        this.showLogin = function() {
            this.loginData = {};
            this.modalLogin.show();
        };

        // Triggered in the contact modal to close it
        this.closeContact = function() {
            this.modalContact.hide();
            this.errorMessages = [];
        };
    
        // Open the contact modal
        this.showContact = function() {
            this.contactData = {};
            this.modalContact.show();
        };
        
        // Logout and go home
        this.logout = function() {
            // A confirm dialog
            var confirmPopup = $ionicPopup.confirm({
                title: '<span class="assertive">Atención</span>',
                subTitle: 'Deberá introducir de nuevo su usuario y contraseña para entrar',
                template: '<div style="width: 100%; text-align:center"><h4>¿Está seguro que<br>quiere cerrar su sesión?</h4></div>',
                cancelText: 'No',
                cancelType: 'button-default',
                okText: 'Salir',
                okType: 'button-assertive',
            });

            confirmPopup.then(function(res) {
                if (res) {
                    // Confirm logout
                    AuthService.logout();
                    self.currentUser = null;
                    // Go home
                    $window.location.href = '#/app/home';
                } else {
                    console.log('Logout canceled...');
                }
            });
        };

        // Perform the login action when the user submits the login form
        this.doLogin = function() {
            var errors = false;
            this.errorMessages = [];

            // Possible errors
            if (this.loginData.username === undefined || this.loginData.username === '') {
                this.errorMessages.push('Nombre de usuario vacío');
                errors = true;
            }

            if (this.loginData.password === '' || this.loginData.password === undefined) {
                this.errorMessages.push('Contraseña vacía');
                errors = true;
            }

            if (this.loginData.password !== undefined && this.loginData.password.length < 6) {
                this.errorMessages.push('Contraseña menor de 6 caracteres');
                errors = true;
            }

            if (errors) {
                this.showErrors();
            } else {
                // Login
                this.loginData.task = 'mobile_login';
                AuthService.login(this.loginData);
            }
        };

        // Perform the contact action when the user submits the contact form
        this.doContact = function() {
            var errors = false;
            this.errorMessages = [];

            // Possible errors
            if (this.contactData.email === undefined || this.contactData.email === '') {
                this.errorMessages.push('Email vacío');
                errors = true;
            }

            if (this.contactData.subject === '' || this.contactData.subject === undefined) {
                this.errorMessages.push('Asunto vacío');
                errors = true;
            }

            if (this.contactData.message === '' || this.contactData.message === undefined) {
                this.errorMessages.push('Mensaje vacío');
                errors = true;
            }

            if (errors) {
                this.showErrors();
            } else {
                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                this.contactData.task = 'mobile_contact';
                // TODO: Send contact data to server
            }
        };

        // An alert dialog with the login errors
        this.showErrors = function() {
            var templateString = '<label>';
            angular.forEach(this.errorMessages, function(key, value) {
                templateString += '<p class="assertive"><i class="ion-arrow-right-b" data-pack="default"></i> ' + key + '</p>';
            });
            templateString += '</label>';
            
            var alertPopup = $ionicPopup.alert({
                title: '<i class="ion-alert-circled"></i> Errores encontrados',
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
            $state.go('app.signup');
        };

        // Go to parcelas template
        this.goParcelas = function() {
            $window.location.href = '#/app/parcelas';
        };

        // Events
        $scope.$on(AUTH_EVENTS.loginFailed, function( event ) {
            console.log('Login failed...');
        });

        $scope.$on(AUTH_EVENTS.loginSuccess, function( event ) {
            self.closeLogin();
            self.setCurrentUser($localStorage.getObject('user'));
        });

        // Copy object 'this' to access their methods or variables
        // in other js scopes
        var self = this;
    }
]);