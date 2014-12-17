/* global appServices */
'use strict';

appServices.factory('Parcelas', [
    '$http',
    'SERVER_ADDRESS',
    function($http, SERVER_ADDRESS) {
        var parcelas = {};

        parcelas.getParcelas = function(sessionId, sessionRole, filtro, sort) {
            var data = {
            	filtro: filtro,
            	sort: sort,
            	session_id: sessionId,
            	session_role: sessionRole,
                task: 'API_LISTA_PARCELAS'
            };

            return $http({
                url: SERVER_ADDRESS.host,
                method: "POST",
                data: data,
                withCredentials: false,
                headers: {
                    'Accept': 'application/x-www-form-urlencoded; application/json; charset=utf-8',
                    'Content-Type': 'application/x-www-form-urlencoded; application/json; charset=utf-8'
                }
            });
        };

        return parcelas;
    }
]);