+++
title = 'Markov 2'
date = 2023-12-07T17:20:42+01:00
draft = false
+++

# K<sub>2P</sub> Markov Chain

## System design
Starting from the Markovian system we built to model the Toro-Juve derby, it is
straightforward to get something more biophysically sound by simply substituting
the Torino state with the _open_ configuration of an ion channel and the
Juventus state with the _closed_ one (or the other way around, as you prefer).
Here is the resulting state diagram:

<div style="text-align: center;">
{{< figure src="/images/2_states_open-closed.png" title="2-state Ion Channel Markov Chain" width=600 >}}
</div>

Markov chains are a suitable mathematical tool to model single ion channel
behavior because ion channels are macromolecules that admit at least two (but in
general multiple) conformational states, one that we call _open_, which allows
the passage of ion currents across the membrane with characteristic conductance
values that depend on channel type, and one that we call _closed_ with zero
conductance. The idea that an ion channel is basally closed and it opens upon
the arrival of an appropriate gating signal (e.g., depolarization, specific
ligands, membrane stretching, etc.) is just a conventional view that we can use
to look at the gating process when working at the whole-cell level (i.e., at the
level of channel population). In the reality, ion channels are flexible
nanoscale molecular structures consisting of multiple protein domains and
subunits susceptible to conformational changes and subject to the random thermal
motion (even if with fewer degrees of freedom compared to a free-moving
particle). The conductive state of an ion channel is determined by precisely its
conformational configurations, which change continuously making the pore
switching from open to closed states in an unpredictable way, under the action
of thermal agitation forces. __Notably, this is true even in the absence of any
gating stimulus. The presence of the gating stimulus just _increases_ the
probability of observing the ion channel in its open configuration or, in more
Markovian terms, changes the values of the transition matrix.__

A system such as the one depicted in the diagram above represents a
discrete-valued Markov chain with only two possible states
{{< katex >}}S=\left\{\text{closed},\text{open}\right\}\equiv\left\{c,o\right\}{{< /katex >}}.
Also, the chain is _time-homogeneous_, featuring a constant transition matrix,
which may represent an ion channel in the absence of activation stimuli or
without any gating mechanism at all. An example of the latter category might be
an exponent of the _two-pore-domain potassium channels_ (K<sub>2P</sub>), also
known as potassium leak channels, which are responsible for basal plasma
membrane permeability to K<sup>+</sup> ions and the main contributors to the
resting membrane potential. K<sub>2P</sub> channels are often incorrectly
referred to as "always open" channels. In fact, these channels are _basally
conductive_ in the sense that they exhibit a relatively high opening probability
even in the total absence of stimuli; nevertheless, it would be an
oversimplification to think they are _permanently open_. Furthermore,
experimental evidence has shown that their opening probability can be
_modulated_ by certain external stimuli such as membrane stretching, pH, and
intracellular calcium concentration. Neglecting this last point, we can describe
K<sub>2P</sub> conduction dynamics using the exact same formal structure as the
previous soccer Markov chain, with the only caution being to adapt the values of
the transition matrix to the new biophysical context. Here are some plausible
values for \\(\bm{P}\\)
{{< katex display >}}
    \bm{P} =
    \begin{pmatrix}
        p_{cc} & p_{co}\\
        p_{oc} & p_{oo}
    \end{pmatrix} =
    \begin{pmatrix}
        0.98 & 0.02\\
        0.01 & 0.99
    \end{pmatrix}
{{< /katex >}}

## Simulate an ion current
The following __R__ script models a single channel stationary current as a
Markov chain. It is exactly the same algorithm we already employed for the
soccer simulation, the only difference being the name of the states and the
particular values within the transition matrix. In addition, 4 more lines of
code were added to the bottom of the script to convert the chain made of
_closed_ and _open_ strings into a numerical sequence of (normalized) current
values (\\({0,1}\\)) that we can plot. Also, a 5% noise is superimposed to the
current signal in order to get something as close as possible to a real
single-channel electrophysiological recording.
```r {{% include "/static/codes/K2P_markov_chain.R" %}} ```
{{< k2pMarkov >}}

## Reverse engineering
Now that we have a fairly credible single-channel current trace, we can play
electrophysiologist. Knowing that a two-state ion channel can be exhaustively
characterized by its transition probability matrix, we now want to estimate
\\(\bm{P}\\) from the experimental trace and denote this estimate with
\\(\bm{P}\_{N}\\), being computed from a current trace made of \\(N\\) time
samples.

As previously discussed, we will use transition _frequencies_ to estimate
_probabilities_, so that
{{< katex display >}}
    \bm{P}_{N} =
    \begin{pmatrix}
        \nu_{cc} & \nu_{co}\\
        \nu_{oc} & \nu_{oo}
    \end{pmatrix}
    \quad\underset{N\rightarrow\infty}{\longrightarrow}\quad\bm{P}
{{< /katex >}}
Thanks to the row-wise normalization constrain \\(\sum_b \nu_{ab}=1\\), holding
true for any stochastic matrix, we get that
{{< katex display >}}
    \bm{P}_{N} =
    \begin{pmatrix}
        1-\nu_{co} & \nu_{co}\\
        \nu_{oc} & 1-\nu_{oc}
    \end{pmatrix}
{{< /katex >}}
So the only two quantities we actually have to compute are the opening and
closing frequencies, namely
{{< katex display >}}
\begin{aligned}
        & \nu_{co}=\frac{n_{co}}{N_{c}}\\
        & \nu_{oc}=\frac{n_{oc}}{N_{o}}
\end{aligned}
{{< /katex >}}

Let's first focus on the denominators \\(N_{c}\\) and \\(N_{o}\\), being the
total number of closed (non-conductive) and open (conductive) states in the
chain, respectively. Because of the presence of the electrical noise, we cannot
simply count the amount of 0 and 1 values in the signal, but must adopt a more
noise-tolerant approach. The safest and most precautionary method is to take a
threshold at half the (average) amplitude of the signal (i.e., \\(0.5\\)) and
then consider all the time points above it as _open_ and the others as _closed_
states.

As for the numerators \\(n_{co}\\) and \\(n_{oc}\\), we are interested instead
in counting the number of _transitions_ between two different states. Although
in our particular case these events are relatively few in number and easy to
spot---thus allowing for manual counting---a systematic, user-unbiased, and
reproducible analysis must rely in any case on some automated procedure. One
possibility is to __compute the time derivative of the signal to quantify
current variations__. In the case of Markov chains, which are discrete-time
random processes (exactly like an experimental electrical signal sampled in
time), the derivative reduces to a ratio of finite differences, where the
denominator \\(\Delta n\\) is equal to 1, assuming that \\(n\in\mathbb{N}\\).
Formally:
$$
i^{\prime}\\!\left(t\right)=\frac{d\ i\\!\left(t\right)}{dt} \longrightarrow i^{\prime}\\!\left[n\right]=\frac{\Delta\ i\\!\left[n\right]}{\Delta n}=\Delta\ i\\!\left[n\right]=i_{n+1}-i_{n}
$$
The plot below shows an example signal (top) aligned with its time derivative
(bottom). As we expected, opening events give rise to upward spikes in
\\(i^{\prime}\\), while closing events are remapped as downward spikes.



Using a strategy similar to the previous one, we set now two thresholds for the
derivative function, one at \\(i^{\prime}=+0.5\\) and the other at
\\(i^{\prime}=-0.5\\), so that all the points _beyond_ these lines can be
confidently counted as opening and closing events, respectively.

Here it follows the __R__ code to perform the whole procedure and finally get an
estimation of the transition matrix. Importantly, it is assumed that you run
this script in the same __R__ session of the previous one, since `current` and
`TM` variables are assumed to be already loaded in the global environment.
```r {{% include "/static/codes/K2P_TM_estimation.R" %}} ```

If you run both the previous scripts after uncommenting the first line to set
the pseudo-random number seed (i.e., `set.seed(7)`), you should obtain the
following estimation
{{< katex display >}}
    \bm{P}_{1.5\cdot 10^{3}} =
    \begin{pmatrix}
        0.98124 & 0.01876\\
        0.01487 & 0.98513
    \end{pmatrix}
{{< /katex >}}
which is a pretty good estimate of the true value of \\(\bm{P}\\), albeit with a
slight underestimation of \\(p_{co}\\) (opening probability) and an
overestimation of \\(p_{oc}\\) (closing probability). In fact, this was quite
expected, given the stochastic nature of the process. However, as is well known,
more accurate estimates of a random variable can be obtained simply by
increasing the sample size, which in this case means extending the length of the
chain, and thus having longer recordings from the experimental point of view. If
you try to re-run the entire stuff just by changing the chain length in the
first script (say we put `N <- 1.5e5`), you should get
{{< katex display >}}
    \bm{P}_{1.5\cdot 10^{5}} =
    \begin{pmatrix}
        0.98042 & 0.01958\\
        0.01024 & 0.98976
    \end{pmatrix}
{{< /katex >}}
that's almost perfect.
