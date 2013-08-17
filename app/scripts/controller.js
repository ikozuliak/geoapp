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

            this._initMap();
            this._initSearch();
            this._initEvents();
        },

        _initMap:function () {

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

            this.map = new google.maps.Map(this.mapWrapper,
                mapOptions);
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


        _geoCoder:function () {

            var self = this;

            var address = document.getElementById('geocoder').value;

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

        _initEvents:function () {

            var self = this;

            this.events.addEventListener(
                document.getElementById('geocoder'),
                'change',
                this._geoCoder,
                this
            )

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