// JavaScript implementation of a two-state ion channel with a constant
// transition matrix (JS translation of './static/codes/K2P_markov_chain.R').


// --- Variable Assignments ----------------------------------------------------

// List of all the possible states
const k2p_states = [0, 1];

// Transition matrix (transition probabilities per time step / unit of time)
const k2p_TM = [
  [0.98, 0.02],
  [0.01, 0.99]
];

// Chain length
const N = 1.5e3;


// --- Function Definitions ----------------------------------------------------

// 'import' not supported? --> imported by HTML <script src='...'></script>
// import { make2StateChain } from './funxov.js';

// Function to generate a new current trace and update the chart
function generateAndPlot(element_id) {
  // Get the canvas element
  const canvas = document.getElementById(element_id);
  const ctx = canvas.getContext('2d');

  // Get the chain
  let currentTrace = make2StateChain(k2p_states, k2p_TM, N, 0, noise = true);
  updateChart(currentTrace, ctx);
}

// Function to update the chart with a new vector
function updateChart(vector, context) {
  // Check if a chart instance already exists
  if (window.myLineChart) {
    // Update the existing chart with new data
    //window.myLineChart.data.labels = vector.map((_, index) => index/1e3);
    window.myLineChart.data.datasets[0].data = vector;
    window.myLineChart.update();
  } else {
    // Create a new chart instance
    window.myLineChart = new Chart(context, {
      type: 'line',
      data: {
        labels: vector.map((_, index) => index/1e3),
        datasets: [{
          label: 'Normalized Current',
          //borderColor: 'rgb(75, 192, 192)', // Alternative color
          borderColor: 'rgb(20, 20, 20)',
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
}
