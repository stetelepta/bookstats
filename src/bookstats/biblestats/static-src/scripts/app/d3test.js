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
        this.margin = {top: 20, right: 20, bottom: 30, left: 40},
        this.width = 800 - this.margin.left - this.margin.right,
        this.height = 400 - this.margin.top - this.margin.bottom;
        this.books = ["genesis", "exodus", "leviticus", "a", "sdf", "sdf"];

        // setup scales
        this.xScale = d3.scale.linear().domain([0, 66]).range([0, this.width]);
        this.yScale = d3.scale.linear().domain([0, 150]).range([this.height, 0]);

        // setup x axis
        this.xAxis = d3.svg.axis().ticks(6).scale(this.bookScale()).range([0, this.width]).orient("bottom");
        this.xAxis.tickValues(this.books)

        // setup y axis
        this.yAxis = d3.svg.axis().tickSize(0,0).scale(this.yScale).orient("left");
        this.yAxis.ticks(0);

        this.draw();

        this.loadInitial();

        // return reference to this
        return this;
    },
    bookScale: function() {
        console.log("bookScale:" + this.books);
        return d3.scale.ordinal().domain(this.books).range([15, (this.width+10)]);
    },
    draw: function() {
        // insert the graph canvas
        this.svg = d3.select(this.elm).append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    },
    loadInitial: function() {
        // load data
        d3.csv("/data/chapters.csv", this.onChaptersLoaded.bind(this));
    },
    onChaptersLoaded: function(error, data) {
        // change string (from CSV) into number format
        data.forEach(function(d) {
            d["Chapter"] = +d["Chapter"];
            if (d["Chapter"] == 1) {
            //    this.books.push(d["BookLabel"])
            }
        }.bind(this));
        
        console.log("before call: this.books:" + this.books);

        //this.xAxis = d3.svg.axis().ticks(66).scale(d3.scale.ordinal().domain(this.books).range([18, (this.width+20)])).orient("bottom");

        // x-axis
        this.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + this.height + ")")
          .call(this.xAxis);
        
        //axis.domain(array.map(function (d) { return d.value; }))

        // draw bars
        this.svg.selectAll(".chapters")
          .data(data)
        .enter().append("rect")
          .attr("class", "chapter")
          .attr("width", 10)
          .attr("height", 1)
          .attr("that", this)
          // .attr('transform', function(d, i) {
          //   return "rotate ( -" + (d['BookNr'] * 5.45) + ")";
          // })
          // .attr('transform', function(d, i) {
          //   return "rotate ( -90 ) translate (-300 0)";
          // })

          // .attr("x", function(d) { return (x(d.release) - rectWidth/2); }) //d.release is the release year
          // .attr("y", function(d) {return locateY(d);});
          .attr("x", function(d) { return this.xScale(d["BookNr"]) }.bind(this))
          .attr("y", function(d) { return this.yScale(d["Chapter"]) }.bind(this))
          .style("fill", function(d) { return '#ec9';}.bind(this)) 

    }
};

module.exports = chatterplot;