+++
title = 'Markov 1'
date = 2023-12-01T23:20:42+01:00
draft = true
+++


# Soccer Markov Chain

## Draw the raw chain

Go to Youtube and pick up a video of any soccer match. Ideally, you want to choose a complete match so that you can select a completely random sequence of game play that is representative of the baseline dynamics of the match, and not necessarily an outstanding action, which in being outstanding, may not be representative of the average dynamics.

For the occasion, I chose the so-called Derby della Mole number 142, i.e., the Serie A match between Juve and Toro held on March 20, 2016, which ended 4-1 in favor of Juve (which is certainly not a surprise to anyone, not even to me who does not follow soccer). Referee Rizzoli whistles the start of the match at video time 6:45 (it is legitimate to wonder what happened in the preceding minutes) with kickoff set for Juve. From that moment the game starts for us as well (finally a soccer match in which you also do something!). I watch the video with a text editor open in the foreground and my fingers ready to strike either j or t key. With each interception or ball pass, I hit either the j or t key depending on whether the ball comes to the feet of a Juve or Toro player, respectively.

This is the resulting sequence from the first 10 minutes of the gameplay...
```
jjtjjtjjttttjtttjjjjttttjjjjjjjjtttjttjjtjjjjjjjtjjtjjjjjjtttjtttjjjjjjtjtjjtjjtttttttjttjjtjtjtjtjjjtttjtjtjjttttjtttttttjjjjjjjjjjtttttjtttjttjjjjjjjjjtjjttttjjjjjjjj
```
Well, this ugly thing (pretty much what I see whenever someone makes me watch a soccer game) is our first Markov Chain!
We call _j_ and _t_ the two possible states of our system, while the pass from one state to the following one is called a _transition_. 


## Compute some basic stats

If we exclude the last state that does not give rise to any subsequent transition, the number of states equals the number of transitions, i.e. N=167. In particular, I tailed 74 _t_-states and 93 _j_-states (again excluding the last state, which is a _j_-state). Here is the detail of the four possible transitions
- t->t : n_tt = 43 (number of passes completed by Toro)
- t->j : n_tj = 31 (number of Toro passes intercepted by Juve)
- j->j : n_jj = 62 (number of passes completed by Juve)
- j->t : n_jt = 31 (number of Juve passes intercepted by Toro)

where, of course, N_t=n_tt+n_tj=74 and N_j=n_jj+n_jt=93, and N=N_t+N_j=167.

Based on raw counts we can get transition frequencies by simply dividing each transition occurency n_ij by the total number of transitions N_i originating from that same state i.

| Transition | Name              | Counts | Frequency ||
|:----------:|:-----------------:|:------:|:---------:|-|
| t->t       | Toro completion   | 43     | 0.5811    | |
| t->j       | Juve interception | 31     | 0.4189    | |
| j->j       | Juve completion   | 62     | 0.6667    | |
| j->t       | Toro interception | 31     | 0.3333    | |
| __TOTAL__  |                   |__167__ | __2__     | |

<table>
    <thead>
        <tr style="border: none;">
            <th>Transition</th>
            <th>Name</th>
            <th>Counts</th>
            <th>Frequency</th>
        </tr>
    </thead>
    <tbody>
        <tr align="center">
            <td>t->t</td>
            <td>Toro completion</td>
            <td>43</td>
            <td>0.5811</td>
            <td rowspan=2 style="font-style: italic;">1</td>
            <td rowspan=4 style="font-style: italic;">2</td>
        </tr>
        <tr align="center">
            <td>t->j</td>
            <td>Juve interception</td>
            <td>31</td>
            <td>0.4189</td>
        </tr>
        <tr align="center">
            <td>j->j</td>
            <td>Juve completion</td>
            <td>62</td>
            <td>0.6667</td>
            <td rowspan=2 style="font-style: italic;">1</td>
        </tr>
        <tr align="center">
            <td>j->t</td>
            <td>Toro interception</td>
            <td>31</td>
            <td>0.3333</td>
        </tr>
        <tr align="center" style="font-style: italic;">
            <td colspan=2 style="border: none;"></td>
            <td>167</td>
            <td>2</td>
        </tr>
    </tbody>
</table>



It is nice to note that players on both teams--in an attempt to justify their zillion-euro salaries--actually made an effort to make sure that their passes reached their teammates rather than their opponents. For both Juve and Toro intercepted passes are less than completions, and equal in number... even though, when moving to frequencies, Juventus seem to provide an higher accuracy with a superior completion rate (although some might object by arguing that these are just two different playing tactics and here we measure _passes_ and not the real _ball possession time_).

## Moving to probabilities

For very long chains of states (i.e., for match observation times that tend to infinity), these empirical frequencies will tend more and more accurately to the theoretical probabilities of the transitions, according to the frequentist definition of probability. Namely,
$$
f_{ij}=\frac{n_{ij}}{N_i}=\frac{n_{ij}}{\sum_k n_{ik}}\quad\underset{N_i\rightarrow\infty}{\longrightarrow}\quad P_{ij}
$$
or, if you prefer,
$$
P_{ij}=\lim_{N_i\rightarrow\infty}f_{ij}=\lim_{N_i\rightarrow\infty}\frac{n_{ij}}{N_i}
$$

Nevertheless, if all we have are the first 10 minutes of the game, the empirical frequencies shown in the table are the best estimates of theoretical probabilities we can hope for. If we are confident about their reliability, then we can use them to model the system according to the chart below:

