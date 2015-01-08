/* global angular appServices */
'use strict';

appServices.service('Collection', function () {
    // Create app collections
    this.parcelas = [];
    this.cultivos = [
    	{
    		id: '0',
    		name: 'VID',
    	},
    	{
    		id: '1',
    		name: 'TOMATE',
    	},
    	{
    		id: '2',
    		name: 'ARROZ',
    	},
    	{
    		id: '3',
    		name: 'PATATA',
    	},
    ];

    return this;
});