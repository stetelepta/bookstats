"use strict";
var d3 = require('d3');
var colorbrewer = require('colorbrewer');

var chatterplot = {
    margin: undefined,
    width: undefined,
    height: undefined,
    xScale: undefined,
    yScale: undefined,
    elm: undefined,
    color: undefined,
    svg: undefined,
    tooltip: undefined,
    /*
     * initialize chart
     */
    initialize: function(elm) {
        // div element for the chart
        this.elm = elm;

        // setup width, height
        this.margin = {top: 10, right: 20, bottom: 80, left: 40},
        this.width = 1000 - this.margin.left - this.margin.right,
        this.height = 450 - this.margin.top - this.margin.bottom;
        this.books = [];

        // setup scales
        //this.xScale = d3.scale.linear().range([0, this.width]); // value -> display
        this.yScale = d3.scale.linear().range([this.height, 0]); // value -> display

        // setup x axis
        //this.xAxis = d3.svg.axis().ticks(30).orient("bottom");
        // this.xAxis.tickValues(this.books)

        // setup y axis
        this.yAxis = d3.svg.axis().tickSize(0,0).scale(this.yScale).orient("left");
        this.yAxis.ticks(0);


        // setup color scales
        this.color = d3.scale.ordinal().range(colorbrewer.YlOrRd[5].reverse());

        this.draw();

        this.loadInitial();

        // return reference to this
        return this;
    },
    /*
     * value accessors - returns the xValue to encode for a given data object.
     */
    xValue: function(d) {
        return d["BookNr"];
    },
    /*
     * value accessors - returns the yValue to encode for a given data object.
     */
    yValue: function(d) {
        return d["Chapter"];
    },
    /*
     * map function - maps from data value to display xValue
     */
    xMap: function(d) {
        return this.xScale(d["BookNr"]);
    },
    /*
     * map function - maps from data value to display value
     */
    yMap: function(d) { 
        return this.yScale(d["Chapter"]); // data -> display
    },
    draw: function() {
        // insert the graph canvas
        this.svg = d3.select(this.elm).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        // add the tooltip area to the element
        this.tooltip = d3.select(this.elm).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    },
    loadInitial: function() {
        // load data
        //d3.csv("/data/chapters.csv", this.onChaptersLoaded.bind(this));
        d3.csv("/static/biblestats/chapters.csv", this.onChaptersLoaded.bind(this));
    },
    load: function(word) {
        // load data
        d3.csv("/data/bible.csv?word=" + word, this.onCSVLoaded.bind(this));
    },
    compare: function(a,b) {
        if (a.key < b.key)
            return -1;
        if (a.key > b.key)
            return 1;
        return 0;
    },
    onChaptersLoaded: function(error, data) {
        // change string (from CSV) into number format
        data.forEach(function(d) {
            d["Chapter"] = +d["Chapter"];
            if (d["Chapter"] == 1) {
               this.books.push({key: parseInt(d["BookNr"]),val: d["BookLabel"]})
            }
        }.bind(this));

        this.books.sort(this.compare);

        // this.xScale = d3.scale.ordinal()
        //     .domain(this.books.map(function (d) {return d.key; }))
        //     .rangeRoundBands([this.margin.left, this.width], 0.01);

        // this.xScale = d3.scale.ordinal()
        //     .domain(this.books.map(function (d) {return d.key; }))
        //     .range([1,66])
        //     .rangeRoundBands([this.margin.left, this.width], 0.01);

        var dataWidth = this.width / 66;

        this.xScale = d3.scale.ordinal().domain(this.books.map(function(d) {return d.val}))
            .range(this.books.map(function(d){return d.key * dataWidth;}));

        this.xAxis = d3.svg.axis().tickSize(0,0).scale(this.xScale).orient("bottom");

        // this.xScale.domain([1, 66]);
        this.yScale.domain([0, 150]);

        // x-axis
        this.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + this.height + ")")
          .call(this.xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            // .attr("dx", "-.8em")
            // .attr("dy", ".15em")
            .attr("transform", "rotate(-90) translate (-4 -2)" );


        // y-axis
        this.svg.append("g")
          .attr("class", "y axis")
          //.call(this.yAxis).bind(this);
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          // .text("Chapter");

        // draw dots
        this.svg.selectAll(".chapters")
          .data(data)
        .enter().append("rect")
          .attr("class", "chapter")
          .attr("width", 10)
          .attr("height", 2)
          .attr("that", this)
          // .attr('transform', function(d, i) {
          //   return "rotate ( -" + (d['BookNr'] * 5.45) + ")";
          // })
          // .attr('transform', function(d, i) {
          //   return "rotate ( -90 ) translate (-300 0)";
          // })

          // .attr("x", function(d) { return (x(d.release) - rectWidth/2); }) //d.release is the release year
          // .attr("y", function(d) {return locateY(d);});
          .attr("x", function(d) { return this.xMap(d) }.bind(this))
          .attr("y", function(d) { return this.yMap(d) }.bind(this))
          //.style("fill", function(d) { return '#eee';}.bind(this)) 

        // draw legend
        var legend = this.svg.selectAll(".legend")
          .data(this.color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
          .attr("x", this.width - 18)
          .attr("width", 18)
          .attr("height", 18)
          // .style("fill", this.color);
          .style("fill", this.color);

        // draw legend text
        legend.append("text")
          .attr("x", this.width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { 
            return d;
        })   
    },
    /*
     * callback for csv load
     */
    onCSVLoaded: function(error, data) {
        // update total number of words for this query
        this.updateTotal(data[0]["Total"]);

        // change string (from CSV) into number format
        data.forEach(function(d) {
            d["Chapter"] = +d["Chapter"];
        });

        // draw chapters
        var chapters = this.svg.selectAll(".word").data(data);

        chapters.enter().append("rect");

        chapters
          .attr("class", "word")
          .attr("width", 10)
          .attr("height", 2)
          .attr("x", function(d) { return this.xMap(d) }.bind(this))
          .attr("y", function(d) { return this.yMap(d) }.bind(this))
          .style("fill", function(d) { return this.color(this.colorCategory(d));}.bind(this)) 
          .on("mouseover", function(d) {
              this.tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              this.tooltip.html("\"" + d["Word"] + "\" appears " + d["Count"] + " times in " + d["BookLabel"] + " " + d["Chapter"])
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
          }.bind(this))
          .on("mouseout", function(d) {
              this.tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          }.bind(this));
        
        chapters.exit().remove();

        // draw legend
        var legend = this.svg.selectAll(".legend")
          .data(this.color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
          .attr("x", this.width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", this.color);

        // draw legend text
        legend.append("text")
          .attr("x", this.width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { 
            return d;
        })
    },
    updateTotal: function (total) {
        document.querySelector(".total").innerHTML = this.numberWithCommas(total);
        if (total > 1) {
            document.querySelector(".total").innerHTML += ' times ';
        } else {
            document.querySelector(".total").innerHTML += ' time ';
        }
    },
    /*
     * return category for word count
     */
    countToCategory: function(count) {
        if (count < 2) {return 0;}
        if (count < 5) {return 1;}
        if (count < 10) {return 2;}
        if (count < 25) {return 3;}
        return 5; 
    },
    /*
     * return color-category for item d
     */
    colorCategory: function(d) { 
        return this.countToCategory(d.Count);    
    },
    /*
     * format thousand separator, preferable move this function elsewhere
     */
    numberWithCommas: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
};

module.exports = chatterplot;