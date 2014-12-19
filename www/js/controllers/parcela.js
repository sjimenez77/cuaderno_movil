/* global appControllers */
'use strict';

appControllers.controller('ParcelaCtrl', [
    '$stateParams',
	'$filter',
    'Collection',
    function($stateParams, $filter, Collection) {
    	// parcelaId param
    	this.parcelaId = $stateParams.parcelaId;
    	// Edit mode
    	this.blocked = true;
    	// Get the item
    	this.details = function() {
		    var found = $filter('filter')(Collection.parcelas, { id: this.parcelaId }, true);
		    if (found.length) {
		        return found[0];
		    } else {
		        return false;
		    }
		};

		console.log('Parcela detalle:', this.details());
		
		// Toggle edit mode
		this.toggleEdit = function() {
			this.blocked = !this.blocked;
		};
    }
]);