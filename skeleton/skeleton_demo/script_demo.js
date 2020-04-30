// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 860 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;



// append the svg object to the body of the page
var svg = d3.select("#accumulating")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/accumulating_chart/data.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d.date, value : d.value }
  },

  // Now I can use this dataset:
  function(data) {
    console.log(data)

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.date; })])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

      svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Match Day");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amount of money");

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        )

})

// ------------------------------ Barchart

 var dataIT="https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/barchartI1.csv";
  var dataFR="https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/barchartF1.csv";

  var margin2 = {top: 10, right: 30, bottom: 20, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg2 = d3.select("#barchart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

      // Add X axis
  var x = d3.scaleBand()
      // .domain(groups)
      .range([0, width])
      .padding([0.2])
  var xAxis = svg2.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));


  // Add Y axis
  var y = d3.scaleLinear()
    // .domain([0, 100])
    .range([ height, 0 ]);
 var yAxis =  svg2.append("g")
    .call(d3.axisLeft(y));

function update(data_csv) {
// Parse the Data
d3.csv(data_csv, function(data) {

  // Update the X axis
  x.domain(data.map(function(d) { return d.name; }))
  xAxis.call(d3.axisBottom(x))

  // Update the Y axis
  y.domain([0, 100])
  yAxis.transition().duration(1000).call(d3.axisLeft(y));

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)


  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.name)}).keys()


  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#66cc00','#ff9999'])

  // Normalize the data -> sum of each group must be 100!
  console.log(data)
  dataNormalized = []
  data.forEach(function(d){
    // Compute the total
    tot = 0
    for (i in subgroups){ name=subgroups[i] ; tot += +d[name] }
    // Now normalize
    for (i in subgroups){ name=subgroups[i] ; d[name] = d[name] / tot * 100}
  })


  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

    console.log(stackedData)

  // Show the bars
  svg2.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function(d) {
        console.log(d)
        return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.name); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width",x.bandwidth())
})
}
update(dataIT)

//-------------BUBBLE------------


// set the dimensions and margins of the graph
var width_bubble = 600
var height_bubble = 600
// append the svg object to the body of the page
var svg3 = d3.select("#bubble")
  .append("svg")
    .attr("width", width_bubble)
    .attr("height", height_bubble)

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
      .html('<u>' + d.div +' '+ '</u> '+'<u>' + d.key + '</u>' + "<br>" + d.value + " wins")
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

  // Initialize the circle: all located at the center of the svg area
  var node = svg3.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function(d) { return "node " + d.div })
      .attr("r", function(d){ return z(d.value)})
      .attr("cx", width_bubble / 2)
      .attr("cy", height_bubble / 2)
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
   svg3.selectAll("myrect")
     .data(allgroups)
     .enter()
     .append("circle")
       .attr("cx", 550)
       .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
       .attr("r", 7)
       .style("fill", function(d){ return color(d)})
       .on("mouseover", highlight)
       .on("mouseleave", noHighlight)

     // Add labels beside legend dots
   svg3.selectAll("mylabels")
     .data(allgroups)
     .enter()
     .append("text")
       .attr("x", 550 + size*.8)
       .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
       .style("fill", function(d){ return color(d)})
       .text(function(d){ return d})
       .attr("text-anchor", "left")
       .style("alignment-baseline", "middle")
       .on("mouseover", highlight)
       .on("mouseleave", noHighlight)
  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
      .force("center", d3.forceCenter().x(width_bubble / 2).y(height_bubble / 2)) // Attraction to the center of the svg area
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
