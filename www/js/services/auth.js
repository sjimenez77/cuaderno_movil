/* global angular appServices */
'use strict';

appServices.factory('AuthService', [
    '$http',
    'Session',
    '$ionicPopup',
    'SERVER_ADDRESS',
    // '$cordovaProgress',
    function ($http, Session, $ionicPopup, SERVER_ADDRESS /*, $cordovaProgress */) {
        var authService = {};
 
        authService.login = function (credentials) {
            // TODO: Enable plugins when build app
            // $cordovaProgress.showSimpleWithLabel(true, "Loading");
            return $http
                .post(SERVER_ADDRESS.host + '/login', credentials)
                .then(
                    // Success callback
                    function (res) {
                        Session.create(res.data.id, res.data.user.id, res.data.user.role);
                        return res.data.user;
                        /*
                        $cordovaProgress.hide();
                        // TODO: Check 
                        $cordovaProgress.showSuccess(true, "Success!");
                        $cordovaProgress.hide();
                        */
                    },
                    // Error callback
                    function (error) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            subTitle: 'Ha sido imposible acceder al servicio',
                            template: '<strong>Respuesta ' + error.status + ':</strong> ' + error.statusText + '<br><br><span class="assertive">Por favor, inténtelo de nuevo más tarde...</span>',
                            okText: 'Entendido',
                        });

                        alertPopup.then(function(res) {
                            console.log('Login error object: ', error);
                        });
                    }
                );
        };
            
        authService.isAuthenticated = function () {
            return !!Session.userId;
        };
        
        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            if (authorizedRoles.indexOf('guest') !== -1) {
                // Guest access
                console.log('Guest access...');
                return true;
            } else {
                // Access control
                return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
            }
        };
        
        return authService;
    }
]);