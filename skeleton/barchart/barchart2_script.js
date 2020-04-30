 var data1="https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/barchartI1.csv";
  var data2="https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/skeleton/barchartF1.csv";

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#barchart")
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
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));


  // Add Y axis
  var y = d3.scaleLinear()
    // .domain([0, 100])
    .range([ height, 0 ]);
 var yAxis =  svg.append("g")
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
    .range(['#008000','#e41a1c'])

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
  svg.append("g")
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
update(data1)