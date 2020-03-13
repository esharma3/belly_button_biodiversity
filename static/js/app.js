function buildMetadata(sample) {

    d3.json(`/metadata/${sample}`).then(function(data) {
        console.log(data)
        const metadataPanel = d3.select("#sample-metadata")
        metadataPanel.html("")
        Object.entries(data).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key}: ${value}`)
        })
        buildGauge(data.WFREQ);
    })

    // @TODO: Complete the following function that builds the metadata panel

    // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart

}

function buildGauge(wfreqData) {

    console.log(wfreqData);

    let value = parseFloat(wfreqData) * 21; // decides the span of the needle in each section
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
        // pie chart converted into half by setting 50% of it to have background color (white in this case)
        {
            type: 'pie',
            showlegend: false,
            hole: 0.45,
            rotation: 90,

            values: [100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100 / 9, 100], // divided into part1 and part2. Part1 divided into 9 equal sections
            text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ""],
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
            labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ""],
            hoverinfo: "label"
        }
    ];

    let plotGaugeData = [gaugeData]


    // plotly layout
    let gaugeLayout = {
        shapes: [{
            type: 'path',
            path: path,
        }],

        height: 600,
        width: 600,
        title: 'Belly Button Washing Frequency\nScrubs Per Week',
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


    Plotly.newPlot('gauge', gaugeData, gaugeLayout);

}

function buildCharts(sample) {

    d3.json(`/samples/${sample}`).then(function(data) {


        const otuId = data.otu_ids
        const sampleValues = data.sample_values
        const otuLabels = data.otu_labels

        let bubbleData = {
            x: otuId,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuId,
                colorscale: 'Earth'
            }
        }

        let plotBubbleData = [bubbleData]

        let bubbleLayout = {
            title: "Bubble Chart - Belly Button Samples",
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            }
        }

        Plotly.newPlot("bubble", plotBubbleData, bubbleLayout)


        let pieData = {
            values: sampleValues.slice(0, 10),
            labels: otuId.slice(0, 10),
            hovertext: otuLabels.slice(0, 10, ),
            type: "pie",
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
                    "rgba(102,205,170, 0.6)"
                ]
            },
        }

        let plotPieData = [pieData]

        let pieLayout = {
            title: "Pie Chart - Belly Button Samples",
            // xaxis: {title: "OTU ID"},
            // yaxis: {title: "Sample Values"}
        }

        Plotly.newPlot("pie", plotPieData, pieLayout)
    })

    // const pieColumn = d3.select("#pie")
    // const gaugeColumn = d3.select("#gauge")


    // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();