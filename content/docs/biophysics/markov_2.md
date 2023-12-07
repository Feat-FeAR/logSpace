+++
title = 'Markov 2'
date = 2023-12-07T17:20:42+01:00
draft = true
+++

# K<sub>2</sub>P Markov Chain

## System design
Starting with the Markovian system built to model the Toro-Juve Derby, it is
straightforward to get something more biophysically sound, by simply
substituting the Torino state with the _open_ configuration of an ion channel
and the Juventus with its _closed_ one (or the other way around, if you prefer).

In fact, ion channels are macromolecules that, in the simplest case, admit at least two (but in general multiple) conformational states. One that we call "open" and that allows the passage of transmembrane ion currents with characteristic conductance values that depend on the channel type, and one that we call "closed" with zero conductance. The idea that an ion channel is basally closed and that it transits to the open state upon the arrival of an appropriate gating signal (e.g., depolarization, specific ligand, membrane stretching, etc.) is a conventional view that aims to simplify the gating phenomenon when working at the whole-cell level (i.e., at the level of channel population). In the reality, ion channels are nanoscale molecular structures consisting of multiple protein domains and subunits susceptible to conformational changes and subject to the random thermal motion (even if with fewer degrees of freedom compared to a free-moving particle). The conductive state of an ion channel is determined by precisely its conformational configurations, which change continuously and unpredictably under the action of thermal agitation forces, __even in the absence of any gating stimulus__. The presence of the gating stimulus just _increases_ the probability of observing the ion channel in its open configuration.


Un sistema di questo tipo può ragionevolmente rappresentare, ad esempio, un canale ionico.
Certamente, anche i valori all'interno della transition matrix dovranno essere adattati al contesto, ma la struttura formale del sistema è esattamente la stessa. Ecco dei valori plausibili dal punto di vista biofisico


