#-------------------------------------------------------------------------------
# Get transition probabilities from a single-channel current recording
#-------------------------------------------------------------------------------

# Split the plotting area into a 2x1 array
par(mfrow = c(2,1))

# Plot current trace with a threshold to separate 'open' from 'closed' states
plot(as.ts(current), xlab = "time step", ylab  = "normalized current")
lines(c(0,N), c(0.5,0.5), col = "red")

# Compute the number of open and closed states in the recorded trace
N_O <- sum(current > 0.5)
N_C <- sum(current < 0.5)

# Compute and plot the time derivative of the signal to detect transitions
didt <- diff(current)
plot(as.ts(didt), xlab = "time step", ylab  = "di/dt")
lines(c(0,N), c(0.5,0.5), col = "red")
lines(c(0,N), -c(0.5,0.5), col = "red")

# Reset the default plot layout
par(mfrow = c(1,1))

# Compute the number of CO and OC transitions
n_CO <- sum(didt > 0.5)
n_OC <- sum(didt < -0.5)

# Compute transition frequencies
f_CO <- n_CO/N_C
f_OC <- n_OC/N_O

# Get the empirical transition matrix
experimental_TM <- matrix(c(1-f_CO, f_CO,
                            f_OC, 1-f_OC), nrow = 2, byrow = TRUE)
rownames(experimental_TM) <- rownames(TM)
colnames(experimental_TM) <- colnames(TM)

# Compare theory and experiment
print(TM)
print(experimental_TM)
