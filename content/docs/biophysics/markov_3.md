+++
title = 'Markov 3'
date = 2023-12-14T02:20:42+01:00
draft = false
+++

# K<sub>V</sub> Markov Chain

## System design
What if we wanted to model the behavior of a gated channel during its
activation? For example, the current through a voltage-dependent potassium
channel (K<sub>V</sub>) during the application of a depolarization step? As
mentioned in the previous chapter, in Markovian terms, the arrival of a gating
stimulus can be seen as a change in the values of the transition matrix that
increases the probability of observing the channel in any of its possible open
states. For simplicity, again, we will assume that our K<sub>V</sub> channel
admits only two states:
{{< katex >}}S=\left\{\text{closed},\text{open}\right\}\equiv\left\{c,o\right\}{{< /katex >}}.
In contrast to the previous case, now the transition matrix will be a function
of time (\\(\bm{P}\\!\left[k\right]\\)) that changes its values after the time
step \\(k_{0}=200\\) of application of the depolarizing stimulus. Given the step
shape of our gating voltage, it is reasonable to imagine an instantaneous
transition between the two possible configuration of the transition matrix.
{{< katex display >}}
\bm{P}\!\left[k\right]=\left\{
\begin{aligned}
	\begin{pmatrix}
		0.99 & 0.01\\
		0.20 & 0.80
	\end{pmatrix}
		&\qquad\textrm{if}\quad k < 200\\
		&\\
	\begin{pmatrix}
		0.98 & 0.02\\
		0.01 & 0.99
	\end{pmatrix}
		&\qquad\textrm{if}\quad k \geq 200
\end{aligned}
\right.
{{< /katex >}}

Another thing we might be interested in is the behavior at whole-cell level. In
other words, starting from the characterization of a single-channel current, is
it possible to infer the _macroscopic current_ that we would see using a
traditional whole-cell voltage-clamp configuration when a large number of
channels of the same type are functionally expressed in the membrane? From a
computational point of view, the answer is rather straightforward since the
macroscopic current is nothing more than the sum of all the elementary currents.
Thus, we can simply simulate the process a number of times equal to the number
of channels that we expect to be expressed in membrane and then sum all the
realizations---each representing a single channel---point by point in time. At
the end of this section we will also try to address this question from a
theoretical point of view.

## Simulate channel activation
```r {{% include "/static/codes/KV_markov_chain.R" %}} ```
{{< kvMarkov >}}

