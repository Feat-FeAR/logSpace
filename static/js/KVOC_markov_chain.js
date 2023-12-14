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

const N = 1.5e3; // Chain length
const M = 1e3;   // Number of chains (channels)
const t0 = 200;  // Voltage step start


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
    const chart1 = createChart(micro_id1, dataset[0]);
    const chart2 = createChart(micro_id2, dataset[1]);
    const chart3 = createChart(micro_id3, dataset[2]);
    const chart4 = createChart(macro_id, colSums(dataset), 'rgb(75, 192, 192)');
}

// Function to create or update the chart with a new vector
function createChart(canvasId, vector, color = 'rgb(20, 20, 20)') {

  const context = document.getElementById(canvasId).getContext('2d');
  // Create a new chart instance
  return new Chart(context, {
    type: 'line',
    data: {
      labels: vector.map((_, index) => index/1e3),
      datasets: [{
        label: 'Normalized Current',
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

// Function to sum the arrays element-wise
function colSums(matrix) {
  // Check if the matrix is not empty
  if (matrix.length === 0 || matrix[0].length === 0) {
    throw new Error('Empty matrix');
  }

  // Get the length of the arrays (N)
  const arrayLength = matrix[0].length;

  // Initialize the result array with zeros
  const result = Array(arrayLength).fill(0);

  // Sum the arrays element-wise
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < arrayLength; j++) {
      result[j] += matrix[i][j];
    }
  }

  return result;
}
