+++
title = 'Markov 1'
date = 2023-12-01T23:20:42+01:00
draft = false
+++

# Soccer Markov Chain

## Draw the raw chain
Go to Youtube and pick up a video of any soccer match. Ideally, you want to
choose a complete match so that you can actually select a random sequence of
game play that is representative of the baseline dynamics of the match, and not
necessarily some outstanding actions, which---in being outstanding---may not be
representative of the average dynamics.

For the occasion, I chose the so-called
[Derby della Mole number 142](https://www.youtube.com/watch?v=5kKGW5EOJNg&t=995s),
i.e., the Serie A match between Juventus and Torino held on March 20, 2016,
which ended 4-1 in favor of Juve (which is certainly not a surprise to anyone,
not even to me who does not follow soccer). Referee Rizzoli whistles the start
of the match at video time 6:45 (it is legitimate to wonder what happened in the
preceding minutes of the clip) with kickoff set for Juventus. From that moment
the game starts for us as well (finally a soccer match in which you also do
something!). I watch the video with a text editor open in the foreground and my
fingers ready on the keyboard. With each interception or ball pass, I hit either
the _j_ or _t_ key depending on whether the ball comes to the feet of a Juve or
Toro player, respectively.

This is the resulting sequence of keystrokes from the first 10 minutes of the
game play:
```
jjtjjtjjttttjtttjjjjttttjjjjjjjjtttjttjjtjjjjjjjtjjtjjjjjjtttjtttjjjjjjtjtjjtjjtttttttjttjjtjtjtjtjjjtttjtjtjjttttjtttttttjjjjjjjjjjtttttjtttjttjjjjjjjjjtjjttttjjjjjjjj
```
Well, this ugly thing (pretty much what I see whenever someone makes me watch a
soccer game) could be our first Markov Chain! We call _j_ and _t_ the two
possible states of our system, while the pass from one state to the following
one is called a _transition_. Only four different types of transitions are
possible when dealing with just two states:
- \\(t\rightarrow t\quad\\) passes completed by Torino
- \\(t\rightarrow j\quad\\) Torino passes intercepted by Juventus
- \\(j\rightarrow j\quad\\) passes completed by Juventus
- \\(j\rightarrow t\quad\\) Juventus passes intercepted by Torino

## Compute some basic stats
If we exclude the last state that does not give rise to any subsequent
transition, the number of states equals the number of transitions, i.e.,
{{< katex >}}N={{< /katex >}}167. In particular, I tailed 74 _t_-states and
93 _j_-states (again excluding the last state, which is a _j_-state). The
detailed raw counts (also called _occurrences_) of the four possible transitions
are given in the _Counts_ column of the table below.

<table>
    <thead>
        <tr style="border: none;">
            <th>Transition</th>
            <th>Name</th>
            <th colspan=3>Counts</th>
            <th colspan=3>Frequency</th>
        </tr>
    </thead>
    <tbody>
        <tr align="center">
            <td style="font-style: italic;">t → t</td>
            <td>Toro completion</td>
            <td>43</td>
            <td rowspan=2 style="font-style: italic;">74</td>
            <td rowspan=4 style="font-style: italic;">167</td>
            <td>0.5811</td>
            <td rowspan=2 style="font-style: italic;">1</td>
            <td rowspan=4 style="font-style: italic;">2</td>
        </tr>
        <tr align="center">
            <td style="font-style: italic;">t → j</td>
            <td>Juve interception</td>
            <td>31</td>
            <td>0.4189</td>
        </tr>
        <tr align="center">
            <td style="font-style: italic;">j → j</td>
            <td>Juve completion</td>
            <td>62</td>
            <td rowspan=2 style="font-style: italic;">93</td>
            <td>0.6667</td>
            <td rowspan=2 style="font-style: italic;">1</td>
        </tr>
        <tr align="center">
            <td style="font-style: italic;">j → t</td>
            <td>Toro interception</td>
            <td>31</td>
            <td>0.3333</td>
        </tr>
        <tr align="center" style="font-style: italic;">
            <td colspan=2 style="border: none;"></td>
            <td colspan=3>167</td>
            <td colspan=3>2</td>
        </tr>
    </tbody>
</table>

Here we use the notation \\(n_{ab}\\) for the raw counts of the generic
transition \\(a\rightarrow b\\). So we have that \\(N_t=n_{tt}+n_{tj}=74\\) and
\\(N_j=n_{jj}+n_{jt}=93\\), while \\(N=N_t+N_j=167\\).

In first column under the _Frequency_ heading of the table, _transition
frequencies_ have been obtained by dividing each raw counts by the total number
of transitions _starting from that same state_.
$$
    f_{tt}=\frac{n_{tt}}{N_t}=\frac{n_{tt}}{n_{tt}+n_{tj}}=\frac{43}{74}\approx0.5811
$$
It should make sense.

It is nice to note that players on both teams---in an attempt to justify their
zillion-euro salaries---actually made every effort to make sure that their passes
reached their teammates rather than their opponents. For both Juve and Toro
intercepted passes are less than completions, and equal in number... even
though, when moving raw counts to frequencies, Juventus seesm to provide an
higher accuracy with a superior completion rate (although some might object by
arguing that these are just two different playing tactics and here we measure
_passes_ and not the real _ball possession time_).

## Moving to probabilities
For very long chains of states, that is to say for match observation times that
tend to infinity (kind of Dante's circle of hell for Italian males who refused
being soccer fans), these empirical frequencies will tend more and more
accurately to the theoretical probabilities of the transitions, according to the
frequentist definition of probability. Namely,
$$
    P_{ij}=\lim_{N_i\rightarrow\infty}f_{ij}=\lim_{N_i\rightarrow\infty}\frac{n_{ij}}{N_i}
$$
or, if you prefer,
$$
    f_{ij}=\frac{n_{ij}}{N_i}=\frac{n_{ij}}{\sum_k n_{ik}}\quad\underset{N_i\rightarrow\infty}{\longrightarrow}\quad P_{ij}
$$
Nevertheless, if all we have are the first 10 minutes of the game, the empirical
frequencies shown in the table are the best estimates of theoretical
probabilities we can hope for.
The resulting four probabilities completely describe our system and can be
assembled into one single algebraic structure, called the _transition matrix_,
featuring all the possible starting and arrival states as rows and column
headings, respectively.

> To get a little more formal, for a system with \\(m\\) states, we can
introduce the _transition matrix_ as \\(T=\left\\{P_{ab}\right\\}\_{m\times m}\\)
meaning the square \\(m\times m\\) matrix whose generic element is the
transition probability from \\(a\\) to \\(b\\).

As for our system is concerned:

{{< columns >}} <!-- begin columns block -->

|       |  \\(t\\)   |  \\(j\\)   |
|:-----:|:----------:|:----------:|
|\\(t\\)|\\(P_{tt}\\)|\\(P_{tj}\\)|
|\\(j\\)|\\(P_{jt}\\)|\\(P_{jj}\\)|

<---> <!-- magic separator, between columns -->

Based on our empirical data, the transition matrix can be estimated as
\\(\ \longrightarrow\\)


<---> <!-- magic separator, between columns -->

|       | \\(t\\) | \\(j\\) |
|:-----:|:-------:|:-------:|
|\\(t\\)| 0.5811  | 0.4189  |
|\\(j\\)| 0.3333  | 0.6667  |

{{< /columns >}}

If we are confident about their reliability, then we can use these probabilities
to model the system according to the chart below:

<div style="text-align: center;">
{{< figure src="/images/2_states_toro-juve.png" title="Juve-Toro Markov Chain" width=600 >}}
</div>

> We are dealing here with a stochastic system that admits a finite number of
states and that, at each cycle, can pass from one to the other according to
well-defined probabilities. If these probabilities depend only on the state of
the system at the time of the transition and not on previous ones (i.e., the
system is memoryless) the process is said to be Markovian of the first order.
As a stochastic system, the state that a Markovian system will assume after a
given number of cycles is not predictable. Nevertheless, its evolution over time
can be approached statistically, since even if the path is random, not all
branches are equally likely.

## Simulate the chain
Provided you have a random number generator, you might think of using the
transition matrix to simulate any long Markovian chain of states. The following
__R__ code is a general example of a "Markovian engine" for a 2-state system,
such as the soccer match between Juve and Toro.
```r {{% include "/static/codes/soccer_markov_chain.R" %}} ```
{{< soccerMarkov >}}

Since this chain is 9 times as long as the first one, moving the slider to the
right will allow you to experience the same excitement of an entire game
(without extra time or recovery) condensed into a few seconds... or, at least,
it works for me in the sense that the excitement is really the same.

What we have obtained here is one particular _realization_ of the Markovian
process among the infinite possible ones. Running the simulation again is
extremely unlikely you obtain the same realization again (by "very unlikely" I
mean that if you show me that you managed it---obviously without using
fixed-seeded pseudo-random numbers, man---I give you my car right away). What we
would get instead would be a new realization, absolutely different from the
previous one, but still similar to it, in that it would be characterized by the
same transition probabilities between states (having been generated from the
same transition matrix).

