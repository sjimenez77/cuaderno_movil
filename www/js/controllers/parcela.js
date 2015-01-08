/* global appControllers */
'use strict';

appControllers.controller('ParcelaCtrl', [
    '$stateParams',
    '$location',
	'$filter',
	'$ionicPopup',
	'Parcelas',
    'Collection',
    function($stateParams, $location, $filter, $ionicPopup, Parcelas, Collection) {
    	// Data for selectors
    	// TODO: Get from server
    	this.cultivos = Collection.cultivos;
    	// Edit mode
    	this.blocked = true;
    	// Get the item
    	this.details = function(parcelaId) {
		    var found = $filter('filter')(Collection.parcelas, { id: parcelaId }, true);
		    if (found.length) {
		        return found[0];
		    } else {
		        return {};
		    }
		};

		this.data = this.details($stateParams.parcelaId);

		console.log('Parcela detalle:', this.data);
		
		// Toggle edit mode
		this.toggleEdit = function() {
			this.blocked = !this.blocked;
		};

		// Remove this item
		this.remove = function() {
			if (this.data !== {}) {
				// A confirm dialog
				var confirmPopup = $ionicPopup.confirm({
				    title: '<span class="assertive">Atención</span>',
				    subTitle: 'Borrará la parcela y apuntes asociados',
				    template: '¿Está seguro que quiere borrar esta parcela?',
				    cancelText: 'No',
				    cancelType: 'button-default',
				    okText: 'Borrar',
				    okType: 'button-assertive',
				});

				confirmPopup.then(function(res) {
				    if (res) {

				        // TODO: Remove from server
				        // Parcelas.removeParcela(Session.id, Session.userRole, parcelaId)
				        // .then(
				        // 	function(res) {},
				        // 	function(error) {}
				        // );

				        var index = Collection.parcelas.indexOf(self.data);
				        Collection.parcelas.splice(index, 1);
				        $location.path('/app/parcelas');

				    } else {
				        console.log('Remove Parcela canceled...');
				        $ionicListDelegate.closeOptionButtons();
				    }
				});
			}
		};

		var self = this;
    }
]);