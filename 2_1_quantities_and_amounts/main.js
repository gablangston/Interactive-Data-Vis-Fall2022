
/* CONSTANTS AND GLOBALS */

const width = window.innerWidth * .9;
const height = 500;
const margin = 50;

// Using squirrel activities dataset

d3.csv('../data/squirrelActivities.csv', d3.autoType)
  .then(data => {
    console.log("data", data) 

    // sort data in increasing order
    data.sort((a,b)=>b.count-a.count)

    // Appending SVG

    const svg = d3.select("#container").append("svg")
    .attr("width",width)
    .attr("height",height)
    .style("overflow", "visible")

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    // Create x and y scales

    const xScale = d3.scaleLinear()
      .domain([0,Math.max(...data.map(d=> d.count))])
      .range([margin,width-margin]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.activity))
      .range([height-margin,margin])
      .padding(0.1);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    // Establish bars: color, size, etc.

    svg.selectAll("rect.bar")
    .data(data)
    .join("rect")
    .attr("class","bar")
    .attr("fill", "green")
    .attr("x",margin)
    .attr("y", d=>yScale(d.activity))
    .attr("height",yScale.bandwidth())
    .attr("width",d=>xScale(d.count));

    // Continuing to append SVG
    svg.append("g")
  .style("transform",`translate(0px,${height-margin}px)`)
  .call(xAxis);
  svg.append("g")
  .style("transform",`translate(${margin}px,0px)`)
  .call(yAxis);

  })