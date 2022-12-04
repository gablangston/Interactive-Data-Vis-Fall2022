 /* CONSTANTS AND GLOBALS */
 const margin = { top: 20, bottom: 30, left: 50, right: 20 },
 width = window.innerWidth * 0.7 - margin.left - margin.right,
 height = window.innerHeight * 0.7 - margin.top - margin.bottom;

/* PARSE THE MONTHS */
const parseTime = d3.timeParse("%m");

// SCALES - x and y
const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

/* DEFINE AND ADD AREA */
const area = d3.area()
    .x(function(d) { return x(d.Month); })
    .y0(height)
    .y1(function(d) { return y(d.CPI_percent); });

/* LINE GENERATOR */
const genline = d3.line()
    .x(function(d) { return x(d.Month); })
    .y(function(d) { return y(d.CPI_percent); });

// CREATE SVG ELEMENT
const svg = d3.select("#container").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
   .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

 /* LOAD CPI DATA */
d3.csv('../data/CPI_2022.csv').then(function(data) {

/* FORMAT NEWLY IMPORTED DATA */
  data.forEach(d => {
      d.Month = parseTime(d.Month);
      d.CPI_percent = +d.CPI_percent;
  });

  /* SCALE DATA RANGE */
  x.domain(d3.extent(data, d =>  d.Month));
  y.domain([0, d3.max(data, d => d.CPI_percent)]);

  /* ADDING AREA */
    svg.append("path")
       .data([data])
       .attr("class", "area")
       .attr("d", area);

  /* APPENDING LINE GENERATOR */
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", genline);

  /* X Axis */
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  /* X-AXIS LABEL */
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("CPI %")

  /* Y AXIS AND Y-AXIS LABELS*/
  svg.append("g")
      .call(d3.axisLeft(y));

  svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .style("text-anchor", "middle")
      .text("Month")

});