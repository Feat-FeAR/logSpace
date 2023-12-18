#-------------------------------------------------------------------------------
# R implementation of a KV ion channel model as a Markovian system
#-------------------------------------------------------------------------------

# set.seed(35) # Uncomment if you wanna make this example reproducible

# Array of all the possible states
states <- c("closed", "open")

# Transition matrix (transition probabilities per unit of time or 'time step')
TM_hyper <- matrix(c(0.99, 0.01,
                     0.20, 0.80), nrow = 2, byrow = TRUE)
TM_depol <- matrix(c(0.98, 0.02,
                     0.01, 0.99), nrow = 2, byrow = TRUE)
colnames(TM_hyper) <- rownames(TM_hyper) <-
  colnames(TM_depol) <- rownames(TM_depol) <- states

# Iteration parameters
N <- 1e3 # Chain length
M <- 1e3 # Number of chains (channels)

# A matrix to store many (M) single-channel recordings, each of length N
dataset <- matrix(nrow = M, ncol = N)

# Run the chain builder M times
for (j in 1:M) {
  # Initialize the chain
  now <- states[1] # The kickoff
  chain <- c(now)  # The chain
  
  # Chain builder loop
  for (i in 2:N) {
    # Select the appropriate matrix (depolarization step starts after 200)
    TM <- if (i < 200) TM_hyper else TM_depol
    # Update the 'now' state
    if (now == "closed") {
      now <- sample(states, 1, prob = TM[1,])
    } else if (now == "open") {
      now <- sample(states, 1, prob = TM[2,])
    }
    # Extend the chain
    chain[i] <- now
  }
  # Convert a chain of strings into an electrical current signal
  # Create an empty vector (filled with 0)
  current <- vector(mode = "numeric", length = N)
  # Make current flow (!=0) when the channel is open
  current[chain == "open"] <- 1 # Outward potassium current
  # Add 'cosmetic' 5% electrical noise
  current <- current + rnorm(N, mean = 0, sd = 0.05)
  # Store the single-channel current trace
  dataset[j,] <- current
}

# Load auxiliary functions from the TCP-Lab R package
library(r4tcpl)
# Plot single channel (microscopic) currents vs whole-cell (macroscopic) current
iTrace(dataset)
# Alternative color-mapped graphical representation
iMap(dataset)
