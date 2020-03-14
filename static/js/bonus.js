 // function to create the gauge plot for weekly washing frequence (called from app.js)
function buildGauge(wfreqData) {

    console.log(wfreqData);

    let value = parseFloat(wfreqData) * 20; // decides the span of the needle in each section
    let degrees = 180 - value // needle degree based on each value 
    let radius = 0.5;
    let radians = degrees * Math.PI / 180;
    let x = radius * Math.cos(radians); // x coordinate of the needle
    let y = radius * Math.sin(radians); // y coordinate of the needle

    // setting up path to create a triangle 
    let mainPath = "M -.0 -0.025 L .0 0.025 L ",
        pathX = String(x),
        space = " ",
        pathY = String(y),
        pathEnd = " Z";
    let path = mainPath.concat(pathX, space, pathY, pathEnd);

    // plotly trace
    let gaugeData = [
        // needle center coordinate and shape
        {
            type: "scatter",
            x: [0],
            y: [0],
            marker: {
                size: 13,
                color: "black"
            },
            name: "Wash Frequence",
            text: wfreqData,
            hoverinfo: "name+text",
            showlegend: false,
        },
        // pie chart converted into half by setting up 50% of it to have same color as the background (white in this case)
        {
            type: "pie",
            showlegend: false,
            hole: 0.45,
            rotation: 90,

            values: [100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100], // divided into part1 and part2. Part1 divided into 9 equal sections
            text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            direction: "clockwise",
            textinfo: "text",
            textposition: "inside",
            marker: {
                colors: [
                    "rgba(240, 230, 215, .5)",
                    "rgba(232, 226, 202, .5)",
                    "rgba(210, 206, 145, .5)",
                    "rgba(202, 209, 95, .5)",
                    "rgba(170, 202, 42, .5)",
                    "rgba(110, 154, 22, .5)",
                    "rgba(14, 127, 0, .5)",
                    "rgba(10, 120, 22, .6)",
                    "rgba(0, 105, 11, .6)",
                    "rgba(255, 255, 255, 0)"
                ]
            },
            labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", ""],
            hoverinfo: "label"
        }
    ];

    // plotly layout
    let gaugeLayout = {
        shapes: [{
            type: "path",
            path: path,
        }],

        height: 600,
        width: 600,
        title: ("Belly Button Washing Frequency Scrubs Per Week"),
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        },

        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1]
        }
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
}
