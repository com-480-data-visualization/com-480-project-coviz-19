
// set the dimensions and margins of the graph
var width_map = 600
var height_map = 650

// The svg
var svg = d3.select("#map_viz")
  .append("svg")
 .attr("width", width_map)
  .attr("height", height_map)


// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(800)
  .center([10,50])
  .translate([width_map / 2, height_map / 2]);


var Tooltip_fixed = d3.select("#map_info")
.append("div")
.style("opacity", 1)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")
.attr("y", 0)
.attr("x", 0)
.style("width",'150px')
.style("height",'50px')
.html("Hover over a country")

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleLinear()
  .domain([40,63])
  .range(["black", "green"]);


var optionsSelectButtonProvider=[["Bet365","b365"],["BWIN","bw"],["IW", "iw"],["LB","lb"],["VC","vc"],["WH","wh"]]
var optionsSelectButtonYear=[["2008/2009","2008_2009"],["2009/2010","2009_2010"],["2010/2011","2010_2011"],["2011/2012","2011_2012"],["2012/2013","2012_2013"],["2013/2014","2013_2014"],["2014/2015","2014_2015"],["2015/2016","2015_2016"]]

d3.select("#selectButtonProvider")
      .selectAll('myOptions')
      .data(optionsSelectButtonProvider)
      .enter()
      .append('option')
      .text(function (d) { return d[0]; }) // text showed in the menu
      .attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

d3.select("#selectButtonYear")
      .selectAll('myOptions')
      .data(optionsSelectButtonYear)
      .enter()
      .append('option')
      .text(function (d) { return d[0]; }) // text showed in the menu
      .attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

function update(data_csv) {


console.log(data_csv)
    // Load external data and boot
    d3.queue()
      .defer(d3.json, "https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/full_website/data/map/mymap.geojson")
      .defer(d3.csv, data_csv, function(d) { data.set(d.country_name, parseFloat(d.accuracy_percentage).toFixed(2)); })
      .await(ready);

    function ready(error, topo) {

      let mouseOver = function(d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .5)
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "black")
        Tooltip_fixed
        .style("opacity", 1)
    
      }
      let mousemove = function(d) {
        console.log(d)
        Tooltip_fixed
        .html('<u>' + d.properties.name + '</u>' + "<br>" + d.total + "% accuracy")
        .style("left", d3.mouse(this)[0]  + "px")
        .style("top", d3.mouse(this)[1] -600+ "px")
      }
      let mouseLeave = function(d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .8)
        d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "transparent")
          Tooltip_fixed
          .html("Hover over a country")
      }

      // Draw the map
      svg.append("g")
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
            d.total = data.get(d.id) || 0;
            return colorScale(d.total);
          })
          .style("stroke", "transparent")
          .attr("class", function(d){ return "Country" } )
          .style("opacity", .8)
          .on("mouseover", mouseOver )
          .on("mousemove", mousemove)
          .on("mouseleave", mouseLeave )
        }
}


d3.select("#selectButtonProvider").on("change", function(d) {
        // recover the option that has been chosen
        selectedProvider = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(concatenate_options_bubble())
      })

d3.select("#selectButtonYear").on("change", function(d) {
        // recover the option that has been chosen
        selectedYear = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(concatenate_options_bubble())
      })

        //Initialize

        selectedProvider='b365'
        selectedYear='2008_2009'




function concatenate_options_bubble(){
  console.log("Called")
  return "https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/full_website/data/map/" + selectedProvider + "/" + selectedYear + ".csv"

}

update(concatenate_options_bubble())
