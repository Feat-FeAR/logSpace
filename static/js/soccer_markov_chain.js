// JavaScript implementation of a 2-state "soccer" Markov system
// The literal translation of './static/codes/soccer_markov_chain.R'

// List of all the possible states
const states = ['t', 'j'];

// Transition matrix (transition probabilities per pass)
const TM = [
  [0.5811, 0.4189],
  [0.3333, 0.6667]
];

// Function to generate a new chain
function generateNewChain(element_id) {
  let now = states[1]; // The kickoff
  let chain = [now];   // The chain
  const n = 1.5e3;     // Chain length

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

  // Display the result as simple text
  document.getElementById(element_id).innerText = chain.join('');
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
