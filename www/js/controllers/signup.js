/* global appControllers */
'use strict';

appControllers.controller('SignUpCtrl',[
    '$ionicNavBarDelegate',
    function($ionicNavBarDelegate) {
        // Initialize sign up data
        this.signUpData = {};
        
        // Get the previous title
        this.getPreviousTitle = function() {
            var prevTitle = $ionicNavBarDelegate.getPreviousTitle();
            console.log('Título anterior:', prevTitle);
            return prevTitle;
        };
        
        this.doSignUp = function () {
            // TODO: Sign up in the service
            console.log(this.signUpData);
            
        };
    }
]);