document.addEventListener("DOMContentLoaded", () => {
    // ! API LINKS ! //
    const educationUS = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
    const countyUS = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

    // ! GLOBAL CONSTANTS ! //
    let currentTopoData;
    // ^ BODY DECLARATION ^ //
    const body = d3.select("body");
    // ^ CREATE GENERAL CONTAINER ^ //
    const generalContainer = body.append("div").attr("class", "general_container");

    // ^ CREATE TITLE SECTION ^ //
    const titleSection = generalContainer.append("section").attr("id", "title_section").style("padding", "20px 0 0 0");
    // ^ CREATE TITLE ^ //
    titleSection.append("h1").attr("class", "map_title").attr("id", "title").html("United States Educational Attainment");
    // ^ CREATE SUBTITLE ^ //
    titleSection.append("h2").attr("class", "map_subtitle").attr("id", "subtitle").html("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");

    // ^ CREATE MAP CONTAINER ^ //
    const mapSection = generalContainer.append("section", "map_section");

    // ^ CREATE TOOLTIP ^ //
    const tooltip = body.append("div").attr("class", "tooltip").attr("id", "tooltip").style("opacity", 0);

    const generateTopoMap = (data, data_features) => {
        return topojson.feature(data, data_features).features;
    };

    // ! FETCH FUNCTION! //
    const fetchData = async () => {
        // & FETCH RAW DATA &//
        // ^ EDUCATION DATA ^ //
        const rawDataEducation = await d3.json(educationUS);
        console.log(rawDataEducation);

        // ^ COUNTRY DATA ^ //
        const rawDataCountry = await d3.json(countyUS);
        console.log(rawDataCountry);
        const objectDataCountries = rawDataCountry.objects;
        console.log(objectDataCountries);

        const path = d3.geoPath();
        const topoDataNation = generateTopoMap(rawDataCountry, objectDataCountries.nation);
        const topoDataStates = generateTopoMap(rawDataCountry, objectDataCountries.states);
        const topoDataCounties = generateTopoMap(rawDataCountry, objectDataCountries.counties);
        console.log(topoDataCounties);

        /*  const minScale = 2.6;
        const maxScale = 75.1;
        const scaleSteps = 8; */

        const minScale = 2.6;
        const maxScale = 75.1;
        const scaleSteps = 8;
        //!  //
        const mapDimentions = {
            mapWidth: 1000,
            mapHeight: 600,
            legendHeight: 50,
        };

        const colorScheme = {
            neonScheme: ["#F72585", "#B5179E", "#730e92", "#560BAD", "#480CA8", "#3F37C9", "#4895EF", "#4CC9F0"],
            astheticScheme: ["#B5179E", "#C448B6", "#D379CE", "#E2AAE6", "#F0DBFD", "#C7D7FA", "#9ED2F7", "#75CEF4"],
            purpleSchema: ["#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
            orangeSchema: ["#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
        };

        /*  */
        const xScale = d3
            .scaleLinear()
            .domain([minScale, maxScale])
            .rangeRound([500, mapDimentions.mapWidth - 20]);

        const colorThreshold = d3
            .scaleThreshold()
            .domain(d3.range(minScale, maxScale, (maxScale - minScale) / scaleSteps))
            .range(colorScheme.neonScheme);

        // ! CREATING SVG ! //
        // ^ CREATE MAP PATH ^ //
        const mapSVG = mapSection
            .append("svg")
            .attr("class", "map")
            .attr("height", mapDimentions.mapHeight + mapDimentions.legendHeight)
            .attr("width", mapDimentions.mapWidth);

        const xAxesLabel = mapSVG.append("g").attr("class", "key").attr("id", "legend").attr("transform", "translate(0,40)");

        xAxesLabel
            .selectAll("rect")
            .data(
                colorThreshold.range().map((color) => {
                    console.log(color);
                    color = colorThreshold.invertExtent(color);
                    console.log(color);
                    if (color[0] === null) {
                        color[0] = xScale.domain()[0];
                    }
                    if (color[1] === null) {
                        color[1] = xScale.domain()[1];
                    }
                    return color;
                })
            )
            .enter()
            .append("rect")
            .attr("height", 10)
            .attr("x", (data) => xScale(data[0]))
            .attr("width", (data) => (data[0] && data[1] ? xScale(data[1]) - xScale(data[0]) : xScale(null)))
            .attr("fill", (data) => colorThreshold(data[0]));

        xAxesLabel.append("text").attr("class", "caption").attr("x", xScale.range()[0]).attr("y", 20).attr("fill", "#000").attr("text-anchor", "start").attr("font-weight", "bold");

        xAxesLabel
            .call(
                d3
                    .axisBottom(xScale)
                    .tickSize(12)
                    .tickFormat((tic) => tic)
                    .tickValues(colorThreshold.domain())
                    .tickFormat((item) => Math.round(item) + "%")
            )
            .select(".domain")
            .remove();
        /*  */
        mapSVG
            .append("g")
            .attr("class", "counties")
            .selectAll("path")
            .data(topoDataCounties)
            .enter()
            .append("path")
            .attr("class", "county")
            .attr("data-fips", (data) => {
                return data.id;
            })
            .attr("data-education", (data) => {
                const resp = rawDataEducation.filter((item) => item.fips === data.id);
                if (resp[0]) {
                    return resp[0].bachelorsOrHigher;
                }
                console.log(`No data for: ${data.id}`);
                return 0;
            })
            .attr("fill", (data) => {
                const result = rawDataEducation.filter((item) => item.fips === data.id);
                if (result[0]) {
                    return colorThreshold(result[0].bachelorsOrHigher);
                }
                return colorThreshold(0);
            })
            .attr("height", mapDimentions.mapHeight)
            .attr("width", mapDimentions.mapWidth)
            .attr("d", path)
            .attr("transform", `translate(0,${mapDimentions.legendHeight})`);
    };
    fetchData();
});
