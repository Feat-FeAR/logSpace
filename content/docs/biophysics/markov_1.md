+++
title = 'Markov 1'
date = 2023-12-01T23:20:42+01:00
draft = false
+++

# Soccer Markov Chain
Markov chains are out there. They are everywhere around us, so much so that you
can build one even before you know what they actually are. So let's do it.

## Draw the raw chain
Go to __YouTube__ and pick up a video of any soccer game. Ideally, you want to
choose a _complete_ game to get a sequence that is long enough and well
representative of the average/baseline game dynamics, rather than being limited
to a few short and outstanding actions.

For the occasion, I chose the so-called
[_Derby della Mole_ number 142](https://www.youtube.com/watch?v=5kKGW5EOJNg&t=995s),
i.e., the _Serie A_ match between Juventus and Torino held on March 20, 2016,
which ended 4-1 in favor of Juventus (which is no surprise to anyone, not even
me who does not follow soccer). Referee Rizzoli whistles the start of the game
at video time 6:45, with kickoff set for Juventus (it is legitimate to wonder
about the meaning of the earlier minutes in the clip). As I watch the game I
note down ball possession, simply by writing either _j_ or _t_ at each
interception or ball pass, depending on whether the ball comes to a Juve or Toro
player, respectively.

Here is the sequence resulting from the first 10 minutes of game play:
```
jjtjjtjjttttjtttjjjjttttjjjjjjjjtttjttjjtjjjjjjjtjjtjjjjjjtttjtttjjjjjjtjtjjtjjtttttttjttjjtjtjtjtjjjtttjtjtjjttttjtttttttjjjjjjjjjjtttttjtttjttjjjjjjjjjtjjttttjjjjjjjj
```
Well, you can think of this ugly thing (pretty much what I see whenever someone
makes me watch a soccer game) as our first Markov chain! The chain is made up of
several ___time steps___, with each step taking only one of the two possible
values of our system (either _j_ or _t_), also called the available ___states___
for the process. Finally, the pass from one state to another is called a
___transition___. Specifically, when dealing with just two states, only four
different transitions are possible:
- \\(t\rightarrow t\quad\\) passes completed by Torino
- \\(t\rightarrow j\quad\\) Torino passes intercepted by Juventus
- \\(j\rightarrow j\quad\\) passes completed by Juventus
- \\(j\rightarrow t\quad\\) Juventus passes intercepted by Torino

What we are looking at is definitely __not a deterministic system__. On the
contrary, the whole game is a __stochastic process__, both in terms of its final
result (which justifies the existence of the soccer betting ecosystem), but also
in its more marginal aspects, such as the one represented by our Markov chain,
namely ball possession. You cannot predict which of the two teams will control
the ball on, e.g., the 250th pass---and knowing who kicked off does not add any
information. Nevertheless, in most cases, the sequence of passes is not
_completely random_, but state transitions are governed by specific
__probability distributions__ that will make some pass sequences (_actions_)
more likely than others, ultimately favoring one of the two teams. Now we will
try to get an estimate of such probabilities.

## Compute some basic stats
Out of the {{< katex >}}N=167{{< /katex >}} total steps in the chain, 74 were
_t_-states, while 93 were _j_-states (always excluding the last step of the
chain, being unsuitable for transition counting). The detailed raw counts (also
called _occurrences_) of the four possible transitions are given in the _Counts_
column of the table below.
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

Using the notation \\(n_{ab}\\) for the raw counts of the generic transition
\\(a\rightarrow b\\), we have that \\(N_t=n_{tt}+n_{tj}=74\\) is the number of
times the ball was touched by a Toro player, while \\(N_j=n_{jj}+n_{jt}=93\\) is
the number of times the ball was touched by a Juventus player. Of course,
\\(N=N_t+N_j=167\\) represents the overall length of the chain. The total number
of transitions occurred from the same given state can be used to normalize
transition counts and get the more informative _transition frequencies_, which
are shown under the _Frequencies_ heading in the previous table. E.g., for the
\\(t\rightarrow j\\) transition we have 
$$
    f_{tj}=\frac{n_{tj}}{N_t}=\frac{n_{tj}}{n_{tt}+n_{tj}}=\frac{31}{74}\approx0.4189
$$

It is important to note that, because of this normalization choice, \\(f_{tj}\\)
does not represent the _global frequency_ of the \\(t\rightarrow j\\) transition
within the whole chain, rather it is the frequency of that transition __assuming
_t_ as the initial state__.

Overall, it is nice to see that players of both teams (in an attempt to justify
their zillion-euro super salaries) actually made every effort to keep their
_completion rate_ above 50% (i.e., completed passes are more common than
interceptions), even though Juventus seems to provide a superior _passing
accuracy_ (67% _vs._ 58%).

## Moving to probabilities
For very long chains, that is to say for game observation times that tend to
infinity (kind of Dante's circle of hell for Italian males who refused being
soccer fans), the empirical transition frequencies will tend more and more
accurately to the related theoretical probabilities, according to the
frequentist definition of probability. Namely,
$$
    p_{ab}=\lim_{N_a\rightarrow\infty}f_{ab}=\lim_{N_a\rightarrow\infty}\frac{n_{ab}}{N_a}
$$
or, if you prefer,
$$
    f_{ab}=\frac{n_{ab}}{N_a}=\frac{n_{ab}}{\sum_k n_{ak}}\quad\underset{N_a\rightarrow\infty}{\longrightarrow}\quad p_{ab}
$$
Nevertheless, if all we have are the first 10 minutes of the game, the empirical
frequencies shown in the table are also the best estimates we can get for the
four theoretical probabilities. These numbers are usually assembled into one
single algebraic structure, called the _transition matrix_ that features the
probabilities for all the possible starting and arrival states as rows and
column headings, respectively.

|                   |...to \\(t\\)|...to \\(j\\)|
|:-----------------:|:-----------:|:-----------:|
|__from \\(t\\)...__|\\(p_{tt}\\) |\\(p_{tj}\\) |
|__from \\(j\\)...__|\\(p_{jt}\\) |\\(p_{jj}\\) |

In algebraic notation:
$$
    \bm{P}=
$$


> To get a little more formal, for a system with \\(m\\) states, we can
introduce the _transition matrix_ as
\\(\bm{P}=\left\\{p_{ab}\right\\}\_{m\times m}\\) meaning the square
\\(m\times m\\) matrix whose generic element is the transition probability from
\\(a\\) to \\(b\\) (i.e., the probability of having a state _b_, conditional on
coming from state _a_).
>
>Also, by definition, \\(\bm{P}\\) is a _stochastic matrix_,
meaning that all of its elements are between 0 and 1 (\\(p_{ab}\in[0,1]\\)) and
each row must sum to 1 (\\(\sum_b p_{ab}=1\ \forall a\\)).

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

Now it comes the most important and distinctive feature that a Markov process must possess to call itself such, namely, the fact that the transition matrix just defined fully describes our system.

If we are confident about their reliability, then we can use these probabilities
to model the system according to the ___state diagram___ below:

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

## Simulate the process
Provided you have a random number generator, you might think of using the
transition matrix to simulate any long Markovian chain of states. The following
__R__ code is a general example of a "Markovian engine" for a 2-state system,
such as the soccer game between Juve and Toro.
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





(although some might object by
arguing that these are just two different playing tactics and here we measure
_passes_ and not the real _ball possession time_).
https://shop.elsevier.com/books/markov-processes-for-stochastic-modeling/ibe/978-0-12-407795-9