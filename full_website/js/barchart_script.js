var optionsSelectButtonProvider_bar = [["Bet365", "b365"], ["BWIN", "bw"], ["Interwetten", "iw"], ["Pinnacle", "ps"], ["VC Bet", "vc"], ["William Hill", "wh"]]
var optionsSelectButtonYear_bar = [["2013", "2013"], ["2014", "2014"], ["2015", "2015"], ["2016", "2016"], ["2017", "2017"], ["2018", "2018"], ["2019", "2019"]]
var optionsSelectButtonCountry_bar = [["Italy", "I1"], ["Germany", "D1"], ["Spain", "SP1"], ["England", "E0"], ["France", "F1"]]

d3.select("#barselectButtonProvider")
.selectAll('myOptions')
.data(optionsSelectButtonProvider_bar)
.enter()
.append('option')
.text(function (d) { return d[0]; }) // text showed in the menu
.attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

d3.select("#barselectButtonYear")
.selectAll('myOptions')
.data(optionsSelectButtonYear_bar)
.enter()
.append('option')
.text(function (d) { return d[0]; }) // text showed in the menu
.attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

d3.select("#barselectButtonLeague")
.selectAll('myOptions')
.data(optionsSelectButtonCountry_bar)
.enter()
.append('option')
.text(function (d) { return d[0]; }) // text showed in the menu
.attr("value", function (d) { return d[1]; }) // corresponding value returned by the button



// set the dimensions and marginBarcharts of the graph
var marginBarchart = { top: 10, right: 30, bottom: 50, left: 50 },
widthBarchart = 1050 - marginBarchart.left - marginBarchart.right,
heightBarchart = 500 - marginBarchart.top - marginBarchart.bottom;

// append the svgBarchart object to the body of the page
var svgBarchart = d3.select("#barchart")
.append("svg")
.attr("width", widthBarchart + marginBarchart.left + marginBarchart.right)
.attr("height", heightBarchart + marginBarchart.top + marginBarchart.bottom)
.append("g")
.attr("transform", "translate(" + marginBarchart.left + "," + marginBarchart.top + ")");

// Add X axis
var xBarchart = d3.scaleBand()
// .domain(groups)
.range([0, widthBarchart])
.padding([0.2])
var xAxis = svgBarchart.append("g")
.attr("transform", "translate(0," + heightBarchart + ")")
.attr("class",'xAxis')
.call(d3.axisBottom(xBarchart).tickSizeOuter(0));


// Add Y axis
var yBarchart = d3.scaleLinear()
// .domain([0, 100])
.range([heightBarchart, 0]);
var yAxis = svgBarchart.append("g")
.call(d3.axisLeft(yBarchart));

//Tooltip
var tooltip = d3.select("#barchart")
.append("div")
.style("opacity", 0)
.style('position',"relative")
.style("width","200px")
.attr("class", "tooltip_barchart")
.style("background-color", "white")
.style("color", "black")
.style("border-radius", "16px")
.style("padding", "10px")
var showTooltip = function(d) {
  tooltip
  .transition()
  .duration(100)
  .style("opacity", 1)
  tooltip
  .html('Team : '+d.data.name+ "<br />Prediciton: " + d3.format(".1f")(d.data.correct_pred)+ " %")
  .style("left", (d3.mouse(this)[0]+50) + "px")
  .style("top", (d3.mouse(this)[1]-400) + "px")
}
var moveTooltip = function(d) {
  tooltip
  .style("left", (d3.mouse(this)[0]+50) + "px")
  .style("top", (d3.mouse(this)[1]-400) + "px")
}
// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var hideTooltip = function(d) {
  tooltip
  .transition()
  .duration(100)
  .style("opacity", 0)
}

function update_barchart(data_csv) {

  svgBarchart.selectAll("rect").remove();
  // Parse the Data
  d3.csv(data_csv, function (data) {

    // Update the X axis
    xBarchart.domain(data.map(function (d) { return d.name; }))
    xAxis.call(d3.axisBottom(xBarchart))


    // Update the Y axis
    yBarchart.domain([0, 100])
    yAxis.transition().duration(1000).call(d3.axisLeft(yBarchart));

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = data.columns.slice(1)


    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function (d) { return (d.name) }).keys()





    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#add8e6', '#ff6966'])

    // Normalize the data -> sum of each group must be 100!
    dataNormalized = []
    data.forEach(function (d) {
      // Compute the total
      tot = 0
      for (i in subgroups) { name = subgroups[i]; tot += +d[name] }
      // Now normalize
      for (i in subgroups) { name = subgroups[i]; d[name] = d[name] / tot * 100 }
    })

    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
    .keys(subgroups)
    (data)


    // Show the bars
    svgBarchart.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function (d) { return color(d.key); })
    .selectAll("rect")

    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) {
      return d;
    })
    .enter().append("rect")
    .attr("transform", "translate("+widthBarchart/2+"," + heightBarchart + ")")
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )
    .transition()
    .duration(500)
    // .ease(d3.easeLinear,1,.3)
    .attr('transform', 'translate(0, 0)')
    .attr("x", function (d) { return xBarchart(d.data.name); })
    .attr("y", function (d) { return yBarchart(d[1]); })
    .attr("height", function (d) { return yBarchart(d[0]) - yBarchart(d[1]); })
    .attr("width", xBarchart.bandwidth())
    svgBarchart.selectAll(".xAxis text")
    .style("text-anchor", "end")
    .attr("transform", "rotate(-25)");
  })
}

d3.select("#barselectButtonProvider").on("change", function (d) {
  // recover the option that has been chosen
  barselectedProvider = d3.select(this).property("value")
  // run the updateChart function with this selected option
  update_barchart(concatenate_options_bar())
})

d3.select("#barselectButtonYear").on("change", function (d) {
  // recover the option that has been chosen
  barselectedYear = d3.select(this).property("value")
  // run the updateChart function with this selected option
  update_barchart(concatenate_options_bar())
})

d3.select("#barselectButtonLeague").on("change", function (d) {
  // recover the option that has been chosen
  barselectedLeague = d3.select(this).property("value")
  // run the updateChart function with this selected option
  update_barchart(concatenate_options_bar())
})

function concatenate_options_bar() {

  return "https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/full_website/data/barchart/" + barselectedLeague + "_" + barselectedYear + "_" + barselectedProvider + ".csv"

}

barselectedProvider = "b365"
barselectedYear = "2013"
barselectedLeague = "I1"

update_barchart(concatenate_options_bar())
