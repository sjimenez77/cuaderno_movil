/* global appServices */
'use strict';

appServices.factory('Parcelas', [
    '$http',
    'SERVER_ADDRESS',
    function($http, SERVER_ADDRESS) {
        var parcelas = {};
        var selected = [];

        // Push parcela id in the selected items array
        parcelas.pushSelected = function(parcelaId) {
            selected.push(parcelaId);
        };

        // Splice parcela id from selected items array
        parcelas.spliceSelected = function(parcelaId) {
            var index = selected.indexOf(parcelaId);
            if (index) {
                selected.splice(index, 1);
            }
        };

        // Return total number of selected items
        parcelas.countSelected = function () {
            return selected.length;
        };

        // Initialize selected items array
        parcelas.selectNone = function() {
            parcelas.selected = [];
        };

        // Get items from server
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

        // Remove a parcela item in the server
        parcelas.removeParcela = function(sessionId, sessionRole, parcelaId) {
            var data = {
                session_id: sessionId,
                session_role: sessionRole,
                task: 'API_ELIMINA_PARCELA'
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