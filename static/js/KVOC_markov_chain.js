// JavaScript implementation of a two-state ion channel with a changing
// transition matrix (JS translation of './static/codes/KVOC_markov_chain.R').

// --- Variable Assignments ----------------------------------------------------

// List of all the possible states
const kvoc_states = [0, 1];

// Transition matrices (transition probabilities per time step / unit of time)
const hyper_TM = [
  [0.99, 0.01],
  [0.20, 0.80]
];
const depol_TM = [
  [0.98, 0.02],
  [0.01, 0.99]
];

const N = 1e3;  // Chain length
const M = 5e3;  // Number of chains (channels)
const t0 = 300; // Voltage step start

// --- Function Definitions ----------------------------------------------------

// 'import' not supported? --> imported by HTML <script src='...'></script>
// import { makeChain2S2T } from './funxov.js';

// Function to generate M current traces and create/update charts for each subplot
function multiPlot(micro_id1, micro_id2, micro_id3, macro_id) {
  let dataset = [];
  for (let j = 0; j < M; j++) {
    const iTrace = makeChain2S2T(kvoc_states, hyper_TM, depol_TM, N, t0, 0, true);
    dataset.push(iTrace);
  }
  createChart(micro_id1, dataset[0], 'Channel 1');
  createChart(micro_id2, dataset[1], 'Channel 2');
  createChart(micro_id3, dataset[2], 'Channel 3');
  createChart(macro_id, colSums(dataset), 'Total Current', 'rgb(75, 192, 192)');
}
