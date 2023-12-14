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
// import { makeChain2S } from './funxov.js';

// Function to generate a new current trace and create/update the chart
function generateAndPlot(element_id) {
  const iTrace = makeChain2S(k2p_states, k2p_TM, N, 0, true);
  createChart(element_id, iTrace, 'Normalized Current');
}
