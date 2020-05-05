

// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 500, left: 30},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top ;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/data/Computed/AccumulatingChart/merged.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = ["ReturnSP1_2018_1_risky","ReturnSP1_2018_10_risky","ReturnSP1_2018_1","ReturnSP1_2018_10","ReturnI1_2018_1_risky","ReturnI1_2018_10_risky","ReturnI1_2018_1","ReturnI1_2018_10","ReturnF1_2018_1_risky","ReturnF1_2018_10_risky","ReturnF1_2018_1","ReturnF1_2018_10","ReturnD1_2018_1_risky","ReturnD1_2018_10_risky","ReturnD1_2018_1","ReturnD1_2018_10","ReturnE0_2018_1_risky","ReturnE0_2018_10_risky","ReturnE0_2018_1","ReturnE0_2018_10"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([0,33])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [-200,200])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));



var zero_line = svg.append("line")
                     .attr("x1", 0)
                     .attr("y1", y(0))
                     .attr("x2", width)
                     .attr("y2", y(0))
                     .attr("stroke-width", 2)
                     .attr("stroke", "red");

    // Initialize line with group a
    var line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.Week) })
          .y(function(d) { return y(+d.ReturnSP1_2018_1_risky) })
        )
        .attr("stroke", function(d){ return myColor("ReturnSP1_2018_1_risky") })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {Week: d.Week, value:d[selectedGroup]} })

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d.Week) })
            .y(function(d) { return y(+d.value) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

})
