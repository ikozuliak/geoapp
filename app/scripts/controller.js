(function (window) {
    'use strict';

    function Controller(view, model, options) {

        this.view = view;
        this.model = model;

        this.defaultsSwap = new this._defaults;

        this.options = extendObject(this.defaultsSwap, options);

    }

    Controller.prototype = {

        _defaults:function () {
            return {
                value:''
            }
        },

        _init:function () {



            google.maps.event.addDomListener(window, 'load', this._initMap);


        },

        _initMap: function(){
            var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(-34.397, 150.644),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById('map-container'),
                mapOptions);
        },

        _initEvents:function () {


        }
    }
    window.app.Controller = Controller;

})(window);