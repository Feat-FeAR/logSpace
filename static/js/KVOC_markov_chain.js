// JavaScript implementation of a two-state ion channel with a constant
// transition matrix (JS translation of './static/codes/K2P_markov_chain.R').


// --- Variable Assignments ----------------------------------------------------

// List of all the possible states
const kvoc_states = [0, 1];

// Transition matrix (transition probabilities per time step / unit of time)
const hyper_TM = [
  [0.99, 0.01],
  [0.20, 0.80]
];

const depol_TM = [
  [0.98, 0.02],
  [0.01, 0.99]
];

const N = 1e3; // Chain length
const M = 5e3;   // Number of chains (channels)
const t0 = 300;  // Voltage step start


// --- Function Definitions ----------------------------------------------------

// 'import' not supported? --> imported by HTML <script src='...'></script>
// import { make2StateChain } from './funxov.js';

// Function to generate a new current trace and update the chart
function multiPlot(micro_id1, micro_id2, micro_id3, macro_id) {
  
  // Get M chains
  let currentTrace = [];
  let dataset = [];
  for (let j = 0; j < M; j++) {
    currentTrace = make2StateChain2TM(kvoc_states, hyper_TM, depol_TM, N, t0, 0, noise = true);
    dataset.push(currentTrace);
  }

    // Create charts for each subplot
    const chart1 = createChart(micro_id1, dataset[0], 'Channel 1');
    const chart2 = createChart(micro_id2, dataset[1], 'Channel 2');
    const chart3 = createChart(micro_id3, dataset[2], 'Channel 3');
    const chart4 = createChart(macro_id, colSums(dataset),
      'Total Current', 'rgb(75, 192, 192)');
}

// Function to create or update the chart with a new vector
function createChart(canvasId, vector, ylab, color = 'rgb(20, 20, 20)') {

  // Test if the related <canvas> is still empty or not
  // Another approach would have been to test the 'display: block;' value of
  // of the <canvas>'s 'style' attribute, since in the present code it is
  // initially uset, but it will be set by 'Chart' constructor upon button click
  // const exists = window[canvasId].attributes.style.value.includes('display')
  const existingChart = Chart.getChart(canvasId);
  if (existingChart) {
    // Update existing chart
    existingChart.data.datasets[0].data = vector;
    existingChart.update();
    return existingChart;
  }

  const context = document.getElementById(canvasId).getContext('2d');
  // Create a new chart instance
  return new Chart(context, {
    type: 'line',
    data: {
      labels: vector.map((_, index) => index/1e3),
      datasets: [{
        label: ylab,
        borderColor: color,
        backgroundColor: 'rgba(255, 255, 255, 1)', // White background
        data: vector,
        fill: false,
        borderWidth: 1.5,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: false,
    }
  });
}
