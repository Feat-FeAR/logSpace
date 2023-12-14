// funxov is a short for 'functions for Markov'
// i.e., a JS Module of general utility functions for Markov chains

// Function to generate a new N-long Markov Chain, with only two possible states
function makeChain2S(states, TM, N, starting = states[0], noise = false) {
  // Initialize
  let now = starting; // The kickoff
  let chain = [now];  // The chain
  
  // Chain builder loop
  for (let i = 1; i < N; i++) {
    // Update the 'now' state
    if (now === states[0]) {
      now = sample(states, TM[0]);
    } else if (now === states[1]) {
      now = sample(states, TM[1]);
    }
    // Extend the chain
    chain.push(now);
  }

  if (noise) {
  	// Add electrical noise
  	//chain = chain.map(x => x + 0.2*Math.random() - 0.1)     // Uniform
  	chain = chain.map(x => x + normRandom(0, 0.05))           // Gaussian
  }

  // Return the array chain
  return chain;
}

// Function to generate a new N-long Markov Chain, with only two possible states
// and a transition matrix that changes from TM1 to TM2 at the n_change cycle,
// to represent ion channel activation (gating stimulus)
function makeChain2S2T(states, TM1, TM2, N, n_change = N/2,
                            starting = states[0], noise = false) {
  // Initialize
  let now = starting; // The kickoff
  let chain = [now];  // The chain
  
  // Chain builder loop
  for (let i = 1; i < N; i++) {
    // Conditional ternary operator
    const TM = i < n_change ? TM1 : TM2;
    // Update the 'now' state
    if (now === states[0]) {
      now = sample(states, TM[0]);
    } else if (now === states[1]) {
      now = sample(states, TM[1]);
    }
    // Extend the chain
    chain.push(now);
  }

  if (noise) {
    // Add electrical noise
    //chain = chain.map(x => x + 0.2*Math.random() - 0.1)     // Uniform
    chain = chain.map(x => x + normRandom(0, 0.05))           // Gaussian
  }

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
function sample(choices, probabilities) {
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

// Function to get the sum of the values in each column of a matrix
function colSums(matrix) {
  // Get the length of the arrays
  const arrayLength = matrix[0].length;
  // Initialize the result array with zeros
  const result = Array(arrayLength).fill(0);
  
  // Sum the arrays element-wise
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < arrayLength; j++) {
      result[j] += matrix[i][j];
    }
  }

  return result;
}

// Function to create (or update) a chart with a new vector of numbers.
// Note that this function always returns a chart object, even if this feature
// is not currently used anywhere in the script.
function createChart(canvasId, vector, ylab, color = 'rgb(20, 20, 20)') {

  // Update an existing chart
  // Test if the related <canvas> is still empty or not
  // Another approach would have been to test the 'display: block;' value of
  // of the <canvas>'s 'style' attribute, since in the present code it is
  // initially uset, but it will be set by 'Chart' constructor upon button click
  // const exists = window[canvasId].attributes.style.value.includes('display')
  const existingChart = Chart.getChart(canvasId);
  if (existingChart) {
    existingChart.data.datasets[0].data = vector;
    existingChart.update();
    return existingChart;
  }

  // Create a new chart instance
  const context = document.getElementById(canvasId).getContext('2d');
  return new Chart(context, {
    type: 'line',
    data: {
      labels: vector.map((_, index) => index/1e3),
      datasets: [{
        label: ylab,
        borderColor: color,
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
