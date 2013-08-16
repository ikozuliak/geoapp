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


        },

        _initEvents:function () {


        }
    }
    window.app.Controller = Controller;

})(window);