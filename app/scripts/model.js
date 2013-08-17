(function (window) {

    'use strict';

    function Model() {
        this.data = [
        ];
    }

    Model.prototype  = {
        _getGeoData : function(geocoder, address, callback){
            geocoder.geocode({ 'address':address}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    callback(results[0].geometry.location);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }

    Model.prototype.getData = function () {
        return this.data;
    };

    Model.prototype.getContent = function (id) {
        return this.data[id].content;
    };

    window.app.Model = Model;
})(window);
