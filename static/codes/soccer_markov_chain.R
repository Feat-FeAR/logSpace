#-------------------------------------------------------------------------------
# R implementation of a 2-state "soccer" Markov system
#-------------------------------------------------------------------------------

# set.seed(7) # Uncomment if you wanna make this example reproducible

# Array of all the possible states
states <- c("t", "j")

# Transition matrix (transition probabilities per pass)
TM <- matrix(c(0.5811, 0.4189,
               0.3333, 0.6667), nrow = 2, byrow = TRUE)
colnames(TM) <- rownames(TM) <- states # Just cosmetics if you wanna print TM

now <- states[2]  # The kickoff
chain <- c(now)   # The chain
n <- 1.5e3        # Chain length

# Chain builder loop
for (i in c(2:n)) {
  # Update the 'now' state
  now <- chain[length(chain)]
  
  if (now == "t") {
    new_state <- sample(states, 1, prob = TM[1,])
  } else if (now == "j") {
    new_state <- sample(states, 1, prob = TM[2,])
  }
  chain <- c(chain, new_state)
}

# Chain preview
paste(chain, collapse = "")
