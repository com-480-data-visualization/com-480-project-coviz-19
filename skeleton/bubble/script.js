var data_bubble1="https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/bubble/data/corners_I1_2018.csv"
var data_bubble2="https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/bubble/data/corners_E0_2018.csv"
var data_bubble3="https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/bubble/data/corners_D1_2018.csv"
var data_bubble4="https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/bubble/data/corners_SP1_2018.csv"
var data_bubble5="https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/bubble/data/corners_F1_2018.csv"

// set the dimensions and margins of the graph
var width_bubble = 600
var height_bubble = 650
// append the svg object to the body of the page
var svg3 = d3.select("#bubble")
  .append("svg")
    .attr("width", width_bubble)
    .attr("height", height_bubble)

function update(data_csv) {

//Clear all previous elements in the canvas
  svg3.selectAll("*").remove();

// Read data
d3.csv(data_csv, function(data) {


  // Size scale for countries
  var z = d3.scaleLinear()
    .domain([0, 600])
    .range([20,100])

  // create a tooltip
  var Tooltip = d3.select("#bubble")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")
      .attr("y", 0)
  .attr("x", 0)
    .style("width",'150px')

  // Three function that change the tooltip when user hover / move / leave a cell
 var mouseover = function(d) {
    Tooltip

      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    console.log( d3.mouse(this))
    Tooltip
      .html('<u>' + d.team + '</u>' + "<br>" + d.value + " points")
      .style("left", d3.mouse(this)[0]  + "px")
      .style("top", d3.mouse(this)[1] -600+ "px")
  }
  var mouseleave = function(d) {
    Tooltip

      .style("opacity", 0)
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

    .attr("width", function(d){ return 2*z(d.value)})
    .attr("height", function(d){ return 2*z(d.value)})
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
    .attr("r", function(d){ return z(d.value)})
    .style('fill', function(d){ return 'url(#'+d.team.replace(" ","_")+')'} )
      .style("stroke", "black")
      .style("opacity", 1)



    // .attr('width', function(d){ return z(d.value)*1.5})
    // .attr('height', function(d){ return z(d.value)*1.5})
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
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (z(d.value)) }).iterations(1)) // Force that avoids circle overlapping

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
    Tooltip
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
update(data_bubble2)
