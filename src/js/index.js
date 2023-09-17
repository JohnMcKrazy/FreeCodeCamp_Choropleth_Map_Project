document.addEventListener("DOMContentLoaded", () => {
    const deleteChildElements = (parentElement) => {
        let child = parentElement.lastElementChild;
        while (child) {
            parentElement.removeChild(child);
            child = parentElement.lastElementChild;
        }
    };
    const deleteArrElements = (parentElement) => {
        while (parentElement.length > 0) {
            parentElement.forEach((item) => {
                parentElement.pop(item);
            });
        }
    };
    const selectActions = (status) => {
        if (status === close) {
            selectorState = open;
            schemeBtnsContainer.style.display = "block";
            arrow.style.rotate = "180deg";

            /* console.log("Abriendo botones"); */
            setTimeout(() => {
                schemeBtnsContainer.style.opacity = 1;
                schemeBtnsContainer.style.transform = "translate(-50%, 60px)";
            }, 250);
        } else if (status === open) {
            selectorState = close;

            arrow.style.rotate = "0deg";
            schemeBtnsContainer.style.opacity = 0;
            schemeBtnsContainer.style.transform = `translate(-50%, 0)`;
            /* console.log("Cerrando botones"); */
            setTimeout(() => {
                schemeBtnsContainer.style.display = "none";
            }, 250);
        }
    };
    // ! API LINKS ! //
    const educationUS = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
    const countyUS = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

    // ! GLOBAL CONSTANTS ! //
    let currentTopoData;
    // ^ BODY DECLARATION ^ //
    const body = d3.select("body");
    // ^ CREATE GENERAL CONTAINER ^ //
    const generalContainer = document.querySelector(".general_container");
    const selectorDropDown = document.querySelector(".btn_dropDown");
    const schemeBtnsContainer = document.querySelector(".scheme_btns_container");
    const schemeBtnTemplate = document.querySelector("#btn_scheme_template").content;
    const arrow = document.querySelector("#arrow_svg");
    // ^ CREATE TITLE SECTION ^ //
    const titleSection = d3.select(generalContainer).append("section").attr("id", "title_section").style("margin", "6rem 0 0");
    // ^ CREATE TITLE ^ //
    titleSection.append("h1").attr("class", "map_title").attr("id", "title").html("United States Educational Attainment");
    // ^ CREATE SUBTITLE ^ //
    titleSection.append("h2").attr("class", "map_subtitle").attr("id", "description").html("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");

    // ^ CREATE MAP CONTAINER ^ //
    const mapSection = d3.select(generalContainer).append("section").attr("class", "map_section");

    // ^ CREATE TOOLTIP ^ //
    const tooltip = body.append("div").attr("class", "tooltip").attr("id", "tooltip").style("opacity", 0);

    tooltip
        .append("h1")
        .attr("id", "provisional")
        .html(
            `<h1 class="data_state"></h1>
    <h2 class="data_countie"></h2>
    <p class="data_education" data-education=""></p>`
        );
    /* const tooltip = document.querySelector(".tooltip"); */

    const stateDataTip = document.querySelector(".data_state");
    const countieDataTip = document.querySelector(".data_countie");
    const educationDataTip = document.querySelector(".data_education");
    const generateTopoMap = (data, data_features) => {
        return topojson.feature(data, data_features).features;
    };

    /* 
        //^ DATES DATA  //
        const yearsDate = basicData.map( (item)=> new Date(item[0]));
        //^ DATES DATA MAX AND MIN  //
        const xMax = new Date(d3.max(yearsDate));
        const xMin = new Date(d3.min(yearsDate));
 */

    const close = "close";
    const open = "open";
    let selectorState = close;
    const minScale = 2.6;
    const maxScale = 75.1;
    const scaleSteps = 8;
    //!  //
    const mapDimentions = {
        mapWidth: 1000,
        mapHeight: 600,
        legendHeight: 50,
    };

    const colorScheme = [
        {
            name: "Neon",
            type: "divergin",
            colors: ["#F72585", "#B5179E", "#730e92", "#560BAD", "#480CA8", "#3F37C9", "#4895EF", "#4CC9F0"],
        },
        {
            name: "Ashtetic",
            type: "divergin",
            colors: ["#B5179E", "#C448B6", "#D379CE", "#E2AAE6", "#F0DBFD", "#C7D7FA", "#9ED2F7", "#75CEF4"],
        },
        {
            name: "Purple",
            type: "linear",
            colors: ["#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
        },
        {
            name: "Orange",
            type: "linear",
            colors: ["#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
        },
    ];
    const mapFragment = document.createDocumentFragment();
    /* console.log(colorScheme); */
    colorScheme.forEach((scheme) => {
        /* console.log(scheme); */
        const cloneTemplate = schemeBtnTemplate.cloneNode(true);
        let newBtn = cloneTemplate.querySelector(".btn_scheme");
        newBtn.textContent = scheme.name;
        newBtn.setAttribute("data-scheme", scheme.name);
        /* console.log(scheme); */
        if (scheme.type === "linear") {
            document.querySelector(".linear_schemes").append(newBtn);
        } else if (scheme.type === "divergin") {
            document.querySelector(".divergin_schemes").append(newBtn);
        }
    });

    setTimeout(() => {
        const schemeBtns = document.querySelectorAll(".btn_scheme");
        schemeBtns.forEach((btn) => {
            const thisData = btn.getAttribute("data-scheme");
            const newItem = colorScheme.filter((item) => item.name === thisData);
            btn.addEventListener("click", () => {
                deleteArrElements(mapFragment);
                deleteChildElements(document.querySelector(".map_section"));
                console.log(newItem[0].colors);
                fetchData(newItem[0].colors);
                selectActions(selectorState);
            });
        });
    }, 250);
    const statesList = {
        AL: "Alabama",
        AK: "Alaska",
        AZ: "Arizona",
        AR: "Arkansas",
        CA: "California",
        CO: "Colorado",
        CT: "Connecticut",
        DE: "Delaware",
        FL: "Florida",
        GA: "Georgia",
        HI: "Hawaii",
        ID: "Idaho",
        IL: "Illinois",
        IN: "Indiana",
        IA: "Iowa",
        KS: "Kansas",
        KY: "Kentucky",
        LA: "Louisiana",
        ME: "Maine",
        MD: "Maryland",
        MA: "Massachusetts",
        MI: "Michigan",
        MN: "Minnesota",
        MS: "Mississippi",
        MO: "Missouri",
        MT: "Montana",
        NE: "Nebraska",
        NV: "Nevada",
        NH: "New Hampshire",
        NJ: "New Jersey",
        NM: "New Mexico",
        NY: "New York",
        NC: "North Carolina",
        ND: "North Dakota",
        OH: "Ohio",
        OK: "Oklahoma",
        OR: "Oregon",
        PA: "Pennsylvania",
        RI: "Rhode Island",
        SC: "South Carolina",
        SD: "South Dakota",
        TN: "Tennessee",
        TX: "Texas",
        UT: "Utah",
        VT: "Vermont",
        VA: "Virginia",
        WA: "Washington",
        WV: "West Virginia",
        WI: "Wisconsin",
        WY: "Wyoming",
    };

    // ! FETCH FUNCTION! //
    const fetchData = async (schemeColor) => {
        // & FETCH RAW DATA &//
        // ^ EDUCATION DATA ^ //
        const rawDataEducation = await d3.json(educationUS);
        /* console.log(rawDataEducation); */

        // ^ COUNTRY DATA ^ //
        const rawDataCountry = await d3.json(countyUS);
        /* console.log(rawDataCountry); */
        const objectDataCountries = rawDataCountry.objects;
        /* console.log(objectDataCountries); */

        const path = d3.geoPath();
        const topoDataNation = generateTopoMap(rawDataCountry, objectDataCountries.nation);
        const topoDataStates = generateTopoMap(rawDataCountry, objectDataCountries.states);
        const topoDataCounties = generateTopoMap(rawDataCountry, objectDataCountries.counties);

        const xScale = d3
            .scaleLinear()
            .domain([minScale, maxScale])
            .rangeRound([500, mapDimentions.mapWidth - 20]);

        const colorThreshold = d3
            .scaleThreshold()
            .domain(d3.range(minScale, maxScale, (maxScale - minScale) / scaleSteps))
            .range(schemeColor);

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
                    /* console.log(color); */
                    color = colorThreshold.invertExtent(color);
                    /*  console.log(color); */
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
            .attr("transform", `translate(0,${mapDimentions.legendHeight})`)
            .on("mouseenter", (e, data) => {
                /* const positionData = rawDataCountry.filter((item) => item.id === data.id);
                console.log(positionData); */
                const tipData = rawDataEducation.filter((item) => item.fips === data.id);
                tooltip
                    .style("opacity", 1)
                    .style("translate", `${e.clientX + 10}px ${e.clientY - 40}px`)
                    .attr("data-education", tipData[0].bachelorsOrHigher);
                stateDataTip.textContent = `${statesList[tipData[0].state]}`;
                countieDataTip.textContent = `${tipData[0].area_name}`;
                educationDataTip.textContent = `${tipData[0].bachelorsOrHigher}%`;
            })
            .on("mouseleave", () => {
                tooltip.style("opacity", 0);
            });

        mapSVG
            .append("path")
            .datum(topojson.mesh(rawDataCountry, objectDataCountries.states, (a, b) => a !== b))
            .attr("class", "states")
            .attr("d", path)
            .attr("id", "legend")
            .attr("transform", `translate(0,${mapDimentions.legendHeight})`);
    };
    fetchData(colorScheme[0].colors);

    selectorDropDown.addEventListener("click", () => selectActions(selectorState));
});
