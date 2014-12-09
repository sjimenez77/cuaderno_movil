/* global appControllers */
'use strict';

appControllers.controller('HomeCtrl',[
    '$window',
    'USER_ROLES',
    'AuthService',
    function($window, USER_ROLES, AuthService) {
        // Go to signup template
        this.goSignUp = function() {
            console.log('Sign up');
            // this.closeLogin();
            $window.location.href = '#/app/signup';
        };
    }
]);