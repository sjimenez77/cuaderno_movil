/* global appControllers */
'use strict';

appControllers.controller('ParcelasCtrl', [
    'Session',
    'Parcelas',
    '$ionicPopup',
    function(Session, Parcelas, $ionicPopup) {
    	// Default filter
    	this.filtro = {};
    	this.sort = {};
    	this.listado = [];

		// Parcelas from service        
        Parcelas.getParcelas(Session.id, Session.userRole, this.filtro)
        .then(
        	// Success callback
        	function (res) {
				console.log(res);
				if (res.data.success !== undefined && !res.data.success) {
				    var alertPopup = $ionicPopup.alert({
						title: '<i class="ion-alert-circled"></i> Error',
						subTitle: 'Se ha producido un error',
						template: '<strong><i class="ion-arrow-right-b"></i> Respuesta ' + res.status + ':</strong> ' + res.data.msg + '<br><span class="assertive"><i class="ion-arrow-right-b"></i> Por favor, inténtelo de nuevo más tarde...</span>',
						okText: 'Entendido',
				    });

				    alertPopup.then(function() {
						console.log('Response error: ', res);
				    });
				    return [];
				} else {
				    if (res.data.success && (parseInt(res.data.total, 10) > 0)) {
						self.listado = res.data.results;
				    }

				    if (res.data.success && (parseInt(res.data.total, 10) === 0)) {
						// Sin parcelas
						console.log('Sin parcelas...');
				    }
				}
	        },
            // Error callback
            function(error) {
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

        this.showFilterDialog = function() {
        	console.log('Mostrar filtrado!!!', this.listado);
        };

        this.toggleAll = function() {
        	angular.forEach(self.listado, function(parcela) {
        		parcela.isChecked = !parcela.isChecked;
        	});
        };

        this.getItemHeight = function(item, index) {
            // Make evenly indexed items be 10px taller, for the sake of example
            // return (index % 2) === 0 ? 50 : 60;
            return 70;
        };

        var self = this;
    }
]);
