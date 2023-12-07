#-------------------------------------------------------------------------------
# R implementation of a K2P ion channel model as a Markovian system
#-------------------------------------------------------------------------------

# set.seed(7) # Uncomment if you wanna make this example reproducible

# Array of all the possible states
states <- c("closed", "open")

# Transition matrix (transition probabilities per pass)
TM <- matrix(c(0.98, 0.02,
               0.01, 0.99), nrow = 2, byrow = TRUE)
colnames(TM) <- rownames(TM) <- states # Just cosmetics if you wanna print TM

now <- states[1]  # The kickoff
chain <- c(now)   # The chain
n <- 1.5e3        # Chain length

# Chain builder loop
for (i in c(2:n)) {
  # Update the 'now' state
  now <- chain[length(chain)]
  
  if (now == "closed") {
    new_state <- sample(states, 1, prob = TM[1,])
  } else if (now == "open") {
    new_state <- sample(states, 1, prob = TM[2,])
  }
  chain <- c(chain, new_state)
}

# Convert a chain of strings into a realistic electrical current signal
# Create an empty vector (filled with 0)
current <- vector(mode = "numeric", length = n)
# Make current flow (!=0) when the channel is open
current[chain == "open"] <- 1 # Outward potassium current
# Add 'cosmetic' 5% electrical noise
current <- current + rnorm(n, mean = 0, sd = 0.05)
# Plot as time series
plot(as.ts(current), xlab = "time step", ylab  = "normalized current")
