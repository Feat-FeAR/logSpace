// JavaScript implementation of a two-state Soccer Markov Chain.
// The (almost literal) translation of './static/codes/soccer_markov_chain.R'.

// --- Variable Assignments ----------------------------------------------------

// List of all the possible states.
const derby_states = ['t', 'j'];

// Transition matrix (transition probabilities per pass).
const derby_TM = [
  [0.5811, 0.4189],
  [0.3333, 0.6667]
];

// Chain length.
const N = 1.5e3;

// --- Function Definitions ----------------------------------------------------

// 'import' not supported? --> imported by HTML <script src='...'></script>
// import { makeChain2S } from './funxov.js';

// Function to generate a new "match" and display the result as simple text.
function generateAndDisplay(element_id) {
  const derbyChain = makeChain2S(derby_states, derby_TM, N, 'j', false)
  document.getElementById(element_id).innerText = derbyChain.join('');
}
