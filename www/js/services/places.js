/* global appServices */
'use strict';

appServices.factory('Places', [
    '$http',
    'SERVER_ADDRESS',
    'Collection',
    function($http, SERVER_ADDRESS, Collection) {
        var places = {};                // Places        
        var filterData = {};            // Filter object

        // *** Local Methods ******************************************************************************************
        
        // Get Filter Data
        places.getFilter = function() {
            return filterData;
        };

        // Set Filter Data
        places.setFilter = function (filter) {
            filterData = filter;
        };

        // *** Server Methods *****************************************************************************************

        // Get items from server
        places.getCCAA = function(sessionId, sessionRole, filtro, sort) {
            var data = {
                filtro: filtro,
                sort: sort,
                session_id: sessionId,
                session_role: sessionRole,
                task: 'API_LISTA_COMUNIDADES'
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
            .success(function (data) {
                Collection.ccaa = data.results;
            })
            .error(function (error) {
                console.log('Error obtaining [ccaa]:', error);
            });
        };

        places.getProvincias = function(sessionId, sessionRole, filtro, sort) {
            var data = {
                filtro: filtro,
                sort: sort,
                session_id: sessionId,
                session_role: sessionRole,
                task: 'API_LISTA_PROVINCIAS'
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
            .success(function (data) {
                Collection.provincias = data.results;
            })
            .error(function (error) {
                console.log('Error obtaining [provincias]:', error);
            });
        };

        places.getPoblaciones = function(sessionId, sessionRole, filtro, sort) {
            var data = {
                filtro: filtro,
                sort: sort,
                session_id: sessionId,
                session_role: sessionRole,
                task: 'API_LISTA_POBLACIONES'
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
            .success(function (data) {
                Collection.poblaciones = data.results;
            })
            .error(function (error) {
                console.log('Error obtaining [poblaciones]:', error);
            });
        };

        return places;
    }
]);