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
const n = 1.5e3;     


// --- Function Definitions ----------------------------------------------------

// Function to generate a new current trace and update the chart
function generateAndPlot(element_id) {
  // Get the canvas element
  const canvas = document.getElementById(element_id);
  const ctx = canvas.getContext('2d');

  // Get the chain
  let currentTrace = generateNewChain(k2p_states, k2p_TM, n);
  updateChart(currentTrace, ctx);
}

// Function to generate a new chain
function generateNewChain(states, TM, n) {
  let now = states[0]; // The kickoff
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

  // Add electrical noise
  //chain = chain.map(x => x + 0.2*Math.random() - 0.1)     // Uniform
  chain = chain.map(x => x + normRandom(0, 0.05))           // Gaussian

  // Return the array chain
  return chain;
}

// Function to generate a normally distributed random number with the specified
// mean and standard deviation. The Box-Muller transform generates two
// independent, standard normally distributed random numbers that can be
// then adjusted to have the desired mean and standard deviation.
function normRandom(mean, sd) {
  let u1 = Math.random();
  let u2 = Math.random();

  // Box-Muller transform
  let z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  // Adjust mean and standard deviation
  let result = z0 * sd + mean;

  return result;
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
