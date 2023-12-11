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

// Function to generate a new "match" and display the result
function generateAndDisplay(element_id) {
  // Get the chain
  const derbyChain = generateNewChain(derby_states, derby_TM, N)  
  // Display the result as simple text
  document.getElementById(element_id).innerText = derbyChain.join('');
}

// Function to generate a new chain
function generateNewChain(states, TM, N) {
  // Initialize
  let now = states[1]; // The kickoff
  let chain = [now];   // The chain
  // Chain builder loop
  for (let i = 1; i < N; i++) {
    // Update the 'now' state
    if (now === states[0]) {
      now = randomChoice(states, TM[0]);
    } else if (now === states[1]) {
      now = randomChoice(states, TM[1]);
    }
    // Extend the chain
    chain.push(now);
  }
  // Return the array chain
  return chain;
}

// Function to randomly choose an element based on probabilities
function randomChoice(choices, probabilities) {
  const rand = Math.random();
  let cumulativeProbability = 0;

  for (let i = 0; i < choices.length; i++) {
    cumulativeProbability += probabilities[i];
    if (rand <= cumulativeProbability) {
      return choices[i];
    }
  }
  // This should not happen, but just in case
  return choices[choices.length - 1];
}
