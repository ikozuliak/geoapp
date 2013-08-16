(function (window) {

    'use strict';

    function Model() {
        this.data = [
        ];
    }

    Model.prototype.getData = function () {
        return this.data;
    };

    Model.prototype.getContent = function (id) {
        return this.data[id].content;
    };

    window.app.Model = Model;
})(window);
