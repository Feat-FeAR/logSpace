#-------------------------------------------------------------------------------
# R implementation of a K2P ion channel model as a Markovian system
#-------------------------------------------------------------------------------

# set.seed(7) # Uncomment if you wanna make this example reproducible

# Array of all the possible states
states <- c("closed", "open")

# Transition matrix (transition probabilities per unit of time or 'time step')
TM <- matrix(c(0.98, 0.02,
               0.01, 0.99), nrow = 2, byrow = TRUE)
colnames(TM) <- rownames(TM) <- states # Just aesthetic, if you wanna print TM

# Initialize the chain
now <- states[1]  # The kickoff
chain <- c(now)   # The chain
N <- 1.5e3        # Chain length

# Chain builder loop
for (i in 2:N) {
  # Update the 'now' state
  if (now == "closed") {
    now <- sample(states, 1, prob = TM[1,])
  } else if (now == "open") {
    now <- sample(states, 1, prob = TM[2,])
  }
  # Extend the chain
  chain[i] <- now
}

# Convert a chain of strings into a realistic electrical current signal
# Create an empty vector (filled with 0)
current <- vector(mode = "numeric", length = N)
# Make current flow (!=0) when the channel is open
current[chain == "open"] <- 1 # Outward potassium current
# Add a 5% "electrical" noise
current <- current + rnorm(N, mean = 0, sd = 0.05)
# Plot as time series
plot(as.ts(current), xlab = "time step", ylab  = "normalized current")
