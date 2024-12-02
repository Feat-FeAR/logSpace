+++
title = 'K_V Markov Chain'
weight = 30
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
admits only two conformational states:
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

## Ensemble average
When we are not interested in a particular realization of a stochastic process, but rather in the temporal evolution of the whole ensemble of possible random sequences, it is useful to resort to the probability distribution of the states at a given time step \\(k\\) using the related probability mass function (PMF), here defined as the row vector
$$
\bm{\pi}\\!\left[k\right]=\left(\pi_1\\!\left[k\right]\quad\pi_2\\!\left[k\right]\quad\pi_3\\!\left[k\right]\quad\ldots\quad\pi_m\\!\left[k\right]\right)
$$
whose generic element is
$$
\pi_a\\!\left[k\right]=\textrm{Pr}\left(X\\!\left[k\right]=a\right)\quad\forall a\in S
$$
and
$$
\sum_a \pi_{a}=1\quad\forall\ k\in\mathbb{N}
$$
Notably, starting from any \\(\bm{\pi}\\) vector, the transition probabilities contained in \\(\bm{P}\\) can be used to calculate the PMF at later times.
For example, in the case of an ion channel with just two possible conformational states \\(\left\\{c,o\right\\}\\), we can easily account for all the ways to get to \\(\pi_c\\) or \\(\pi_o\\) in one step, so that
{{< katex display >}}
\begin{aligned}
	\bm{\pi}\!\left[k+1\right] & = \left(\pi_c\!\left[k+1\right]\quad\pi_o\!\left[k+1\right]\right)\\
							   & = \left(\pi_c\!\left[k\right]p_{cc}\!+\!\pi_o\!\left[k\right]p_{oc}\quad\pi_c\!\left[k\right]p_{co}\!+\!\pi_o\!\left[k\right]p_{oo}\right)\\
							   & = \bm{\pi}\!\left[k\right]\bm{P}
\end{aligned}
{{< /katex >}}
In fact, the last vector equation holds unchanged whatever the (countable) dimension of \\(S\\).
It tells us that, to calculate the distribution of states of the system at the next step, we just need to apply (via matrix product) the transition matrix to the probability distribution of states.
Hence, to evolve the system by two steps it will be sufficient to apply the \\(\bm{P}\\) matrix twice,
$$
\bm{\pi}\\!\left[k+2\right]=\bm{\pi}\\!\left[k\right]\bm{P}\bm{P}=\bm{\pi}\\!\left[k\right]\bm{P}^2
$$
and so on.
More generally, it holds that
$$
\bm{\pi}\\!\left[k\right]=\bm{\pi}\\!\left[0\right]\bm{P}^k
$$
which is why \\(\bm{P}\\) and \\(\bm{P}^k\\) are also referred to as the \\(1\\)-step and \\(k\\)-step transition probability matrices, respectively.
