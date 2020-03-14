function buildMetadata(sample) {
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(data) {
        console.log(data)
        const metadataPanel = d3.select("#sample-metadata")
        metadataPanel.html("")
        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(data).forEach(([key, value]) => {
            metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`)
        })
        // BONUS: Build the Gauge Chart
        buildGauge(data.WFREQ);
    })
}

function buildCharts(sample) {

    d3.json(`/samples/${sample}`).then(function(data) {
        const otuId = data.otu_ids
        const sampleValues = data.sample_values
        const otuLabels = data.otu_labels

        // bubble plot
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

        // pie chart using slice() to grab the top 10 sample_values
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
        }

        Plotly.newPlot("pie", plotPieData, pieLayout)
    })  
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(`BB_${sample}`)
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