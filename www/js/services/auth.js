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
            return $http({
                        url: SERVER_ADDRESS.host,
                        method: "POST",
                        data: credentials,
                        withCredentials: false,
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8'
                        }
                    })
                .then(
                    // Success callback
                    function (res) {
                        console.log('Res:', res);
                        if (res.data.failure !== undefined && res.data.failure) {
                            return false;
                        } else {
                            if (res.data.success) {
                                Session.create(res.data.id, res.data.user.id, res.data.user.role);
                                return res.data.user;
                            }
                        }
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
                            title: '<i class="ion-alert-circled"></i> Error',
                            subTitle: 'Ha sido imposible acceder al servicio',
                            template: '<strong><i class="ion-arrow-right-b"></i> Respuesta ' + error.status + ':</strong> ' + error.statusText + '<br><br><span class="assertive"><i class="ion-arrow-right-b"></i> Por favor, inténtelo de nuevo más tarde...</span>',
                            okText: 'Entendido',
                        });

                        alertPopup.then(function(res) {
                            console.log('Login error object: ', error);
                        });
                    }
                );
        };

        authService.logout = function () {
            Session.destroy();
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