function buildCharts(sample) {
  console.log('Building charts for sample:', sample);

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      console.log('Raw data:', data);

      // Get the samples field
      let samples = data.samples;
      console.log('Samples:', samples);

      // Filter the samples for the object with the desired sample number
      let result = samples.filter(sampleObj => sampleObj.id === sample)[0];
      console.log('Filtered result:', result);

      // Get the otu_ids, otu_labels, and sample_values
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;

      console.log('OTU IDs:', otu_ids);
      console.log('OTU Labels:', otu_labels);
      console.log('Sample Values:', sample_values);

      // Build a Bubble Chart
      let bubbleTrace = {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: 'Viridis'
          }
      };

      console.log('Bubble Trace:', bubbleTrace);

      let bubbleLayout = {
          title: 'Bubble Chart of Sample Values',
          xaxis: { title: 'OTU ID' },
          yaxis: { title: 'Sample Values' }
      };

      console.log('Bubble Layout:', bubbleLayout);

      Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout).then(() => {
          console.log('Bubble chart rendered successfully');
      });

      // Build a Bar Chart
      let yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
      let barTrace = {
          x: sample_values.slice(0, 10).reverse(),
          y: yticks,
          text: otu_labels.slice(0, 10).reverse(),
          type: 'bar',
          orientation: 'h'
      };

      console.log('Bar Trace:', barTrace);

      let barLayout = {
          title: 'Top 10 OTUs',
          xaxis: { title: 'Sample Values' },
          yaxis: { title: 'OTU ID' }
      };

      console.log('Bar Layout:', barLayout);

      Plotly.newPlot('bar', [barTrace], barLayout).then(() => {
          console.log('Bar chart rendered successfully');
      });
  });
}

function buildMetadata(sample) {
  console.log('Building metadata for sample:', sample);

  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      let metadata = data.metadata;
      console.log('Metadata:', metadata);

      let result = metadata.filter(meta => meta.id === parseInt(sample))[0];
      console.log('Filtered metadata:', result);

      let metadataPanel = d3.select('#sample-metadata');
      metadataPanel.html("");  // Clear existing metadata

      for (const [key, value] of Object.entries(result)) {
          metadataPanel.append('p').text(`${key}: ${value}`);
      }
  });
}

function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      let sampleNames = data.names;
      let selector = d3.select('#sampleSelector');

      sampleNames.forEach((sample) => {
          selector.append('option').text(sample).property('value', sample);
      });

      // Build charts and metadata for the first sample
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });

  d3.select('#sampleSelector').on('change', function() {
      let selectedSample = d3.select(this).property('value');
      buildCharts(selectedSample);
      buildMetadata(selectedSample);
  });
}

init();
