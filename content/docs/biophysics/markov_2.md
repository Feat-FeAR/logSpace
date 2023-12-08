+++
title = 'Markov 2'
date = 2023-12-07T17:20:42+01:00
draft = false
+++

# K<sub>2</sub>P Markov Chain

## System design
Starting from the Markovian system built to model the Toro-Juve Derby, it is
straightforward to get something more biophysically sound by simply
substituting the Torino state with the _open_ configuration of an ion channel
and the Juventus state with the _closed_ one (or the other way around, if you
prefer).



Markov chains are a suitable tool to model single ion channel behavior because
ion channels are macromolecules that, in the simplest case, admit at least two
(but in general multiple) conformational states: one that we call _open_, which
allows the passage of ion currents across the membrane with characteristic
conductance values that depend on the channel type, and one that we call
_closed_ with zero conductance. The idea that an ion channel is basally closed
and it transits to the open state upon the arrival of an appropriate gating
signal (e.g., depolarization, specific ligands, membrane stretching, etc.) is
just a conventional view that aiming at simplifying the gating process when
working at the whole-cell level (i.e., at the level of channel population). In
the reality, ion channels are nanoscale molecular structures consisting of
multiple protein domains and subunits susceptible to conformational changes and
subject to the random thermal motion (even if with fewer degrees of freedom
compared to a free-moving particle). The conductive state of an ion channel is
determined by precisely its conformational configurations, which change
continuously making the pore switching from open to closed states in an
unpredictable way, under the action of thermal agitation forces. __Notably, this
is true even in the absence of any gating stimulus. The presence of the gating
stimulus just _increases_ the probability of observing the ion channel in its
open configuration or, in more Markovian terms, changes the values of the
transition matrix.__

A system such as the one depicted in the figure may represent an ion channel
characterized by only 2 states and with a constant transition matrix (no gating
mechanism). An example could be an exponent of the K<sub>2</sub>P channels, also
known as potassium leak channels, which are responsible for basal plasma
membrane permeability to K<sup>+</sup> ions (often incorrectly described as
"always open" channels).

Certainly, the values within the transition matrix will also have to be adapted
to the context, but the formal structure of the system is exactly the same. Here
are some plausible values from a biophysical point of view


## Simulate an ion current
Here it follows the R script to model a single channel current as a Markov
chain. You will notice that it is exactly the same algorithm already employed
for the football derby simulation, the only difference being the name of the
states and the particular values of the transition matrix. In addition, 4 more
lines of code were added to the bottom just to convert the chain made of
_open_ and _closed_ strings into a numerical sequence of current values that we
can plot.
```r {{% include "/static/codes/K2P_markov_chain.R" %}} ```
{{< k2pMarkov >}}
