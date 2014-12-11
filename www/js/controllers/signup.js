/* global appControllers */
'use strict';

appControllers.controller('SignUpCtrl',[
    '$window',
    '$timeout',
    '$ionicPopup',
    '$ionicNavBarDelegate',
    function($window, $timeout, $ionicPopup, $ionicNavBarDelegate) {
        // Initialize sign up data
        this.signUpData = {};
        
        // Get the previous title
        this.getPreviousTitle = function() {
            var prevTitle = $ionicNavBarDelegate.getPreviousTitle();
            console.log('Título anterior:', prevTitle);
            return prevTitle;
        };
        
        this.doSignUp = function() {
            var errors = false;
            this.errorMessages = [];

            // Possible errors
            if (this.signUpData.name === undefined || this.signUpData.name === '') {
                this.errorMessages.push('Nombre vacío');
                errors = true;
            }

            if (this.signUpData.surname === undefined || this.signUpData.surname === '') {
                this.errorMessages.push('Apellidos vacío');
                errors = true;
            }

            if (this.signUpData.email === undefined || this.signUpData.email === '') {
                this.errorMessages.push('Email vacío');
                errors = true;
            }

            if (this.signUpData.username === undefined || this.signUpData.username === '') {
                this.errorMessages.push('Nombre de usuario vacío');
                errors = true;
            }

            if (this.signUpData.password === '' || this.signUpData.password === undefined) {
                this.errorMessages.push('Contraseña vacía');
                errors = true;
            }

            if (this.signUpData.passwordRepeat === '' || this.signUpData.passwordRepeat === undefined) {
                this.errorMessages.push('Contraseña repetida vacía');
                errors = true;
            }

            if (this.signUpData.password !== undefined && this.signUpData.password !== '') {
                if (this.signUpData.password !== this.signUpData.passwordRepeat) {
                    this.errorMessages.push('Las contraseñas no son iguales');
                    errors = true;
                }
                if (this.signUpData.password.length < 6) {
                    this.errorMessages.push('Contraseña menor de 6 caracteres');
                    errors = true;
                }
            }

            if (errors) {
                // Show errors in the popup
                this.showSignUpErrors();
            } else {
                // Simulate a login delay. Remove this and replace with your login
                // code if using a login system
                $timeout(function() {
                    $window.location.href = '#/app/home';
                }, 1000);
            }

            // TODO: Sign up in the service
            console.log(this.signUpData);
            
        };

        // An alert dialog with the sign up errors
        this.showSignUpErrors = function() {
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

        // Copy object 'this' to access their methods or variables
        // in other js scopes
        var self = this;
    }
]);