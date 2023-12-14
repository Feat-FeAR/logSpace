// JavaScript implementation of a two-state "soccer" Markov system
// The (almost literal) translation of './static/codes/soccer_markov_chain.R'

// --- Variable Assignments ----------------------------------------------------

// List of all the possible states
const derby_states = ['t', 'j'];

// Transition matrix (transition probabilities per pass)
const derby_TM = [
  [0.5811, 0.4189],
  [0.3333, 0.6667]
];

// Chain length
const N = 1.5e3;

// --- Function Definitions ----------------------------------------------------

// 'import' not supported? --> imported by HTML <script src='...'></script>
// import { make2StateChain } from './funxov.js';

// Function to generate a new "match" and display the result
function generateAndDisplay(element_id) {
  // Get the chain
  const derbyChain = make2StateChain(derby_states, derby_TM, N, 'j', false)
  // Display the result as simple text
  document.getElementById(element_id).innerText = derbyChain.join('');
}
