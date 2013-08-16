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


            this._initMap();

            this._initEvents();
        },

        _initMap: function(){

            this.geocoder = new google.maps.Geocoder();

            var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(-34.397, 150.644),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            this.map = new google.maps.Map(document.getElementById('map-container'),
                mapOptions);
        },

        _initSearch : function(){

            this.imageSearch = new google.search.ImageSearch();
            this.imageSearch.setRestriction(
                google.search.ImageSearch.RESTRICT_IMAGESIZE,
                google.search.ImageSearch.IMAGESIZE_Medium);
            this.imageSearch.setSearchCompleteCallback(this, searchComplete, null);

            this.imageSearch.execute("Wroclaw");

        },

        _onSearchComplete : function(){
            if (this.imageSearch.results && this.imageSearch.results.length > 0) {

                var contentDiv = document.getElementById('search-results');
                contentDiv.innerHTML = '';

                var results = this.imageSearch.results;
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var imgContainer = document.createElement('div');
                    var title = document.createElement('div');

                    title.innerHTML = result.titleNoFormatting;
                    var newImg = document.createElement('img');

                    newImg.src=result.url;
                    imgContainer.appendChild(title);
                    imgContainer.appendChild(newImg);

                    contentDiv.appendChild(imgContainer);
                }
            }
        },


        _geoCoder : function(){

            var self = this;

            var address = document.getElementById('geocoder').value;

            this.geocoder.geocode( { 'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    self.map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: self.map,
                        position: results[0].geometry.location,
                        title : "test",
                        animation: google.maps.Animation.DROP
                    });

                    console.log(marker)
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });

        },

        _initEvents:function () {

            var self = this;

            document.getElementById('geocoder').addEventListener('change', function(){
                self._geoCoder();
                console.log(document.getElementById('geocoder').value);
            })

        }
    }
    window.app.Controller = Controller;

})(window);