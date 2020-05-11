// set the dimensions and margins of the graph
var width_bubble = 600
var height_bubble = 600
// append the svg object to the body of the page
var svg3 = d3.select("#bubble")
  .append("svg")
    .attr("width", width_bubble)
    .attr("height", height_bubble)

// Read data
d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/bubble/data_bubble.csv", function(data) {

  // Filter a bit the data -> more than 1 game win
  data = data.filter(function(d){ return d.value>1 })

  // Color palette
  var color = d3.scaleOrdinal()
    .domain(["F1", "I1", "E0", "D1"])
    .range(d3.schemeSet1);

  // Size scale for countries
  var z = d3.scaleLinear()
    .domain([0, 200])
    .range([0,300])  // circle will be between 7 and 200 px wide

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
    .style("position",'relative')
    .style("width",'150px')

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip
      .transition()
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html('<u>' + d.team + '</u>' + "<br>" + d.value + " points")
      .style("left", (d3.mouse(this)[0] -200) + "px")
      .style("top", (d3.mouse(this)[1]-600) + "px")
  }
  var mouseleave = function(d) {
    Tooltip
      .transition()
      .style("opacity", 0)
  }

  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".node")
      .transition()
      .style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d)
      .transition()
      .style("opacity", 1)
    Tooltip
      .style("opacity", 0)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".node")
      .transition()
      .style("opacity", 1)
    Tooltip
      .style("opacity", 0)
  }

  // Initialize the images: all located at the center of the svg area
  var node = svg3.append("g")
    .selectAll("image")
    .data(data)
    .enter()
    .append('image')
    .attr('xlink:href', function(d){ return 'images/'+d.team+'.png'} )
    .attr('x', width_bubble / 2)
    .attr('y', height_bubble / 2)
    .attr('width', function(d){ return z(d.value)})
    .attr('height', function(d){ return z(d.value)})
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));




  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width_bubble / 2).y(height_bubble / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (z(d.value)) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; })
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
      .style("left", (d3.mouse(this)[0] -200) + "px")
      .style("top", (d3.mouse(this)[1]-600) + "px")
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

})
