/* global angular appServices */
'use strict';

appServices.factory('AuthService', [
    '$http',
    'Session',
    '$rootScope',
    '$ionicPopup',
    '$ionicLoading',
    '$localStorage',
    'AUTH_EVENTS',
    'SERVER_ADDRESS',
    'Places',
    // '$cordovaProgress',
    function ($http, Session, $rootScope, $ionicPopup, $ionicLoading, $localStorage, AUTH_EVENTS, SERVER_ADDRESS, Places /*, $cordovaProgress */) {
        var authService = {};
 
        authService.login = function (credentials) {
            // TODO: Enable plugins when build app
            // $cordovaProgress.showSimpleWithLabel(true, "Loading");
            $ionicLoading.show({ 
                template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner><br /><br /><span class="energized">{{ "LOADING"|translate }}...</span>'
            });
            return $http({
                        url: SERVER_ADDRESS.host,
                        method: "POST",
                        data: credentials,
                        withCredentials: false,
                        headers: {
                            'Accept': 'application/x-www-form-urlencoded; application/json; charset=utf-8',
                            'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
                        }
                    })
                .then(
                    // Success callback
                    function (res) {
                        if (res.data.success !== undefined && !res.data.success) {
                            var alertPopup = $ionicPopup.alert({
                                title: '<i class="ion-alert-circled"></i> Credenciales incorrectas',
                                subTitle: 'Ha sido imposible acceder al servicio',
                                template: '<strong><i class="ion-arrow-right-b"></i> Respuesta ' + res.status + ':</strong> ' + res.data.msg + '<br><span class="assertive"><i class="ion-arrow-right-b"></i> Por favor, revise sus credenciales e inténtelo de nuevo más tarde...</span>',
                                okText: 'Entendido',
                            });

                            alertPopup.then(function() {
                                console.log('Login Response: ', res);
                            });

                            // Some error has happened 
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        } else {
                            if (res.data.success && (parseInt(res.data.total, 10) > 0)) {
                                console.log('Login Success: ', res);
                                Session.create(res.data.results[0].session_id, res.data.results[0].user, res.data.results[0].rol);

                                // Get common data
                                Places.getCCAA();
                                Places.getProvincias();
                                Places.getPoblaciones();
                                
                                // Persist Session and User objects
                                $localStorage.setObject('session', Session);
                                $localStorage.setObject('user', res.data.results[0]);
                                
                                // Broadcast login success event
                                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                            }

                            if (res.data.success && (parseInt(res.data.total, 10) === 0)) {
                                // Login incorrect
                                var alertPopup = $ionicPopup.alert({
                                    title: '<i class="ion-alert-circled"></i> Credenciales incorrectas',
                                    subTitle: 'Usuario y/o password incorrectos',
                                    template: '<span class="assertive"><i class="ion-arrow-right-b"></i> Por favor, revise sus credenciales e inténtelo de nuevo...</span>',
                                    okText: 'Entendido',
                                });

                                alertPopup.then(function() {
                                    console.log('Login Response: ', res);
                                });

                                // Some error has happened 
                                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                            }
                        }
                        /*
                        $cordovaProgress.hide();
                        // TODO: Check 
                        $cordovaProgress.showSuccess(true, "Success!");
                        $cordovaProgress.hide();
                        */
                       
                        // Hide loading
                        $ionicLoading.hide();
                    },
                    // Error callback
                    function (error) {
                        var alertPopup = $ionicPopup.alert({
                            title: '<i class="ion-alert-circled"></i> Error',
                            subTitle: 'Ha sido imposible acceder al servicio',
                            template: '<strong><i class="ion-arrow-right-b"></i> Respuesta ' + error.status + ':</strong> ' + error.statusText + '<br><span class="assertive"><i class="ion-arrow-right-b"></i> Por favor, inténtelo de nuevo más tarde...</span>',
                            okText: 'Entendido',
                        });

                        alertPopup.then(function(res) {
                            console.log('Login Response: ', error);
                        });
                    }
                );
        };

        authService.logout = function () {
            // Remove data form local storage
            $localStorage.removeItem('user');
            $localStorage.removeItem('session');
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
                return true;
            } else {
                // Access control
                return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
            }
        };
        
        return authService;
    }
]);