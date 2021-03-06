/* global appControllers */
'use strict';

appControllers.controller('ParcelasCtrl', [
    '$scope',
    '$filter',
    '$ionicListDelegate',
    '$ionicLoading',
    'Session',
    'Parcelas',
    'Places',
    'Collection',
    '$ionicModal',
    '$ionicPopup',
    function($scope, $filter, $ionicListDelegate, $ionicLoading, Session, Parcelas, Places, Collection, $ionicModal, $ionicPopup) {

        var self = this;

        // Default filter for server
        self.filtro = {};	// Not used now
        self.sort = {};		// Not used now

        // Data for selectors
        console.log('Collections:', Collection);
        self.cultivos = Collection.cultivos;
        self.ccaa = Collection.ccaa;
        self.provincias = Collection.provincias;
        self.poblaciones = Collection.poblaciones;
        self.clasificaciones = Collection.clasificaciones;

        // Array of parcelas
        self.listado = [];

        // Create the filter modal that we will use later
        $ionicModal.fromTemplateUrl('templates/filter_parcelas.html', {
            scope: $scope
        }).then(function(modal) {
            self.modalFilterParcelas = modal;
        });

        // Parcelas from service
        self.getParcelasFromServer = function() {
            $ionicLoading.show({ 
                template: '<ion-spinner icon="spiral" class="spinner-energized"></ion-spinner><br /><br /><span class="energized">{{ "LOADING"|translate }}...</span>'
            });

            Parcelas.getParcelas(Session.id, Session.userRole, self.filtro)
                .then(
                    // Success callback
                    function(res) {
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
                                console.log('Collections after loading parcelas:', Collection);
                            }

                            if (res.data.success && (parseInt(res.data.total, 10) === 0)) {
                                // Sin parcelas
                                console.log('Sin parcelas...');
                            }
                        }

                        // Hide loading
                        $ionicLoading.hide();
                    },
                    // Error callback
                    function(error) {
                        var alertPopup = $ionicPopup.alert({
                            title: '<i class="ion-alert-circled"></i> Error',
                            subTitle: 'Ha sido imposible acceder al servicio',
                            template: '<strong><i class="ion-arrow-right-b"></i> Respuesta ' + error.status + ':</strong> ' + error.statusText + '<br><span class="assertive"><i class="ion-arrow-right-b"></i> Por favor, inténtelo de nuevo más tarde...</span>',
                            okText: 'Entendido',
                        });

                        // Hide loading
                        $ionicLoading.hide();

                        alertPopup.then(function(res) {
                            console.log('Login Response: ', error);
                        });
                    }
            	)
                .finally(function() {
                    // Stop the ion-refresher from spinning
                    $scope.$broadcast('scroll.refreshComplete');
                    // Reinitialize filter
                    self.filterData = {};
                    Parcelas.setFilter({});
                });
        };

        // Get parcelas from Collection by default unless the first time
        self.getParcelas = function() {
            if (Collection.parcelas.length === 0) {
                self.getParcelasFromServer();
            } else {
                self.listado = Collection.parcelas;
            }
        };

        // Item remove with confirmation popup
        self.removeParcela = function(parcelaId) {
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
                    // Confirm remove
                    var found = $filter('filter')(Collection.parcelas, {
                        id: parcelaId
                    }, true);
                    if (found.length) {

                        // TODO: Remove from server
                        // Parcelas.removeParcela(Session.id, Session.userRole, parcelaId)
                        // .then(
                        // 	function(res) {},
                        // 	function(error) {}
                        // );

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

        // Triggered in the filter modal to close it
        self.closeFilterDialog = function() {
            self.modalFilterParcelas.hide();
        };

        // Show the filter modal dialog
        self.showFilterDialog = function() {
            self.modalFilterParcelas.show();
        };

        // Filter function
        self.doFilter = function(filterData) {
        	// Set the filter in service in order to remember it
        	Parcelas.setFilter(filterData);

            var found = $filter('filter')(Collection.parcelas, filterData, false);
            self.listado = found;
            self.modalFilterParcelas.hide();
        };

        // Remove the filter and show all items
        self.removeFilter = function() {
            self.filterData = {};
            Parcelas.setFilter({});
            // Show all items
            self.listado = Collection.parcelas;
            self.modalFilterParcelas.hide();
        };

        self.toggleAll = function() {
        	var checked = Parcelas.getCheck();
            if (checked) {
	            angular.forEach(self.listado, function(parcela) {
	                parcela.isChecked = !checked;
	                Parcelas.spliceSelected(parcela.id);
	            });
	        } else {
	            angular.forEach(self.listado, function(parcela) {
	                parcela.isChecked = !checked;
                	Parcelas.pushSelected(parcela.id);
	            });
            }
            // Toggle the control check
            Parcelas.toggleCheck();
        };

        // Add or remove item id in the factory array of selected items
        self.toggleSelected = function (selected, parcelaId) {
        	if (selected) {
        	   	Parcelas.pushSelected(parcelaId);
        	} else {
        		Parcelas.spliceSelected(parcelaId);
        	}
        };

        self.getItemHeight = function(item, index) {
            // Make evenly indexed items be 10px taller, for the sake of example
            // return (index % 2) === 0 ? 50 : 60;
            return 70;
        };

        self.closeOptions = function() {
            $ionicListDelegate.closeOptionButtons();
        };

        // First load
        self.getParcelas();

        // Set local filter
        self.filterData = Parcelas.getFilter();
        if (self.filterData !== {}) {
        	var found = $filter('filter')(Collection.parcelas, self.filterData, false);
        	self.listado = found;
        }
    }
]);