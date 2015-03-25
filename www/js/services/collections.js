/* global angular appServices */
'use strict';

appServices.service('Collection', function () {
    // Create app collections
    this.parcelas = [];
    this.cultivos = [];
    this.variedades = [];
    this.ccaa = [];
    this.provincias = [];
    this.poblaciones = [];
    this.clasificaciones = [
        { key: 'Convencional', value: 'CONVENCIONAL' },
        { key: 'Conversión', value: 'CONVERSIÓN' },
        { key: 'Ecológico', value: 'ECOLÓGICO' }
    ];

    return this;
});