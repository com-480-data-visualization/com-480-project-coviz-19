
// set the dimensions and margins of the graph
var width = 600
var height = 600
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width)
    .attr("height", height)

// Read data
d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/bubble/test.csv", function(data) {

  // Filter a bit the data -> more than 1 game win
  data = data.filter(function(d){ return d.value>1 })

  // Color palette
  var color = d3.scaleOrdinal()
    .domain(["F1", "I1", "E0", "D1"])
    .range(d3.schemeSet1);

  // Size scale for countries
  var z = d3.scaleLinear()
    .domain([0, 75])
    .range([7,200])  // circle will be between 7 and 200 px wide

  // create a tooltip
  var Tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

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
      .html('<u>' + d.div +' '+ '</u> '+'<u>' + d.key + '</u>' + "<br>" + d.value + " wins")
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
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

  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".node")
    .transition()
    .style("opacity", 1)
  }

  // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "node " + d.div })
      .attr("r", function(d){ return z(d.value)})
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", function(d){ return color(d.div)})
      .style("fill-opacity", 0.8)
      .attr("stroke", "black")
      .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));


     // Add one dot in the legend for each name.
   var size = 20
   var allgroups = ["F1", "I1", "E0", "D1"]
   svg.selectAll("myrect")
     .data(allgroups)
     .enter()
     .append("circle")
       .attr("cx", 500)
       .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
       .attr("r", 7)
       .style("fill", function(d){ return color(d)})
       .on("mouseover", highlight)
       .on("mouseleave", noHighlight)

     // Add labels beside legend dots

   svg.selectAll("mylabels")
     .data(allgroups)
     .enter()
     .append("text")
       .attr("x", 500 + size*.8)
       .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
       .style("fill", function(d){ return color(d)})
       .text(function(d){ return d})
       .attr("text-anchor", "left")
       .style("alignment-baseline", "middle")
       .on("mouseover", highlight)
       .on("mouseleave", noHighlight)
  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (z(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
      .nodes(data)
      .on("tick", function(d){
        node
            .attr("cx", function(d){ return d.x; })
            .attr("cy", function(d){ return d.y; })
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
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

})
