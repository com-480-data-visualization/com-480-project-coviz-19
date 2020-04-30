

dataset = {
    "children": [{"Name":"PSG","Count":12},
        {"Name":"Lille","Count":11},
        {"Name":"Montpellier","Count":10},
        {"Name":"Rennes","Count":9},
        {"Name":"Marseille","Count":8},
        {"Name":"Nice","Count":8},
        {"Name":"Angers","Count":8},
        {"Name":"Monaco","Count":8},
        {"Name":"Strasbourg","Count":7},
        {"Name":"Brest","Count":6},
        {"Name":"Dijon","Count":6},
        {"Name":"Nantes","Count":6},
        {"Name":"Nimes","Count":6},
        {"Name":"Lyon","Count":5},
        {"Name":"Metz","Count":5},
        {"Name":"Reims","Count":5},
        {"Name":"St Etienne","Count":4},
        {"Name":"Bordeaux","Count":4},
        {"Name":"Amiens","Count":3},
        {"Name":"Toulouse","Count":3}]

};


var diameter = 600;
var color = d3.scaleOrdinal(d3.schemeCategory20);

var bubble = d3.pack(dataset)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("body")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var nodes = d3.hierarchy(dataset)
    .sum(function(d) { return d.Count; });

var node = svg.selectAll(".node")
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function(d){
        return  !d.children
    })
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

node.append("title")
    .text(function(d) {
        return d.Name + ": " + d.Count;
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
        return d.data.Name.substring(0, d.r / 3);
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
        return d.data.Count;
    })
    .attr("font-family",  "Gill Sans", "Gill Sans MT")
    .attr("font-size", function(d){
        return d.r/5;
    })
    .attr("fill", "white");

d3.select(self.frameElement)
    .style("height", diameter + "px");
