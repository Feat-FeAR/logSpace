// JavaScript implementation of a two-state "soccer" Markov system
// The literal translation of './static/codes/soccer_markov_chain.R'


// --- Variable Assignments ----------------------------------------------------

// List of all the possible states
const derby_states = ['t', 'j'];

// Transition matrix (transition probabilities per pass)
const derby_TM = [
  [0.5811, 0.4189],
  [0.3333, 0.6667]
];

// Chain length
const n = 1.5e3;     


// --- Function Definitions ----------------------------------------------------

// Function to generate a new "match" and display the result
function generateAndDisplay(element_id) {
  // Get the chain
  const derbyChain = generateNewChain(derby_states, derby_TM, n)
  
  // Display the result as simple text
  document.getElementById(element_id).innerText = derbyChain.join('');
}

// Function to generate a new chain
function generateNewChain(states, TM, n) {
  let now = states[1]; // The kickoff
  let chain = [now];   // The chain

  // Chain builder loop
  for (let i = 1; i < n; i++) {
    // Update the 'now' state
    now = chain[chain.length - 1];

    let new_state;
    if (now === states[0]) {
      new_state = randomChoice(states, TM[0]);
    } else if (now === states[1]) {
      new_state = randomChoice(states, TM[1]);
    }
    chain.push(new_state);
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
