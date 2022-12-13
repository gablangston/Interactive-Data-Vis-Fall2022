/* CONSTANTS AND GLOBALS */
const width = 600;
const height = 600;
const padding = 50;

// Load datasets for map: school locations and NYC Boroughs GeoJSON 

Promise.all([
    d3.json('../data/NYCBoroughs.json'),
    d3.csv('../data/school_locations.csv', d3.autotype),
]).then(([geojson, school]) => {
    console.log('school', school)

    // CREATE SVG
    const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "AntiqueWhite");

    // SPECIFY PROJECTION - ALBERS
    const projection = d3.geoAlbersUsa()
    .fitSize([width, height], geojson)

    // DEFINE PATH FUNCTION
    const pathGen = d3.geoPath(projection)

    // APPEND GEOJSON PATH AND OUTLINE NYC BOROUGHS
    const boros = svg.selectAll("path.boros")
    .data(geojson.features)
    .join("path")
    .attr("class", "boros")
    .attr("d", coords => pathGen(coords))
    .attr("fill", "transparent")
    .attr("stroke", "black")

    // APPEND SCHOOL LOCATIONS DATA AND ADD SHAPES
    const schools = svg.selectAll("circle.schools")
    .data(school)
    .join("circle")
    .attr("class", "schools")
    .attr("r", 2)
    .attr("transform", (d) => {
        const [x,y] = projection([d.Long,d.Lat])
        return `translate(${x}, ${y})`
    })

    // CHART LABELS
    svg.append("text")
    .attr("x", width / 2)
    .attr("y",margin.top)
    .attr("text-anchor", "middle")
    .style("font-size", "26px")
    .text("School Locations in NYC");
});


//Vertical bar chart - Speeding in school zones in each borough

/* LOAD DATA */

d3.csv('../data/borough_violations.csv', d3.autoType)
    .then(dataset0 => {
        console.log("data", dataset0)

        // SORT DATA IN ASCENDING ORDER
        dataset0.sort((a,b)=>a.school_zone_speeding_violation-b.school_zone_speeding_violation)

        const svg = d3.select("#container1")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "AntiqueWhite")

        const boros = dataset0.map(d => d.violation_borough)

        /* SET X AND Y SCALES / AXIS */

        const xScale = d3.scaleBand()
            .domain(boros)
            .range([padding * 1.5, width - padding])
            .paddingInner(.4)

        const yScale = d3.scaleLinear()
            .domain(d3.extent(dataset0, d => d.school_zone_speeding_violation))
            .range([height - padding * 1.5, padding])
            .nice()

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        //ESTABLISH VERTICAL BARS
        svg.selectAll(".bars")
            .data(dataset0)
            .join("rect")
            .attr("class", "bars")
            .attr("x", d => xScale(d.violation_borough))
            .attr("y", d => yScale(d.school_zone_speeding_violation))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - yScale(d.school_zone_speeding_violation) - padding * 1.5)
            .attr("fill", "orange");

        // DEVELOP AXES LINES
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (height - padding * 1.5) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding * 1.5 + ",0)")
            .call(yAxis);

        // LABELS: TITLE, LABELS FOR X AND Y AXIS
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", padding / 1.25)
            .attr("text-anchor", "middle")
            .style("font-size", "26px")
            .text("Speeding in School Zones Violations - Fiscal Year 2020");

        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height - padding / 2) + ")")
            .style("text-anchor", "middle")
            .text("Borough");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height / 2))
            .attr("y", padding / 2)
            .style("text-anchor", "middle")
            .text("Number of Violations");

    })

// Horizontal Bar Chart - Median Income per Borough

/* LOAD DATA - MEDIAN INCOME PER BOROUGH */

d3.csv('../data/median_income.csv', d3.autoType)
    .then(dataset1 => {
        console.log("data", dataset1)

        // SORT DATA IN ASCENDING ORDER
        //dataset1.sort((a,b)=>a.median_income-b.median_income)

        const svg = d3.select("#container2")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background-color", "AntiqueWhite")

        const boroughs = dataset1.map(d => d.borough)

        /* ESTABLISH X AND Y SCALES */

        const xScale = d3.scaleLinear()
            .domain(d3.extent(dataset1, d => d.median_income))
            .range([padding * 2, width - padding])
            .nice()
            
        const yScale = d3.scaleBand()
            .domain(boroughs)
            .range([height - padding * 1.5, padding])
            .paddingInner(.4)

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // CUSTOMIZE BARS
        const bars = svg.selectAll("rect.bars")
            .data(dataset1)
            .join("rect")
            .attr("class", "bars")
            .attr("y", d => yScale(d.borough))
            .attr("x", padding * 2)
            .attr("width", d => width - xScale(d.median_income) - padding * 1.5)
            .attr("height", yScale.bandwidth())
            .attr("fill", "green")

        // DEVELOP AXES LINES
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + (height - padding * 1.5) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + padding * 2 + ",0)")
            .call(yAxis);

        // CREATE LABELS: TITLE, X AND Y AXIS
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", padding / 1.25)
            .attr("text-anchor", "middle")
            .style("font-size", "26px")
            .text("Median Income per Borough in 2020");

        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height - padding / 2) + ")")
            .style("text-anchor", "middle")
            .text("Median Income (in dollars)");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(height / 2))
            .attr("y", padding / 2)
            .style("text-anchor", "middle")
            .text("Borough");
    })