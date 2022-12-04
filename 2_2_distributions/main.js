/* CONSTANTS AND GLOBALS */

const width = window.innerWidth * .7;
height = window.innerHeight * 0.7;
margin = { top: 20, bottom: 50, left: 60, right: 65 }
radius = { min: 1, max:15};
colors = {R: '#741e2e', D: '#446ee6'}

/* LOAD DATA */
d3.json('../data/environmentRatings.json', d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */
    // Define x and y axis plus color scales
    const xScale = d3.scaleLinear()
    .domain([d3.min(data.map(d => d.ideologyScore2020)), d3.max(data.map(d => d.ideologyScore2020))])
    .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.envScoreLifetime), d3.max(data, d => d.envScoreLifetime)])
    .range([height - margin.bottom, margin.top])

    const colorScale = d3.scaleOrdinal()
    .domain(["R", "D"])
    .range([colors.R, colors.D, "blue"])

    const sizeScale = d3.scaleSqrt()
    .domain([d3.min(data, d => d.envScore2020), d3.max(data, d => d.envScore2020)])
    .range([radius.min, radius.max])
    console.log(sizeScale)

    /* HTML ELEMENTS */

    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    const xAxis = d3.axisBottom(xScale)
    svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis);

    const dot = svg
    .selectAll("circle")
    .data(data, d => d.team) // second argument is the unique key for that row
    .join("circle")
    .attr("cx", d => xScale(d.ideologyScore2020))
    .attr("cy", d => yScale(d.envScoreLifetime))
    .attr("r", d => sizeScale(d.envScore2020))
    .attr("fill", d => colorScale(d.Party))
    .attr("class", "bubble")
    
  });