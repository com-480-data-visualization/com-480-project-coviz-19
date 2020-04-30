var margin = {top: 10, right: 30, bottom: 30, left: 60};

var diameter = 600;

var svg = d3.select("body")
    .append("svg")
      .attr("width", diameter + margin.left + margin.right)
      .attr("height", diameter + margin.top + margin.bottom)
      .attr("class", "bubble")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/junk/bubble/F1.csv",

  function (d){
    return { Div : d.Div, HomeTeam : d.HomeTeam, Win : d.Win }
  },

  function (data) {
    console.log(data)

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var bubble = d3.pack(data)
        .size([diameter, diameter])
        .padding(1.5);


    var nodes = d3.hierarchy(data)
        .sum(function(d) { return d.Win; });

    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("title")
        .text(function(d) {

            return d.HomeTeam + ": " + d.Win;
        });

    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d,i) {
            return color(i);
        });
    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            console.log(d.data[0].HomeTeam)
            return d.data[0].HomeTeam.substring(0, d.r / 3);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            console.log(d.data[0].Win)
            return d.data[0].Win;
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    d3.select(self.frameElement)
        .style("height", diameter + "px");
  })
