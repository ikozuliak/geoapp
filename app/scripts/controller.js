(function (window) {
    'use strict';

    function Controller(view, model, options) {

        this.view = view;
        this.model = model;


    }

    Controller.prototype = {

        _init:function () {

            this.searchPage = 1;

            this.resultsWrapper = document.getElementById('search-results');
            this.mapWrapper = document.getElementById('map-container');
            this.searchInput = document.getElementById('search-input');

            this._initMap();
            this._initSearch();
            this._initEvents();
        },

        _initMap:function () {
            var self = this;
            this.geocoder = new google.maps.Geocoder();

            var styles = [
                {
                    stylers:[
                        { hue:"#fe4400" }
                    ]
                },
                {
                    "featureType":"water",
                    "stylers":[
                        { "color":"#1b2430" }
                    ]
                }
            ];

            var mapOptions = {
                zoom:8,
                center:new google.maps.LatLng(-34.397, 150.644),
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                styles:styles
            };

            this.map = new google.maps.Map(
                this.mapWrapper,
                mapOptions);

            this.autocomplete = new google.maps.places.Autocomplete(this.searchInput);

            this.autocomplete.bindTo('bounds', this.map);

            var marker = new google.maps.Marker({
                map: self.map
            });

        },

        _initSearch:function () {

            this.imageSearch = new google.search.ImageSearch();
            this.imageSearch.setRestriction(
                google.search.ImageSearch.RESTRICT_IMAGESIZE,
                google.search.ImageSearch.IMAGESIZE_LARGE);
            this.imageSearch.setResultSetSize(8);

            this.imageSearch.setSearchCompleteCallback(
                this,
                this.view._renderSearchResults,
                null);
        },

        _initAutocomplete : function(){
            google.maps.event.addListener(this.autocomplete, 'place_changed', function() {

                marker.setVisible(false);
                self.searchInput.className = '';
                var place = self.autocomplete.getPlace();

                if (!place.geometry) {
                    self.searchInput.className = 'error';
                    return;
                }

                if (place.geometry.viewport) {
                    self.map.fitBounds(place.geometry.viewport);
                } else {
                    self.map.setCenter(place.geometry.location);
                    self.map.setZoom(17);  // Why 17? Because it looks good.
                }
                marker.setIcon(({
                    url: place.icon,
                    size: new google.maps.Size(71, 71),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(35, 35)
                }));

                marker.setPosition(place.geometry.location);
                marker.setVisible(true);

                var address = '';

                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''),
                        (place.address_components[1] && place.address_components[1].short_name || ''),
                        (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }
                google.maps.event.addListener(marker, 'click', function () {
                    self.imageSearch.execute(address);
                });

            });
        },


        _geoCoder:function () {

            var self = this;

            var address = this.searchInput.value;

            this.model._getGeoData(this.geocoder, address, geoCallback);

            function geoCallback(location) {

                self.map.setCenter(location);

                var marker = new google.maps.Marker({
                    map:self.map,
                    position:location,
                    animation:google.maps.Animation.DROP
                });

                google.maps.event.addListener(marker, 'click', function () {
                    self.imageSearch.execute(address);
                });
            }

        },

        _autoComplete : function(){



        },

        _initEvents:function () {

            var self = this;

//            this.events.addEventListener(
//                document.getElementById('geocoder'),
//                'change',
//                this._geoCoder,
//                this
//            )

            this.events.addEventListener(
                window,
                'scroll',
                this.events.onScroll,
                this
            )
        },

        events:{

            "addEventListener":function (element, eventName, eventHandler, scope) {
                var scopedEventHandler =
                    scope ? function (e) {
                        eventHandler.apply(scope, [e])
                    }
                        : eventHandler;

                if (document.addEventListener)
                    element.addEventListener(eventName, scopedEventHandler, false);
                else if (document.attachEvent)
                    element.attachEvent("on" + eventName, scopedEventHandler);
            },

            onScroll:function () {
                var scroll = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

                if ((scroll + document.documentElement.clientHeight) >= document.documentElement.scrollHeight) {
                    this.imageSearch.gotoPage(this.searchPage++);
                }
            }

        }

    }
    window.app.Controller = Controller;

})(window);