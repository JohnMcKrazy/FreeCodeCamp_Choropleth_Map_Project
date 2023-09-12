document.addEventListener("DOMContentLoaded", () => {
    // ! API LINKS ! //
    const educationUS = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
    const countyUS = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

    // ! GLOBAL CONSTANTS ! //
    // ^ BODY DECLARATION ^ //
    const body = d3.select("body");

    // ^ CREATE GENERAL CONTAINER ^ //
    const generalContainer = body.append("div").attr("class", ".general_container");

    // ^ CREATE TITLE SECTION ^ //
    const titleSection = generalContainer.append("section").attr("id", "title_section");
    // ^ CREATE TITLE ^ //
    titleSection.append("h1").attr("class", "map_title").attr("id", "title").html("Title");
    // ^ CREATE SUBTITLE ^ //
    titleSection.append("h2").attr("class", "map_subtitle").attr("id", "subtitle").html("Subtitle");

    // ^ CREATE MAP CONTAINER ^ //
    const mapSection = generalContainer.append("section", "map_section");

    // ^ CREATE TOOLTIP ^ //
    const tooltip = body.append("div").attr("class", "tooltip").attr("id", "tooltip").style("opacity", 0);

    // ^ CREATE MAP PATH ^ //
    const path = d3.geoPath();

    // ! FETCH FUNCTION! //
    const fetchData = async () => {
        // & FETCH RAW DATA &//
        const rawDataEducation = await d3.json(educationUS);
        console.log(rawDataEducation);
        const rawDataCountry = await d3.json(countyUS);
        console.log(rawDataCountry);

        // & BASIC DATA DECLARATION & //
        const objectDataCountries = rawDataCountry.objects;
        console.log(objectDataCountries);

        const countiesGeometryData = objectDataCountries.counties.geometries;
        const statesGeometryData = objectDataCountries.states.geometries;
        const nationGeometryData = objectDataCountries.nation.geometries;
    };
    fetchData();
});
