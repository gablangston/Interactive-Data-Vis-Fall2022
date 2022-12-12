// Placing all chart types here

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

// Load datasets for map: school locations and NYC Boroughs GeoJSON 

 Promise.all([
  d3.json("../data/NYCBoroughs.json"),
  d3.csv("../data/2019_-_2020_School_Locations.csv", d3.autoType),
]).then(([geojson, school]) => {
  console.log('school', school)

   // CREATE SVGS AND ACCOMPANYING TEXT
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  svg.append("text")
  .attr("x", (width / 2))             
  .attr("y", margin.top)
  .attr("text-anchor", "left")  
  .style("font-size", "18px")  
  .text("School Locations in NYC - FY2020");
  
  // SPECIFY PROJECTION - Albers
  const projection = d3.geoAlbersUsa()
    .fitSize([width, height], geojson)

   // DEFINE PATH FUNCTION
  const pathGen = d3.geoPath(projection)

    // APPEND GEOJSON PATH  
    // OUTLINE NYC Boroughs (Abbr. as Boros)
  const boros = svg.selectAll("path.boros")
    .data(geojson.features)
    .join("path")
    .attr("class", "boros")
    .attr("d", coords =>pathGen(coords))
    .attr("fill", "lightblue")
    .attr("stroke", "black")
    
  // Apend School Locations data and add shapes
  const schools = svg.selectAll("circle.schools")
  .data(school)
  .join("circle")
  .attr("class", "schools")
  .attr("r", 2)
  .attr("transform", (d) => {
    const [x,y] = projection([d.Long,d.Lat])
    return `translate(${x}, ${y})`

})

});