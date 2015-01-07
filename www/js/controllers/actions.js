/* global appControllers */
'use strict';

appControllers.controller('ActionsCtrl', [
    'Parcelas',
    'Collection',
    function(Parcelas, Collection) {
    	this.totalSelected = Parcelas.countSelected();
    }
]);