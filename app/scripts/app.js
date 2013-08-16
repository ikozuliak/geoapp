(function () {
    'use strict';

    function geoApp(options) {

        this.model = new app.Model();
        this.view = new app.View(this.model);
        this.controller = new app.Controller(this.view, this.model, options);

        this.controller._init();
    }

    var app = new geoApp();

})();