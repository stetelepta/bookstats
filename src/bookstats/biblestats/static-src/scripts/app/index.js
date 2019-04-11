(function () {
    "use strict";
    /*global document*/
    var ChatterPlot = require("./chatterplot.js"),
        app = {
            inputElm: document.querySelector('.input'),
            chartElm: document.querySelector('.chart'),
            chatterplot: undefined,
            /**
             * initialize new instance
             */
            initialize: function () {
                // console.log('app.initialize');
                this.addEventListeners();

                // initialize new chatterplot
                this.chatterplot = ChatterPlot.initialize(this.chartElm);
            
                // kick of with initial value
                this.chatterplot.load(this.inputElm.value);
            },
            /**
             * add all eventlisteners
             */
            addEventListeners: function () {
                this.inputElm.addEventListener('change', this.onInputChange.bind(this));
            },
            /**
             * event handler: input changes
             */
            onInputChange: function(evt) {
                this.chatterplot.load(evt.target.value);
            }
        };
    app.initialize();
}());