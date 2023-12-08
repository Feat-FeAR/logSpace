// JavaScript implementation of a 2-state "soccer" Markov system
// The literal translation of './static/codes/soccer_markov_chain.R'

// List of all the possible states
const states = [0, 1];

// Transition matrix (transition probabilities per pass)
const TM = [
  [0.98, 0.02],
  [0.01, 0.99]
];

// Function to generate a new chain
function generateNewChain() {
  
  let now = states[0]; // The kickoff
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

  // Add electrical noise (uniformly distributed)
  chain = chain.map(x => x + 0.1*Math.random() - 0.05)

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





// Get the canvas element
const canvas = document.getElementById('vectorPlot');
const ctx = canvas.getContext('2d');


// Function to update the chart with a new vector
function updateChart(vector) {
  // Check if a chart instance already exists
  if (window.myLineChart) {
    // Update the existing chart with new data
    window.myLineChart.data.labels = vector.map((_, index) => index + 1);
    window.myLineChart.data.datasets[0].data = vector;
    window.myLineChart.update();
  } else {
    // Create a new chart instance
    window.myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: vector.map((_, index) => index + 1),
        datasets: [{
          label: 'Vector',
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

// Initial vector
let integerVector = generateNewChain();
updateChart(integerVector);

// Button click event handler
document.getElementById('generateButton').addEventListener('click', function () {
  // Generate a new random vector and update the chart
  integerVector = generateNewChain();
  updateChart(integerVector);
});