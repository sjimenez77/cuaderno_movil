/* global appControllers */
'use strict';

appControllers.controller('SignUpCtrl',[
    '$scope',
    '$ionicNavBarDelegate',
    function($scope, $ionicNavBarDelegate) {
        // Initialize sign up data
        $scope.signUpData = {};
        
        // Get the previous title
        $scope.getPreviousTitle = function() {
            var prevTitle = $ionicNavBarDelegate.getPreviousTitle();
            console.log('Título anterior:', prevTitle);
            return prevTitle;
        };
        
        $scope.doSignUp = function () {
            // TODO: Sign up in the service
            console.log($scope.signUpData);
            
        };
    }
]);