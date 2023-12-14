// funxov is 'functions for Markov', i.e.,
// a JS Module of functions for Markov chains

// Function to generate a new chain
function make2StateChain(states, TM, N, starting = states[0], noise = false) {
  // Initialize
  let now = starting; // The kickoff
  let chain = [now];   // The chain
  
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

// Function to generate a new chain
function make2StateChain2TM(states, TM1, TM2, N, n_change = N/2,
                            starting = states[0], noise = false) {
  // Initialize
  let now = starting; // The kickoff
  let chain = [now];   // The chain
  
  // Chain builder loop
  for (let i = 1; i < N; i++) {

    let TM = [];
    if (i < n_change) {
      TM = TM1;
    } else {
      TM = TM2;
    }
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

// Function to get the row-wise sum of the elements of a matrix
function colSums(matrix) {
  // Check if the matrix is not empty
  if (matrix.length === 0 || matrix[0].length === 0) {
    throw new Error('Empty matrix');
  }

  // Get the length of the arrays (N)
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
