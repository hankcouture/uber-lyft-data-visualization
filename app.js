// Grab data from data.js file
var rideData = data.rideData.data;
var length = rideData.length;

// Show a hidden d3 element.
d3.selection.prototype.show = function() {
  this.style('display', 'initial');
  return this;
}

// Hide a d3 element.
d3.selection.prototype.hide = function() {
  this.style('display', 'none');
  return this;
}

// Add an svg image to <body>
//   and return its d3 object.
function svgMaker(w, h) {
  return d3.select('body')
             .append('svg')
             .attr('width', w)
             .attr('height', h);
}

// Add text to a d3 object
//   and return the d3 object for the text.
function textMaker(dataset) {
  return this.selectAll('text')
             .data(dataset)
             .enter()
             .append('text')
}

// Create Bar Graph
function barGraph() {
  var w = 1000;
  var h = 500;;
  var padding = 10;

  var svg = svgMaker(w, h)

  function intro(d) {
      d.hide()
      var original = d.attr('y');
      d.attr('y', h)
      var t = 150;
      d.transition()
         .delay(t)
         .duration(t * (count / 2))
         .attr('y', original)
      d.show();
    }

  function makeBars() {
    return svg.selectAll('rect')
        .data(rideData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d, i) {
          return i * ((w - 40) / rideData.length) + 20;
        })
        .attr('y', function(d) {
          return h - (d[1]*30) //Height minus data value
        })
        .attr('width', (w / rideData.length - padding))
        .attr('height', function(d) {
          return (h) - d3.select(this).attr('y') //Data value
        })
        .attr('fill', function(d) {
          var b = Math.round(d[1])+120;
          var color = 'rgb(76, 175, ' + b + ')';
          return color;
        });
    }

  function makeBarLabels() {
    return textMaker.call(svg, rideData)
      .text(function(d) {
        var barText = Math.round(d[1]) + ' rides';
        return barText;
      })

      .attr('x', function(d, i) {
        return i * ((w - 40) / rideData.length) + 23;
        //return i * (w / usPopDataData.length) + 8;
      })
      .attr('y', function(d, i) {
        return h - (d[1]*30+10);
      })
      .attr('fill', 'black')
      .attr('font-size', '12px')
      .attr('style', 'opacity:0')
  }


  var bars = makeBars();
  var count = 0;
  bars.each(function(d) {
    intro(d3.select(this))
    count++;
  });

  var barLabels = makeBarLabels()
  delay = (rideData.length/2*150)-500
  barLabels.transition()
       .delay(delay)
       .duration(2000)
       .style({
         'opacity': '1'
       });
  delay += 2000;

}


barGraph();



