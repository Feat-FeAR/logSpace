+++
title = 'Markov 1'
date = 2023-12-01T23:20:42+01:00
draft = false
+++

# Soccer Markov Chain
Markov chains are out there. They are everywhere around us, so much so that you
can get one even before knowing what they actually are. Let me show you.

## Draw the raw chain
Go to __YouTube__ and pick up a video of any soccer game. Ideally, you want to
choose a _complete_ game to get a sequence that is long enough and well
representative of the average game dynamics, rather than being limited to a few
short and outstanding actions.

For the occasion, I chose the so-called
[_Derby della Mole_ number 142](https://www.youtube.com/watch?v=5kKGW5EOJNg&t=995s),
i.e., the _Serie A_ match between Juventus and Torino held on March 20, 2016,
which ended 4-1 in favor of Juventus (which is no surprise to anyone, not even
to me, who doesn't follow soccer). Referee Rizzoli whistles the start of the
game at video time 6:45, with kickoff set for Juventus (it is legitimate to
question the content of the earlier minutes in the clip). As I watch the game, I
note down ball possession, simply by writing either _j_ or _t_ at each
interception or ball pass, depending on whether the ball comes to a Juve or Toro
player, respectively.

Here is the sequence resulting from the first 10 minutes of game play:
```
jjtjjtjjttttjtttjjjjttttjjjjjjjjtttjttjjtjjjjjjjtjjtjjjjjjtttjtttjjjjjjtjtjjtjjtttttttjttjjtjtjtjtjjjtttjtjtjjttttjtttttttjjjjjjjjjjtttttjtttjttjjjjjjjjjtjjttttjjjjjjjj
```
Well, you can think of this ugly thing (pretty much what I see whenever someone
makes me watch a soccer game) as our first random chain! The chain is made up of
several ___time steps___, with each step taking only one of the two possible
values in our system---either _j_ or _t_---also referred to as the possible
___states___ allowed by the process. Finally, the pass from one state to another
is called a ___transition___. Specifically, when dealing with just two states,
only four different transitions are possible, in this case being
- \\(t\rightarrow t\quad\\) passes completed by Torino
- \\(t\rightarrow j\quad\\) Torino passes intercepted by Juventus
- \\(j\rightarrow j\quad\\) passes completed by Juventus
- \\(j\rightarrow t\quad\\) Juventus passes intercepted by Torino

What we are looking at is definitely __not a deterministic system__. On the
contrary, the whole game is a __stochastic process__, both in terms of its final
result (which justifies the existence of the soccer betting ecosystem), but also
in its more marginal aspects, such as the one represented by our putative Markov
chain, namely ball possession. You cannot predict which of the two teams will
control the ball on, e.g., the 250th pass---and even knowing who kicked off does
not add any information. Nevertheless, in most cases, the sequence of passes is
not _completely random_, but state transitions are governed by specific
__probability distributions__ that will make some pass sequences (_actions_)
more likely than others, ultimately favoring one of the two teams. Now we will
try to get an estimate of such probabilities.

## Compute some basic stats
Out of the {{< katex >}}N=167{{< /katex >}} total steps in the chain, \\(74\\)
were _t_-states, while \\(93\\) were _j_-states (we always exclude the last step
of the chain, being unsuitable for transition counting). The detailed raw counts
(also called _occurrences_) of the four possible transitions are given in the
_Counts_ column of the table below.
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
transition counts and get the more informative _transition frequencies_
\\(\nu\\), which are shown in the _Frequency_ column of the previous table.
E.g., for the \\(t\rightarrow j\\) transition we have 
$$
\nu_{tj}=\frac{n_{tj}}{N_t}=\frac{n_{tj}}{n_{tt}+n_{tj}}=\frac{31}{74}\approx0.4189
$$

It is important to note that, because of this normalization choice,
\\(\nu_{tj}\\) does not represent the _global frequency_ of the
\\(t\rightarrow j\\) transition within the whole chain, rather it is the
frequency of that transition __assuming _t_ as the initial state__.

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
frequentist interpretation of probability. Namely,
$$
p_{tj}=\lim_{N_t\rightarrow\infty}\nu_{tj}=\lim_{N_t\rightarrow\infty}\frac{n_{tj}}{N_t}
$$
or, if you prefer,
$$
\nu_{tj}=\frac{n_{tj}}{N_t}=\frac{n_{tj}}{\sum_k n_{tk}}\quad\underset{N_t\rightarrow\infty}{\longrightarrow}\quad p_{tj}
$$
gives the probability that a pass by a Toro player will be intercepted by the
opposing team.

Nevertheless, if all we have are the first 10 minutes of the game, the empirical
frequencies shown in the previous table are also our best estimates of the four
theoretical probabilities. These numbers are usually assembled into one single
algebraic structure, called the _transition matrix_, that features the
probabilities for all the possible ordered pairs of starting and arrival states,
indexed by rows and columns, respectively.

|                   |...to \\(t\\)|...to \\(j\\)|
|:-----------------:|:-----------:|:-----------:|
|__From \\(t\\)...__|\\(p_{tt}\\) |\\(p_{tj}\\) |
|__From \\(j\\)...__|\\(p_{jt}\\) |\\(p_{jj}\\) |

Using the standard notation for matrix algebra, the transition matrix
\\(\bm{P}\\) associated with our state sequence should be
{{< katex display >}}
    \bm{P} =
    \begin{pmatrix}
        p_{tt} & p_{tj}\\
        p_{jt} & p_{jj}
    \end{pmatrix} \approx
    \begin{pmatrix}
        0.5811 & 0.4189\\
        0.3333 & 0.6667
    \end{pmatrix}
{{< /katex >}}

Also note how, by the way the transition matrix is built, __each row of
\\(\bm{P}\\) must necessarily sum to 1__, being the _probability distribution_
of the next step state, from a given starting state. For instance, in our case
the first line of \\(\bm{P}\\) tells us with what probability a Toro pass will
either succeed or be intercepted---and yet we already know that one of the two
things has to happen, which is why the sum of the row's probabilities must be 1.

## The Markovian hypothesis
Now it comes the most important and distinctive feature that a Markov chain must
possess to call itself such, namely, the fact of being a ___memoryless___ random
process. Many standard ways of describing this so-called _Markovian property_
can be found in the literature, all of them equivalent. Here are a few:
- at each time step, the probabilities that govern the transition to the next
    state depend only on the current state of the system and not on previous
    ones;
- given the present, the future of the random process is independent of the
    past;
- the future of the random process depends only on where it is now and not on
    how it got there;
- the dependence of the random process on the past is only through the previous
    state;
- the transition matrix fully describes the random process.

In any case, since knowledge of the current state is the only requirement for
the transition to the next one, any Markov chain can be represented by a
___state diagram___ like the one below, where states are represented as nodes
and transitions are arrows.
<div style="text-align: center;">
{{< figure src="/images/2_states_toro-juve.png" title="Juve-Toro Markov Chain" width=600 >}}
</div>

Certainly doubts may arise as to whether the system we have chosen really meets
the Markovian hypothesis and it could be therefore properly modeled by a Markov
chain. If, for example, we think that the successful outcome of a pass also
depended on having received the ball from a teammate rather than on having just
stolen it from an opponent---that is reasonable---the Markovian hypothesis would
fail, or rather we would have to resort to a _higher-order_ model. The point is
that any model is by definition a simplification of reality, usually intended to
draw out some fundamental aspects of the phenomenon, at the expense of other
aspects that may be considered secondary. The correct question should therefore
be how relevant second-order (or higher-order) effects are to the description of
the system  we are interested in.

## Simulate the process
If we assume that the Markovian hypothesis is---at least approximately---met, we
might think of using the empirical transition matrix drawn from the real
sequence to simulate any long Markovian chain of states (provided we have a
random number generator). The following __R__ code is a general example of a
"Markovian engine" for a 2-state process, such as our soccer game between
Juventus and Torino.
```r {{% include "/static/codes/soccer_markov_chain.R" %}} ```
{{< soccerMarkov >}}

What we obtained here is one particular _realization_ of the Markovian random
process defined by \\(bm{P}\\), among the infinite possible ones. By running the
simulation again, it is extremely unlikely to get the same sequence of states
(by "very unlikely" I mean that if it happens---obviously without using
fixed-seeded pseudo-random numbers, man---I will gift you my credit card right
away). What we would get instead would be a new realization, absolutely
different from the previous one, but still similar to it, in that it would be
based on the same transition probabilities between states (having been generated
from the same transition matrix).

More in detail, we simulated here a chain that is 9 times as long as the
original one, thus representing _a possible_ full game without stoppage or extra
time, that is to say 90 endless minutes of boring idle playing. By moving the
above slider to the right you can experience the same excitement of an entire
game condensed into a few seconds... or, at least, it works for me in the sense
that the emotion is really the same.

## A bit of formalism
A __random process__ is generally defined as a random function of time
\\(X\\!\left(t\right)\\), that is to say a time sequence of random variables even though independent variables of different nature
(e.g., position) are still possible. Consistent with a standard notation, the
function \\(x\\!\left(t\right)\\) is a member of an _ensemble_ (family, set, collection) of functions, which is denoted with an upper case letter. Thus,
\\(X\\!\left(t\right)\\) represents the random process, while
\\(x\\!\left(t\right)\\) is one particular member or _realization_ of the random
process. For discrete time signals we use the notation \\(X\\!\left[n\right]\\)
to represent the discrete sequence of random variables and
\\(x\\!\left[n\right]\\) to represent the discrete sequence of numbers of a
particular realization. This occurs when either a continuous time variable is
sampled to regularly spaced discrete points in time (\\(t=n\ \delta t\\)) or when
the process is inherently discrete, consisting in as a sequence of cycles or
steps (as in the soccer case).

For a system with \\(m\\) states, we can introduce the _transition matrix_ as
\\(\bm{P}=\left\(p_{ab}\right\)\_{m\times m}\\) meaning the square
\\(m\times m\\) matrix whose generic element is the transition probability from
\\(a\\) to \\(b\\) (i.e., the probability of having a state _b_, conditional on
coming from state _a_).
{{< katex display >}}
    \bm{P} =
    \begin{pmatrix}
        p_{11} & p_{12} & \ldots & p_{1m}\\
        p_{21} & p_{22} & \ldots & p_{2m}\\
        \vdots & \vdots & \ddots & \vdots\\
        p_{m1} & p_{m2} & \ldots & p_{mm}
    \end{pmatrix}
{{< /katex >}}
$$
p_{ab}=\textrm{Pr}\left(X\\!\left[k+1\right]=b\ |\ X\\!\left[k\right]=a\right)
$$

Also, by definition, \\(\bm{P}\\) is a _stochastic matrix_,
meaning that all of its elements are between 0 and 1 (\\(p_{ab}\in[0,1]\\)) and
each row must sum to 1 (\\(\sum_b p_{ab}=1\ \forall a\\)).


(although some might object by
arguing that these are just two different playing tactics and here we measure
_passes_ and not the real _ball possession time_).

As a stochastic system, the state that a Markovian system will assume after a
given number of cycles is not predictable. Nevertheless, its evolution over time
can be approached statistically, since even if the path is random, not all
branches are equally likely.

the xxx function is intended to measure...
