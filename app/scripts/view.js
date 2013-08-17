(function (window) {
    'use strict';

    function View(model) {

    }

    View.prototype = {

        _renderSearchResults:function () {

            if (this.imageSearch.results && this.imageSearch.results.length > 0) {

                if (this.searchPage == 1) {
                    this.imgColLeft = document.createElement('div');
                    this.imgColRight = document.createElement('div');

                    this.resultsWrapper.appendChild(this.imgColLeft);
                    this.resultsWrapper.appendChild(this.imgColRight);
                }

                var results = this.imageSearch.results;

                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    var imgContainer = document.createElement('div');

                    var newImg = document.createElement('img');

                    newImg.onload = function () {
                        this.style.opacity = 1;
                    };

                    newImg.src = result.url;

                    imgContainer.appendChild(newImg);

                    (i % 2 == 0) ? this.imgColLeft.appendChild(imgContainer) : this.imgColRight.appendChild(imgContainer);

                }

            }

            this._showSearchResults();

        }
    }


    window.app.View = View;
})(window);


