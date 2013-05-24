$(document).ready(function() {

  // @demo Change widths to demonstrate flexibility

  var w = 740, // width
      h = 280;

  // padding
  var p = [0, 0, 20, 0],
      x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
      y = d3.scale.linear().range([0, h - p[0] - p[2]]),
      z = d3.scale.ordinal().range(
        [
          "#5f8721", // Mid green
          "#8cc244", // Green
          "#29538a", // Blue
          "#8bd3db", // Aqua
          "#0c2d51", // Dark blue
          "#1e8287", // Dark aqua
          "#2C5458", // Dark green
          "#edd026", // Yellow
          "#e57a34", // Orange
          "#763b89" // Purple
        ]
      ),
      parse = d3.time.format("%m/%Y").parse,
      format = d3.time.format("%b");

  var svg = d3.select("#contracts-chart").append("svg:svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

  d3.csv("js/data/contracts.csv", function(deadlines) {

    // Transpose the data into layers by code.
    var codes = d3.layout.stack()(["a","b","c","d","e","f"].map(function(code) {
    // var codes = d3.layout.stack()(["a","b","c","d","e","f","g","h","i"].map(function(code) {
      return deadlines.map(function(d) {
        return {x: parse(d.date), y: +d[code]};
      });
    }));

    // Compute the x-domain (by date) and y-domain (by top).
    x.domain(codes[0].map(function(d) { return d.x; }));
    y.domain([0, d3.max(codes[codes.length - 1], function(d) { return d.y0 + d.y; })]);

    // Add a label per date.
    var label = svg.selectAll("text")
        .data(x.domain())
      .enter().append("svg:text")
        .attr("x", function(d) { return x(d) + x.rangeBand() / 2; })
        .attr("y", 6)
        .attr("text-anchor", "middle")
        .attr("dy", ".71em")
        .text(format);

    // Add y-axis rules.
    var rule = svg.selectAll("g.rule")
        .data(y.ticks(5))
      .enter().append("svg:g")
        .attr("class", "rule")
        .attr("transform", function(d) { return "translate(0," + -y(d) + ")"; });

    rule.append("svg:line")
        .attr("x2", w - p[1] - p[3])
        .style("stroke", "#000")
        .style("stroke-dasharray", "3,3")
        .style("stroke-opacity", 0.15);

    rule.append("svg:text")
        .attr("x", w - p[1] - p[3] + 6)
        .attr("dy", ".35em")
        .text(d3.format(",d"));

    // Add a group for each code.
    var code = svg.selectAll("g.code")
        .data(codes)
      .enter().append("svg:g")
        .attr("class", "code")
        .style("fill", function(d, i) { return z(i); })
        .style("stroke", "#FFF");

    // Add a rect for each date.
    var rect = code.selectAll("rect")
        .data(Object)
      .enter().append("svg:rect")
        .attr("x", function(d) { return x(d.x) + x.rangeBand()/4; })
        .attr("y", function(d) { return 0; })
        .attr("height", function(d) { return 0; })
        .attr("width", x.rangeBand()/2)
        // @demo uncomment 3 lines below
        .transition()
        .duration(250)
        .ease("ease-in")
        .attr("height", function(d) { return y(d.y); })
        .attr("y", function(d) { return -y(d.y0) - y(d.y); });

  });

});