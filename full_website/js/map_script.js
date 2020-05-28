
// set the dimensions and margins of the graph
var width_map = 600
var height_map = 600

// The svg
var svg_map = d3.select("#map_viz")
.append("center")
.append("svg")
.attr("width", width_map)
.attr("height", height_map)


var projection = d3.geoMercator()
.scale(800)
.center([10, 50])
.translate([width_map / 2, height_map / 2]);


var Tooltip_fixed_map = d3.select("#map_info")
.append("div")
.style("opacity", 1)
.attr("class", "tooltip")
.style("background-color", "trasnparent")
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "16px")
.style("border-color",'#ccc')
.style("padding", "5px")
.style("font-size",'20px')
.style("position", "absolute")
.style("margin","100px 0px 0px 600px")
.attr("y", 0)
.attr("x", 0)
.style("width", '200px')
.style("height", '100px')
.html("Hover over a country")

// Data and color scale
var data_map = d3.map();
var colorScale = d3.scaleSequential()
.domain([40, 63])
.interpolator(d3.interpolateViridis);


var optionsSelectButtonProvider_map = [["Bet365", "b365"], ["BWIN", "bw"], ["Interwetten", "iw"], ["Ladbrokes", "lb"], ["VC Bet", "vc"], ["William Hill", "wh"]]
var optionsSelectButtonYear_map = [["2008", "2008_2009"], ["2009", "2009_2010"], ["2010", "2010_2011"], ["2011", "2011_2012"], ["2012", "2012_2013"], ["2013", "2013_2014"], ["2014", "2014_2015"], ["2015", "2015_2016"]]

d3.select("#mapselectButtonProvider")
.selectAll('myOptions')
.data(optionsSelectButtonProvider_map)
.enter()
.append('option')
.text(function (d) { return d[0]; }) // text showed in the menu
.attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

d3.select("#mapselectButtonYear")
.selectAll('myOptions')
.data(optionsSelectButtonYear_map)
.enter()
.append('option')
.text(function (d) { return d[0]; }) // text showed in the menu
.attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

function mapupdate(data_csv) {


  // Load external data and boot
  d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/full_website/data/map/mymap.geojson")
  .defer(d3.csv, data_csv, function (d) { data_map.set(d.country_name, parseFloat(d.accuracy_percentage).toFixed(2)); })
  .await(ready);

  function ready(error, topo) {

    let mouseOver = function (d) {
      d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
      d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
      Tooltip_fixed_map
      .style("opacity", 1)

    }
    let mousemove = function (d) {

      Tooltip_fixed_map
      .html('<u>' + d.properties.name + '</u>' + "<br>" + d.total + "% accuracy")
      //.style("left", d3.mouse(this)[0] + "px")
      //.style("top", d3.mouse(this)[1]+ "px")
    }
    let mouseLeave = function (d) {
      d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
      d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
      Tooltip_fixed_map
      .html("Hover over a country")
    }

    // Draw the map
    svg_map.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath()
    .projection(projection)
  )
  // set the color of each country
  .attr("fill", function (d) {
    d.total = data_map.get(d.id) || 0;
    return colorScale(d.total);
  })
  .style("stroke", "transparent")
  .attr("class", function (d) { return "Country" })
  .style("opacity", .8)
  .on("mouseover", mouseOver)
  .on("mousemove", mousemove)
  .on("mouseleave", mouseLeave)
}
}


d3.select("#mapselectButtonProvider").on("change", function (d) {
  // recover the option that has been chosen
  selectedProvider_map = d3.select(this).property("value")
  // run the updateChart function with this selected option
  mapupdate(concatenate_options_map())
})

d3.select("#mapselectButtonYear").on("change", function (d) {
  // recover the option that has been chosen
  selectedYear_map = d3.select(this).property("value")
  // run the updateChart function with this selected option
  mapupdate(concatenate_options_map())
})

//Initialize

selectedProvider_map = 'b365'
selectedYear_map = '2008_2009'




function concatenate_options_map() {
  return "https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/full_website/data/map/" + selectedProvider_map + "/" + selectedYear_map + ".csv"

}

mapupdate(concatenate_options_map())
