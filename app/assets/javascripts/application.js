// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require moment/moment
//= require d3/d3.min
//= require notifit/notifit
//
//= require image_list
//= require backbone.marionette/marionette_main
//= require app
//
//
//
Backbone.Marionette.Renderer.render = function(template, data){
  if (!JST[template]) throw "Template '" + template + "' not found!";
  return JST[template](data);
}







window.testCircle = function( target, dataUrl ){

var width = 100,
    height = 100,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#65aae5", "#eb724d", "#cccccc"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 20);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.amount; });

var svg = d3.select(target).append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

d3.csv( dataUrl, function(error, data) {

  data.forEach(function(d) {
    d.amount = +d.amount;
  });

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.status); });

});


};

