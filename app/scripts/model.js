(function (window) {

    'use strict';

    function Model() {

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

    window.app.Model = Model;
})(window);
