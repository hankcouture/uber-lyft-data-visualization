// Show a hidden d3 element
d3.selection.prototype.show = function() {
  this.style('display', 'initial');
  return this;
}

// Hide a d3 element
d3.selection.prototype.hide = function() {
  this.style('display', 'none');
  return this;
}

// Grab data from data.js file
// var data = data.rideData.numberOfRides;

function makeBarChart(className, data) {

    // Set our margins
    var margin = {
        top: 20,
        right: 20,
        bottom: 70,
        left: 60
    },
    width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Our X scale
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    // Our Y scale
    var y = d3.scale.linear()
        .rangeRound([height, 0]);

    // Our color bands
    var color = d3.scale.ordinal()
        .range(["#1a1a1a", "#474747", "#EA0B8C", "#a30762"]);

    // Use our X scale to set a bottom axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // Same for our left axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")

    // Add our chart to the #chart div
    var svg = d3.select(".graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", className)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Map our columns to our colors
    color.domain(d3.keys(data[0]).filter(function (key) {
        return key !== "Date";
    }));

    data.forEach(function (d) {
        var y0 = 0;
        d.types = color.domain().map(function (name) {
            return {
                name: name,
                y0: y0,
                y1: y0 += +d[name]
            };
        });
        d.total = d.types[d.types.length - 1].y1;
    });

    // Our X domain is our set of years
    x.domain(data.map(function (d) {
        return d.Date;
    }));

    // Our Y domain is from zero to our highest total
    y.domain([0, d3.max(data, function (d) {
        return d.total;
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)" )

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        // .append("text")
        //     .attr("class", "y label")
        //     .attr("text-anchor", "end")
        //     .attr("y", -50)
        //     .attr("dy", ".75em")
        //     .attr("transform", "rotate(-90)")
        //     .text("Y-Axis Label");


    var month = svg.selectAll(".Date")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function (d) {
        return "translate(" + x(d.Date) + ",0)";
    });

    function makeBars() {
        return month.selectAll("rect")
            .data(function (d) {
            return d.types;
        })
            .enter().append("rect")
            .attr("class", "bar")
            .attr("width", function(d) {
             return x.rangeBand();   
            })
            .attr("y", function (d) {
            return y(d.y1);
        })
            .attr("height", function (d) {
            return y(d.y0) - y(d.y1);
        })
            .style("fill", function (d) {
            return color(d.name);
        })
    }


    // Bar graph animation
    function intro(d) {
      d.hide()
      var original = d.attr('y');
      d.attr('y', height + 100)
      var t = 100;
      d.transition()
         .delay(t + (count*10))
         .duration(t * 5)
         .attr('y', original)
      d.show();
    }

    var bar = makeBars();
    var count = 0;
    bar.each(function(d) {
        intro(d3.select(this))
        count++;
    });

    // Bar Graph Legend
    var legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
    });

    legend.append("rect")
        .attr("x", width - (width - 118))
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - (width - 100))
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
        return d;
    });
}



// jQuery Tab Display
var rideCostClicked = false;
var rideMileageClicked = false;

$('.numberOfRidesTab').on('click', function(){
  $('.rideCost').hide();
  $('.rideMileage').hide();
  $('.numberOfRides').show();
})

$('.rideCostTab').on('click', function(){
    console.log('hi');
  if (!rideCostClicked) {
    $('.numberOfRides').hide();
    $('.rideMileage').hide();
    makeBarChart('rideCost', data.rideData.rideCost);
    rideCostClicked = true;
  } else {
    $('.numberOfRides').hide();
    $('.rideMileage').hide();
    $('.rideCost').show();
  }
})

$('.rideMileageTab').on('click', function(){
  if (!rideMileageClicked) {
    $('.numberOfRides').hide();
    $('.rideCost').hide();
    makeBarChart('rideMileage', data.rideData.rideMileage);
    rideMileageClicked = true;
  } else {
    $('.numberOfRides').hide();
    $('.rideCost').hide();
    $('.rideMileage').show();
  }
})


$(document).ready(function() {
  makeBarChart('numberOfRides', data.rideData.numberOfRides);
  $('.numberOfRidesButton').focus();
});

