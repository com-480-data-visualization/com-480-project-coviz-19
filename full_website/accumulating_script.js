
// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 60, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top ;

// append the svg object to the body of the page
var svg = d3.select("#accumulating")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Inital data
    var selectedCountry="ReturnI1_2018";
    var selectedMoney="10";
    var selectedRisky="";

      var Tooltip_fixed = d3.select("#accumulating_info")
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
  .attr("transform","translate(500,50)")
    .style("width",'200px')
    .style("height",'50px')

    .html("Total Invested: <br> Total Return: ")

//Read the data
d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/full_website/data/accumulating/merged.csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = ["ReturnSP1_2018_1_risky","ReturnSP1_2018_10_risky","ReturnSP1_2018_1","ReturnSP1_2018_10","ReturnF1_2018_1_risky","ReturnF1_2018_10_risky","ReturnF1_2018_1","ReturnF1_2018_10","ReturnD1_2018_1_risky","ReturnD1_2018_10_risky","ReturnD1_2018_1","ReturnD1_2018_10","ReturnE0_2018_1_risky","ReturnE0_2018_10_risky","ReturnE0_2018_1","ReturnE0_2018_10"]

var optionsSelectButtonCountry=[["Italy 2018","ReturnI1_2018"],["Spain 2018","ReturnSP1_2018"],["France 2018","ReturnF1_2018"],["England 2018","ReturnE0_2018"],["Germany 2018", "ReturnD1_2018"]]
var optionsSelectButtonRisky=[["Follow bookies advice",""],["Do the opositie","risky"]]
    // add the options to the button
    d3.select("#selectButtonCountry_accumulating")
      .selectAll('myOptions')
      .data(optionsSelectButtonCountry)
      .enter()
      .append('option')
      .text(function (d) { return d[0]; }) // text showed in the menu
      .attr("value", function (d) { return d[1]; }) // corresponding value returned by the button



          d3.select("#selectButtonRisky_accumulating")
      .selectAll('myOptions')
      .data(optionsSelectButtonRisky)
      .enter()
      .append('option')
      .text(function (d) { return d[0]; }) // text showed in the menu
      .attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);





    var x = d3.scaleLinear()
      .domain([0,33])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

        // text label for the x axis
  svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 40) + ")")
      .style("text-anchor", "middle")
      .text("Week Number");

    // Add Y axis

    var y = d3.scaleLinear().domain( [-200,200]).range([height, 0]);
var yAxis = d3.axisLeft().scale(y);
svg.append("g")
  .attr("class","myYaxis")



        svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Return in CHF");


 var bisect = d3.bisector(function(d) { return d.Week; }).left;

  // Create the circle that travels along the curve of chart
  var focus = svg
    .append('g')
    .append('circle')
      .style("fill", "none")
      .attr("stroke", "black")
      .attr('r', 4)
      .style("opacity", 0)

  // Create the text that travels along the curve of chart
  var focusText = svg
    .append('g')
    .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")



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
        .style("stroke-width", 4)
        .style("fill", "none")



    // A function that update the chart
    function update_accumulating(selectedGroup) {


      // Create new data with the selection
      var dataFilter = data.map(function(d){return {Week: d.Week, value:d[selectedGroup]} })


        y.domain([Math.min(0,d3.min(dataFilter.map(x=>parseInt(x.value)))),Math.max(0, d3.max(dataFilter.map(x=>parseInt(x.value))))]);
        svg.selectAll(".myYaxis").transition()
          .duration(1000)
          .call(yAxis);

          svg.selectAll(".myYaxis").transition()
          .duration(1000)
          .call(yAxis);

          zero_line
          .attr("y1", y(0))
                     .attr("x2", width)
                     .attr("y2", y(0));

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.Week) })
            .y(function(d) { return y(d.value) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })


console.log( dataFilter)
      Tooltip_fixed
      .html("Total Invested: "+dataFilter.length*100+" CHF"+" <br> Total Return: "+(Math.round(dataFilter[dataFilter.length-1].value * 100)/100)+" CHF")

    svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height+1000)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);

  function mouseover() {
    focus.style("opacity", 1)
    focusText.style("opacity",1)
  }

  function mousemove() {
    // recover coordinate we need
    var x0 = x.invert(d3.mouse(this)[0]);
    var i = bisect(data, x0, 1);

    selectedData = data[i]

    focus
      .attr("cx", x(selectedData.Week))
      .attr("cy", y(selectedData[selectedGroup]))
    focusText
      .html("Return:" + Math.round(selectedData[selectedGroup] * 100) / 100 )
      .attr("x", x(selectedData.Week)+15)
      .attr("y", y(selectedData[selectedGroup])+20)
    }
  function mouseout() {
    focus.style("opacity", 0)
    focusText.style("opacity", 0)
  }
    }


    //INITIALIZE
    update_accumulating(concatenate_options())

    // When the button is changed, run the updateChart function
    d3.select("#selectButtonCountry_accumulating").on("change", function(d) {
        // recover the option that has been chosen
        selectedCountry = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update_accumulating(concatenate_options())
    })


            d3.select("#selectButtonRisky_accumulating").on("change", function(d) {
        // recover the option that has been chosen
        selectedRisky = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update_accumulating(concatenate_options())
    })

            function concatenate_options(){
            	var res= selectedCountry+"_10_"+selectedRisky;
            	if(selectedRisky=="")
            	{
            		return selectedCountry+"_10"
            	}
            	else return res
            }

})
