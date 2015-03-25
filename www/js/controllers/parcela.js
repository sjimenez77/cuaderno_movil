/* global appControllers */
'use strict';

appControllers.controller('ParcelaCtrl', [
	'$window',
    '$stateParams',
    '$location',
	'$filter',
	'$ionicPopup',
	'Parcelas',
    'Collection',
    function($window, $stateParams, $location, $filter, $ionicPopup, Parcelas, Collection) {
		
		var self = this;

    	// Data for selectors
    	self.cultivos = Collection.cultivos;
    	self.ccaa = Collection.ccaa;
    	self.provincias = Collection.provincias;
    	self.poblaciones = Collection.poblaciones;

    	// Edit mode
    	self.blocked = true;
    	// Get the item
    	self.details = function(parcelaId) {
		    var found = $filter('filter')(Collection.parcelas, { id: parcelaId }, true);
		    if (found.length) {
		        return found[0];
		    } else {
		        return {};
		    }
		};

		self.data = self.details($stateParams.parcelaId);

		console.log('Parcela detalle:', self.data);
		
		// Toggle edit mode
		self.toggleEdit = function() {
			self.blocked = !self.blocked;
		};

		// Get SigPac visor link
		self.viewSigPac = function (e, sigpac) {
			e.preventDefault();
            var sigpacArray = sigpac.split(':');
            console.log('SigPac Array:', sigpacArray);
            $window.open(
                'http://sigpac.magrama.es/fega/ServiciosVisorSigpac/PrintDocument.aspx?layer=recinto&id=' + sigpacArray[0] + ',' + sigpacArray[1] + ',' + sigpacArray[2] + ',' + sigpacArray[3] + ',' + sigpacArray[4] + ',' + sigpacArray[5] + ',' + sigpacArray[6] + '&visibleLayers=recinto;recinto;arboles&etiquetas=true',
                '_blank', // <- This is what makes it open in a new window.
                'location=yes'
            );
        };

		// Remove this item
		self.remove = function() {
			if (self.data !== {}) {
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
				    }
				});
			}
		};
    }
]);