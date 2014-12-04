/* global appControllers */
'use strict';

appControllers.controller('AppCtrl',[
    '$scope',
    '$window',
    '$ionicModal',
    '$timeout',
    function($scope, $window, $ionicModal, $timeout) {
        // Form data for the login modal
        $scope.loginData = {};
        
        // User
        $scope.user = {};
    
        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });
    
        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };
    
        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };
        
        // Open the login modal
        $scope.logout = function() {
            // TODO: Logout in the service
        };
    
        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);
            
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeLogin();
            }, 1000);
        };
        
        // Go to signup template
        $scope.goSignUp = function() {
            console.log('Sign up');
            $scope.modal.hide();
            $window.location.href = '#/app/signup';
        };
    }
]);