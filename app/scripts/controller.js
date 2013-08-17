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

        _initEvents:function () {

            var self = this;

            this.events.addEventListener(
                window,
                'scroll',
                this.events.onScroll,
                this
            )
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
                center:new google.maps.LatLng(45.352145,32.915039),
                mapTypeId:google.maps.MapTypeId.ROADMAP,
                styles:styles
            };

            this.map = new google.maps.Map(
                this.mapWrapper,
                mapOptions);

            this.autocomplete = new google.maps.places.Autocomplete(this.searchInput);

            this.autocomplete.bindTo('bounds', this.map);
            this.autocomplete.setTypes(['geocode']);
            this._initAutocomplete();

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

            var self = this;

            google.maps.event.addListener(this.autocomplete, 'place_changed', function() {

                var marker = new google.maps.Marker({
                    map: self.map,
                    animation:google.maps.Animation.DROP
                });

                marker.setVisible(false);

                self._hideSearchResults();
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
                    self.map.setZoom(17);
                }

                marker.setPosition(place.geometry.location);
                marker.setVisible(true);

                google.maps.event.addListener(marker, 'click', function () {
                    self.imageSearch.execute(self.searchInput.value);
                });

            });
        },

        _hideSearchResults: function(){
            this.resultsWrapper.style.display = 'none';
            this.resultsWrapper.innerHTML = '';
            this.searchPage = 1;
        },

        _showSearchResults: function(){
            this.resultsWrapper.style.display = 'block';
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

                if ((scroll + document.documentElement.clientHeight) >= document.documentElement.scrollHeight - 100) {
                    this.imageSearch.gotoPage(this.searchPage++);
                }
            },

            _onImgClick:function(){
                this.parentNode.style.width = this.offsetWidth + 'px';
                this.parentNode.style.height = this.offsetHeight + 'px';
                (this.parentNode.className == 'zoom') ? this.parentNode.className = '' : this.parentNode.className = 'zoom';
            }
        }

    }
    window.app.Controller = Controller;

})(window);