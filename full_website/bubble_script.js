
// set the dimensions and margins of the graph
var width_bubble = 600
var height_bubble = 650

  var Tooltip_fixed = d3.select("#bubble_info")
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
    .html("Hover on a logo")


// append the svg object to the body of the page
var svg3 = d3.select("#bubble")
  .append("svg")
    .attr("width", width_bubble)
    .attr("height", height_bubble)

    var optionsSelectButtonCountry=[["Italy 2018","I1_2018"],["Spain 2018","SP1_2018"],["France 2018","F1_2018"],["Spain 2018","E0_2018"],["Germany 2018", "D1_2018"]]
    var optionsSelectButtonCategory=[["Yellow Cards","YCards_"],["Red Cards","RCards_"],["Corners","corners_"]]
    // add the options to the button
    d3.select("#selectButtonCountry_bubble")
      .selectAll('myOptions')
      .data(optionsSelectButtonCountry)
      .enter()
      .append('option')
      .text(function (d) { return d[0]; }) // text showed in the menu
      .attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

      d3.select("#selectButtonCategory_bubble")
      .selectAll('myOptions')
      .data(optionsSelectButtonCategory)
      .enter()
      .append('option')
      .text(function (d) { return d[0]; }) // text showed in the menu
      .attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

function update_bubble(data_csv) {




//Clear all previous elements in the canvas
  svg3.selectAll("*").remove();

// Read data
d3.csv(data_csv, function(data) {

var min_value=Math.min(...data.map(x=>parseInt(x.value)))
var max_value=Math.max(...data.map(x=>parseInt(x.value)))
  // Size scale for countries
  function z(){

     return d3.scaleLinear()
    .domain([min_value, max_value])
    .range([20,100])


  }

  // create a tooltip


  // Three function that change the tooltip when user hover / move / leave a cell
 var mouseover = function(d) {
    Tooltip_fixed

      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {

    Tooltip_fixed

      .html('<u>' + d.team + '</u>' + "<br>" + d.value + " points")
      .style("left", d3.mouse(this)[0]  + "px")
      .style("top", d3.mouse(this)[1] -600+ "px")
  }
  var mouseleave = function(d) {
    Tooltip_fixed

      .html("Hover on a logo")
  }



  // And when it is not hovered anymore

var defs = svg3.append('svg:defs');

  defs.selectAll(".patterns")
        .data(data)
    .enter()
  .append("pattern")
    .attr('id', function(d){ return d.team.replace(" ","_")} )
        .attr("width", 1)
    .attr("height", 1)

.append("svg:image")
    .attr('xlink:href', function(d){ return 'images/'+d.team+'.png'} )

    .attr("width", function(d){ return 2*z()(d.value)})
    .attr("height", function(d){ return 2*z()(d.value)})
  .attr("y", 0)
  .attr("x", 0)

  // Initialize the images: all located at the center of the svg area
  var node = svg3.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append('circle')
    // .attr('xlink:href', function(d){ return 'images/'+d.team+'.png'} )
    .attr('cx', width_bubble / 2)
    .attr('cy', height_bubble / 2)
    .attr("r", function(d){ return z()(d.value)})
    .style('fill', function(d){ return 'url(#'+d.team.replace(" ","_")+')'} )
      .style("stroke", "black")
      .style("opacity", 1)



    // .attr('width', function(d){ return z()(d.value)*1.5})
    // .attr('height', function(d){ return z()(d.value)*1.5})
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));




  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(0).y(0)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (z()(d.value)) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){

        node

            .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
      });

  // What happens when a circle is dragged?
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
    Tooltip_fixed
      .style("left", d3.mouse(this)[0] + "px")
      .style("top", d3.mouse(this)[1]-600+ "px")
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

})
}


    d3.select("#selectButtonCountry_bubble").on("change", function(d) {
        // recover the option that has been chosen
        selectedCountry = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update_bubble(concatenate_options_bubble())
    })

        d3.select("#selectButtonCategory_bubble").on("change", function(d) {
        // recover the option that has been chosen
        selectedCategory = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update_bubble(concatenate_options_bubble())
    })

        //Initialize

        selectedCountry='I1_2018'
        selectedCategory='YCards_'




        function concatenate_options_bubble(){
              return "https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/full_website/data/bubble/"+selectedCategory+selectedCountry+".csv"

            }

       update(concatenate_options_bubble())
