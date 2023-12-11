#-------------------------------------------------------------------------------
# R implementation of a two-state "soccer" Markov system
#-------------------------------------------------------------------------------

# set.seed(7) # Uncomment if you wanna make this example reproducible

# Array of all the possible states
states <- c("t", "j")

# Transition matrix (transition probabilities per pass)
TM <- matrix(c(0.5811, 0.4189,
               0.3333, 0.6667), nrow = 2, byrow = TRUE)
colnames(TM) <- rownames(TM) <- states # Just cosmetics, if you wanna print TM

# Initialize the chain
now <- states[2]  # The kickoff
chain <- c(now)   # The chain
N <- 1.5e3        # Chain length

# Chain builder loop
for (i in 2:N) {
  # Update the 'now' state
  if (now == "t") {
    now <- sample(states, 1, prob = TM[1,])
  } else if (now == "j") {
    now <- sample(states, 1, prob = TM[2,])
  }
  # Extend the chain
  chain[i] <- now
}

# Chain preview
paste(chain, collapse = "")
