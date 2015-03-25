/* global appServices */
'use strict';

appServices.factory('Parcelas', [
    '$http',
    'Places',
    'SERVER_ADDRESS',
    function($http, Places, SERVER_ADDRESS) {
        var parcelas = {};                  // Parcelas 
        var selected = [];                  // Array of selected items
        var allChecked = false;             // Flag for toggle check button
        var filterData = {};                // Filter object

        // *** Local Methods ******************************************************************************************
        
        // Toggle flag
        parcelas.toggleCheck = function () {
            allChecked = !allChecked;
        };

        // Get flag value
        parcelas.getCheck = function() {
            return allChecked;
        };

        // Push parcela id in the selected items array
        parcelas.pushSelected = function(parcelaId) {
            var index = selected.indexOf(parcelaId);
            if (index < 0) {
                selected.push(parcelaId);
            }
        };

        // Splice parcela id from selected items array
        parcelas.spliceSelected = function(parcelaId) {
            var index = selected.indexOf(parcelaId);
            if (index >= 0) {
                selected.splice(index, 1);
            }
        };

        // Get Filter Data
        parcelas.getFilter = function() {
            return filterData;
        };

        // Set Filter Data
        parcelas.setFilter = function (filter) {
            filterData = filter;
        };

        // Return total number of selected items
        parcelas.countSelected = function () {
            return selected.length;
        };

        // Initialize selected items array
        parcelas.selectNone = function() {
            parcelas.selected = [];
        };

        // *** Server Methods *****************************************************************************************

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
            })
            .success(function (res) {
                // Get common data
                Places.getCCAA();
                Places.getProvincias();
                Places.getPoblaciones();
            })
            .error(function(error) {
                console.log('Error parcelas service:', error);
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