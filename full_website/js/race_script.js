var svg_race = d3.select("#race").append("svg")
  .attr("width", 960)
  .attr("height", 600);
  var optionsSelectButtonCountry_race=[["Italy","italy"],["Spain","spain"],["France","france"],["Germany","german"],["England", "england"]]
  d3.select("#selectButtonCountry_race")
    .selectAll('myOptions')
    .data(optionsSelectButtonCountry_race)
    .enter()
    .append('option')
    .text(function (d) { return d[0]; }) // text showed in the menu
    .attr("value", function (d) { return d[1]; }) // corresponding value returned by the button

var tickDuration = 500;

let title = svg_race.append('text')
 .attr('class', 'title')
 .attr('y', 100)
 .attr('x',100)
 .html('Select a Country to begin the race');
var count= 0;
var ticker;
function update_race(data_csv) {

   svg_race.selectAll("*").remove();
   var top_n = 10;
   var height = 600;
   var width = 960;
   const margin_race = {
     top: 80,
     right: 0,
     bottom: 5,
     left: 10
   };

   let year = 2013;
   var top_n = 10;
   var barPadding = (height-(margin_race.bottom+margin_race.top))/(top_n*5);



   d3.csv(data_csv,function(data) {
     //if (error) throw error;

        data.forEach(d => {
         d.value = +d.value,
         d.lastValue = +d.lastValue,
         d.value = isNaN(d.value) ? 0 : d.value,
         d.year = +d.year,
         d.colour = d3.hsl(Math.random()*10000,0.75,0.75)
       });

      let yearSlice = data.filter(d => d.year == year && !isNaN(d.value))
       .sort((a,b) => b.value - a.value)
       .slice(0, top_n);

       yearSlice.forEach((d,i) => d.rank = i);


      let x = d3.scaleLinear()
         .domain([0, d3.max(yearSlice, d => d.value)])
         .range([margin_race.left, width-margin_race.right-65]);

      let y = d3.scaleLinear()
         .domain([top_n, 0])
         .range([height-margin_race.bottom, margin_race.top]);

      let xAxis = d3.axisTop()
         .scale(x)
         .ticks(width > 500 ? 5:2)
         .tickSize(-(height-margin_race.top-margin_race.bottom))
         .tickFormat(d => d3.format(',')(d));

      svg_race.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin_race.top})`)
        .call(xAxis)
        .selectAll('.tick line')
        .classed('origin', d => d == 0);

      svg_race.selectAll('rect.bar')
         .data(yearSlice, d => d.name)
         .enter()
         .append('rect')
         .attr('class', 'bar')
         .attr('x', x(0)+1)
         .attr('width', d => x(d.value)-x(0)-1)
         .attr('y', d => y(d.rank)+5)
         .attr('height', y(1)-y(0)-barPadding)
         .style('fill', d => d.colour);

      svg_race.selectAll('text.label')
         .data(yearSlice, d => d.name)
         .enter()
         .append('text')
         .attr('class', 'label')
         .attr('x', d => x(d.value)-8)
         .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
         .style('text-anchor', 'end')
         .html(d => d.name);

     svg_race.selectAll('text.valueLabel_race')
       .data(yearSlice, d => d.name)
       .enter()
       .append('text')
       .attr('class', 'valueLabel_race')
       .attr('x', d => x(d.value)+5)
       .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
       .text(d => d3.format(',.0f')(d.lastValue));

     let yearText = svg_race.append('text')
       .attr('class', 'yearText')
       .attr('x', width-margin_race.right)
       .attr('y', height-25)
       .style('text-anchor', 'end')
       .html(~~year)

      ticker = d3.interval(e => {

       yearSlice = data.filter(d => d.year == year && !isNaN(d.value))
         .sort((a,b) => b.value - a.value)
         .slice(0,top_n);

       yearSlice.forEach((d,i) => d.rank = i);


       x.domain([0, d3.max(yearSlice, d => d.value)]);

       svg_race.select('.xAxis')
         .transition()
         .duration(tickDuration)
         .ease(d3.easeLinear)
         .call(xAxis);

        let bars = svg_race.selectAll('.bar').data(yearSlice, d => d.name);

        bars
         .enter()
         .append('rect')
         .attr('class', d => `bar ${d.name.replace(/\s/g,'_')}`)
         .attr('x', x(0)+1)
         .attr( 'width', d => x(d.value)-x(0)-1)
         .attr('y', d => y(top_n+1)+5)
         .attr('height', y(1)-y(0)-barPadding)
         .style('fill', d => d.colour)
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('y', d => y(d.rank)+5);

        bars
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('width', d => x(d.value)-x(0)-1)
           .attr('y', d => y(d.rank)+5);

        bars
         .exit()
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('width', d => x(d.value)-x(0)-1)
           .attr('y', d => y(top_n+1)+5)
           .remove();

        let labels = svg_race.selectAll('.label')
           .data(yearSlice, d => d.name);

        labels
         .enter()
         .append('text')
         .attr('class', 'label')
         .attr('x', d => x(d.value)-8)
         .attr('y', d => y(top_n+1)+5+((y(1)-y(0))/2))
         .style('text-anchor', 'end')
         .html(d => d.name)
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);


    	   labels
           .transition()
           .duration(tickDuration)
             .ease(d3.easeLinear)
             .attr('x', d => x(d.value)-8)
             .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

        labels
           .exit()
           .transition()
             .duration(tickDuration)
             .ease(d3.easeLinear)
             .attr('x', d => x(d.value)-8)
             .attr('y', d => y(top_n+1)+5)
             .remove();



        let valueLabel_races = svg_race.selectAll('.valueLabel_race')
        .data(yearSlice, d => d.name);

        valueLabel_races
           .enter()
           .append('text')
           .attr('class', 'valueLabel_race')
           .attr('x', d => x(d.value)+5)
           .attr('y', d => y(top_n+1)+5)
           .text(d => d3.format(',.0f')(d.lastValue))
           .transition()
             .duration(tickDuration)
             .ease(d3.easeLinear)
             .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1);

        valueLabel_races
           .transition()
             .duration(tickDuration)
             .ease(d3.easeLinear)
             .attr('x', d => x(d.value)+5)
             .attr('y', d => y(d.rank)+5+((y(1)-y(0))/2)+1)
             .text(d => d3.format(',.0f')(d.value))


       valueLabel_races
         .exit()
         .transition()
           .duration(tickDuration)
           .ease(d3.easeLinear)
           .attr('x', d => x(d.value)+5)
           .attr('y', d => y(top_n+1)+5)
           .remove();

       yearText.html(~~year);

      if(year == 2020) ticker.stop();
      year = d3.format('.1f')((+year) + 0.1);
    },tickDuration);

  });

}
d3.select("#selectButtonCountry_race").on("click", function(d) {
  count= count+1
  if (count >2 )  ticker.stop();

})
d3.select("#selectButtonCountry_race").on("change", function(d) {
    // recover the option that has been chosen
    selectedCountry_race = d3.select(this).property("value")
    // run the update_race function with this selected option
    update_race(concatenate_options_race())

})
function concatenate_options_race(){
      return "https://raw.githubusercontent.com/com-480-data-visualization/com-480-project-coviz-19/master/full_website/data/race/"+selectedCountry_race+".csv"


    }
