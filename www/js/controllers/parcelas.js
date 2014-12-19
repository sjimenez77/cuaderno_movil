/* global appControllers */
'use strict';

appControllers.controller('ParcelasCtrl', [
	'$scope',
	'$filter',
	'$ionicListDelegate',
    'Session',
    'Parcelas',
    'Collection',
    '$ionicModal',
    '$ionicPopup',
    function($scope, $filter, $ionicListDelegate, Session, Parcelas, Collection, $ionicModal, $ionicPopup) {
    	// Default filter for server
    	this.filtro = {};
    	this.sort = {};

    	// Array of parcelas
    	this.listado = [];
    	
    	// Local filter
    	this.filterData = {};

    	// Create the filter modal that we will use later
        $ionicModal.fromTemplateUrl('templates/filter_parcelas.html', {
            scope: $scope
        }).then(function(modal) {
            self.modalFilterParcelas = modal;
        });

		// Parcelas from service
		this.getParcelasFromServer = function() {
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
							Collection.parcelas = res.data.results;
							console.log(Collection);
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
			)
			.finally(function () {
				// Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			});
		};

        // Get parcelas from Collection by default unless the first time
        this.getParcelas = function() {
        	if (Collection.parcelas.length === 0) {
	        	this.getParcelasFromServer();
        	} else {
        		this.listado = Collection.parcelas;
        	}
		};

		// Item remove with confirmation popup
		this.removeParcela = function(parcelaId) {
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
			        // Confirm logout
			        var found = $filter('filter')(Collection.parcelas, { id: parcelaId }, true);
			        if (found.length) {
			        	var index = Collection.parcelas.indexOf(found[0]);
			            Collection.parcelas.splice(index, 1);
			            self.listado = Collection.parcelas;
			            $ionicListDelegate.closeOptionButtons();
			        } else {
			            return false;
			        }
			    } else {
			        console.log('Remove Parcela canceled...');
			        $ionicListDelegate.closeOptionButtons();
			    }
			});
		};

		// First load
		this.getParcelas();

        // Triggered in the filter modal to close it
        this.closeFilterDialog = function() {
            this.modalFilterParcelas.hide();
        };
        
        this.showFilterDialog = function() {
            this.modalFilterParcelas.show();
        };

        this.doFilter = function() {
        	// TODO: Filter
        	var found = $filter('filter')(Collection.parcelas, this.filterData, false);
        	this.listado = found;
            this.modalFilterParcelas.hide();
        };

        // Remove the filter and show all items
        this.removeFilter = function() {
        	this.filterData = {};
        	this.listado = Collection.parcelas;
            this.modalFilterParcelas.hide();
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
