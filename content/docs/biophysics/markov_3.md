---
title: "K_V Markov Chain"
weight: 30
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# K<sub>V</sub> Markov Chain

## System design
What if we wanted to model the behavior of a gated channel during its activation?
An example could be the current through a voltage-dependent potassium channel (K<sub>V</sub>) during the application of a depolarization step in a voltage clamp experiment.
As mentioned in the previous chapter, the arrival of a gating stimulus can be seen, in Markovian terms, as a change in the values of the transition matrix, ultimately increasing the probability of observing the channel in any of its possible open states.
For simplicity, again, we will assume that our K<sub>V</sub> channel admits only two conformational states:
{{< katex >}}S=\left\{\text{closed},\text{open}\right\}\equiv\left\{c,o\right\}{{< /katex >}}.
However, in contrast to the previous case, now the transition matrix will be a function of time (\\(\bm{P}\\!\left[k\right]\\)) that changes its values after the time step \\(k_{0}=200\\) of application of the depolarizing stimulus.
Given the step shape of our gating voltage, it is reasonable to imagine an instantaneous transition between the two possible configurations of the transition matrix.
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

Another thing we might be interested in is the behavior at whole-cell level.
In other words, we ask whether it is possible, starting from the characterization of a single-channel current, to infer the _macroscopic current_ that we would see using a whole-cell voltage-clamp configuration to record the overall current flowing through a large number of channels of the same type.
From a computational point of view, the answer is rather straightforward since the macroscopic current is nothing more than the sum of all the elementary currents.
Thus, we can simply simulate the process a number of times equal to the number of channels that we expect to be expressed in membrane and then sum all the realizations---each representing a single channel---point by point in time.
At the end of this section we will also try to address this question from a theoretical point of view and we will find that, in most cases, it is not necessary to have a large set of realizations to gain information about the ensemble.
We only need one or even none.

## Simulate channel activation
The following __R__ script draws heavily from the previous one, iterating the same "chain builder loop" \\(M=10^3\\) times to represent one thousand independent K<sub>V</sub> channels, subject to the same depolarizing step starting at step \\(k\\).
For this, two different transition matrices are initially defined and appropriately selected as a function of time.
All single channel traces are stored in the same data set, each as a different row.
Finally, the `iTrace` functions (from the `r4tcpl` package) is used to simultaneously draw three representative realizations (single channel currents) and the ensemble sum (whole-cell macroscopic voltage-activated potassium current).
```r {{% include "/static/codes/KV_markov_chain.R" %}} ```
{{< kvMarkov >}}

Clicking the `Generate Currents` button multiple times will result in ever-changing single channel traces, yet generating the same whole-cell current!
This should give a fairly good sense of the __key transition from the stochastic behavior of the individual channels to the determinism observed at whole-cell level__.

Some other features of electrophysiological interest deserve attention:
1. __The particular time course of a macroscopic current is determined by single-channel kinetics.__
Even though the onset of the depolarizing step is instantaneous---and so is the switching between the two transition matrices---the macroscopic current exhibits a gradual increase.
An even more _slowly activating_ potassium current can be simulated simply by further lowering the \\(p_{co}\\) transition probability.
2. __Reaching the maximal macroscopic current level does not necessarily imply that all channels are open.__
Looking at the whole-cell current, could you tell how many channels are open simultaneously, on average, at I<sub>max</sub>?
3. __Likewise, you cannot rule out that, even in the absence of the gating stimulus, you have some channels open.__
The small initial transient visible in the macroscopic current trace is clearly an artifact coming from the fact that, by code design, all our Markov chains started with zero (all channels are closed for \\(k=0\\)).
Nevertheless, this allows us to better appreciate the small _leakage_ through K<sub>V</sub> under hyperpolarization conditions.  

## Evolving the system
Any random process (either continuous or discrete) taken at any specific time point is simply a random variable and, as such, it can be described in terms of its probability distribution.
In the case of our discrete Markov chain, when we are interested in the temporal evolution of the overall ensemble rather than in some particular realizations of the stochastic process, it is useful to resort to the probability distribution of states at a given time step \\(k\\), as expressed by the _probability mass function_ (PMF), here defined as the row vector
{{< katex display >}}
\bm{\pi}\!\left[k\right]=\left(\pi_{_{1}}\!\left[k\right]\quad\pi_{_{2}}\!\left[k\right]\quad\pi_{_{3}}\!\left[k\right]\quad\ldots\quad\pi_{m}\!\left[k\right]\right)
{{< /katex >}}
whose generic element
$$
\pi_a\\!\left[k\right]=\textrm{Pr}\\!\left(X\\!\left[k\right]=a\right)\quad\forall a\in S
$$
is the probability of being in state \\(a\\) at time \\(k\\) and, clearily,
$$
\sum_{a\in S} \pi_{a}=1\quad\forall\ k\in\mathbb{N}
$$
Notably, even in this case, starting from any \\(\bm{\pi}\\) vector, the transition probabilities contained in \\(\bm{P}\\) can be used to calculate the PMF at later times.
For example, in the case of an ion channel with just two possible conformational states \\(\left\\{c,o\right\\}\\), we can easily account for _all the ways_ to get to each one of them in one step just by applying basic multiplication and addition rules for `AND` and `OR` probability composition, respectively, so that
{{< katex display >}}
\begin{aligned}
	\bm{\pi}\!\left[k+1\right] & = \left(\pi_c\!\left[k+1\right]\quad\pi_o\!\left[k+1\right]\right)\\
							   & = \left(\pi_c\!\left[k\right]p_{cc}\!+\!\pi_o\!\left[k\right]p_{oc}\quad\pi_c\!\left[k\right]p_{co}\!+\!\pi_o\!\left[k\right]p_{oo}\right)\\
							   & = \bm{\pi}\!\left[k\right]\bm{P}
\end{aligned}
{{< /katex >}}
In fact, the last vector equation holds unchanged whatever the (countable) dimension of \\(S\\).
It tells us that, in order to calculate the distribution of states of the system at the next step, we just need to apply (via matrix product) the transition matrix to the probability distribution of states.
Hence, to evolve the system by two steps it will be sufficient to apply the \\(\bm{P}\\) matrix twice,
$$
\bm{\pi}\\!\left[k+2\right]=\bm{\pi}\\!\left[k\right]\bm{P}\bm{P}=\bm{\pi}\\!\left[k\right]\bm{P}^2
$$
and so on.
More generally, it holds that
$$
\bm{\pi}\\!\left[k\right]=\bm{\pi}\\!\left[0\right]\bm{P}^k
$$
which is why \\(\bm{P}\\) and \\(\bm{P}^k\\) are also referred to as the \\(1\\)-step and \\(k\\)-step transition probability matrices (or _operators_), respectively.
It can be shown that \\(\bm{P}^k\\) is still a stochastic matrix.
We can also notice that the general element of \\(P^k\\) is the \\(k\\)-step transition probability
{{< katex display >}}
p^{\left(k\right)}_{ab}\equiv\textrm{Pr}\!\left(X_{h+k}=b\ |\ X_{h}=a\right)\quad=\sum_{\alpha_{1}\,\alpha_{2}\,\ldots\,\alpha_{k-1}} p_{a\alpha_{1}}\;p_{\alpha_{1}\alpha_{2}}\;\ldots\;p_{\alpha_{k-1}b}
{{< /katex >}}
namely, the sum of the probabilities of getting from \\(a\\) to \\(b\\) in \\(k\\) steps by following all possible trajectories.
This way of representing higher-order transition probabilities should also make the following result---known as the __Chapman-Kolmogorov Equation__---quite reasonable.
{{< katex display >}}
p^{\left(k+h\right)}_{ab}=\sum_{\alpha} p^{\left(k\right)}_{a\alpha}\;p^{\left(h\right)}_{\alpha b}
{{< /katex >}}

Most importantly, we notice that---given a PMF and the transition operator \\(\bm{P}\\)---the __ensemble average__ can be calculated at each instant \\(k\\) simply as the expected value of the stochastic process \\(X\\!\left[k\right]\\)
$$
E\left[X\\!\left[k\right]\right]=\sum_{a\in S}a\\,\pi_{a}\\!\left[k\right]
$$
This function of time represents the evolution of the ensemble as a whole and can be viewed as a normalized and "noiseless" version of the macroscopic current we previously calculated as the sum of a large number of single-channel traces.

## Stationary state and ergodicity
In our model of K<sub>V</sub> channel, the system (i.e., the macroscopic current) clearly tends to reach a steady state over time (both in the hyper- and de-polarization phases).
This is a fairly common behavior of many Markov chains.
Intuitively, we expect that the influence of the initial state will fade with time and that for \\(k\rightarrow\infty\\) the probability of having the system in state \\(X\\!\left[k\right]=a\\), namely \\(\pi_{a}\\!\left[k\right]\\), is independent of the state at time \\(0\\). 
The steady state distribution \\(\bm{\hat{\pi}}\\) can thus be viewed as
{{< katex display >}}
\bm{\hat{\pi}}\equiv\lim_{k\rightarrow\infty}\bm{\pi}\!\left[k\right]=\lim_{k\rightarrow\infty}\bm{\pi}\!\left[0\right]\bm{P}^{k}
{{< /katex >}}

If we try to compute the limiting form of the transition matrix in __R__ by running 
```r
matpow::matpow(TM_depol, k=1e3, squaring=T)$prod1
```
we see that \\(\bm{P}^k\\), as \\(k\rightarrow\infty\\), converges to a matrix whose rows are all identical,
```r
          closed      open
closed 0.3333333 0.6666667
open   0.3333333 0.6666667
```
thus meaning that \\(\bm{\hat{\pi}}\\) will always be the same regardless of the initial distribution \\(\bm{\pi}\\!\left[0\right]\\)
{{< katex display >}}
\bm{\hat{\pi}}\equiv\left(\hat{\pi}_c\quad\hat{\pi}_o\right)=\bm{\pi}\!\left[0\right]\left(\lim_{k\rightarrow\infty}\bm{P}^{k}\right)=\left(0.33\quad 0.66\right)\qquad\forall\,\bm{\pi}\!\left[0\right]
{{< /katex >}}
and equal to __any row__ of limiting transition matrix (note below the dropping of the subscript \\(a\\) denoting the state of origin)
{{< katex display >}}
\lim_{k\rightarrow\infty}p_{ab}^{\left(k\right)}=\hat{\pi}_{b}\qquad\forall\,a,b\in\left\{c,o\right\}
{{< /katex >}}

The interpretation of this is straightforward: __for a long enough waiting time, regardless of its starting state, the system will settle into a configuration with---on average---⅔ of the K<sub>V</sub> channels open and ⅓ closed.__
The expected macroscopic current level will be then
{{< katex display >}}
I_{max}=M\left(i_{c}\,\hat{\pi}_{c}+i_{o}\,\hat{\pi}_{o}\right)=i_{o}\,\hat{\pi}_{o}\,M
{{< /katex >}}
that, in our simulation, gave \\(I_{max}=666\\) normalized current units, since \\(i_o=1\\) normalized units and \\(M=10^3\\) K<sub>V</sub> channels.

On the other hand, one might also guess that, if each channel spends \\(q\\%\\) of its time in the conductive state, at any given instant of the steady state we should expect to find, on average, \\(q\\%\\) of channels open.
In other words, the relative amount of open states in a single channel current trace, should be equal to the proportion of open channels at population level (at a fixed instant of the steady state).
In our case, this insight is absolutely true (at least for long observation times and large ensembles) and it is indication of an important property of our stochastic system called __ergodicity__.
```r
# Rebuild a chain using 'N <- 1e5' as chain length, then compute the steady
# state as the relative amount of "open" states for a single channel (after the
# onset of the depolarization step)
N_O <- sum(current[200:N] > 0.5)
N_O/(N-200) # returns [1] 0.6657916

# or simply as the time average of one realization (since we are using
# normalized current levels in {0,1})
mean(current[200:N]) # returns [1] 0.665827
```

More generally, an _ergodic stochastic process_ is a stationary process in which every member of the ensemble exhibits the same statistical behavior as the ensemble.
This implies that it is possible to determine the statistical behavior of the ensemble by examining only one typical sample function.
In particular, if the time average of one realization is equal to the ensemble average, then we say that the random process is _ergodic in the mean_.
And this holds for both continuous and discrete random processes.
$$
E\left[X\\!\left(t\right)\right]=\langle x\\!\left(t\right)\rangle\equiv\lim_{T\rightarrow\infty}\frac{1}{T}\int_{0}^{T} x\\!\left(t\right)dt
$$
$$
E\left[X\\!\left[k\right]\right]=\langle x\\!\left[k\right]\rangle\equiv\lim_{N\rightarrow\infty}\frac{1}{N}\sum_{k=1}^{N} x\\!\left[k\right]
$$

In general, nothing can be said about the existence and uniqueness of the stationary distribution of a Markov chain, but __when the chain is ergodic then we can be sure that \\(\bm{\hat{\pi}}\\) exists and is unique__ (i.e., it does not depend on the initial distribution).
In these cases, the limiting distribution can be obtained in exact form and in a direct manner---i.e., without the need to multiply \\(\bm{P}\\) by itself many times until an acceptable approximation of \\(\lim_{k\rightarrow\infty}\bm{P}^{k}\\) is obtained, or to statistically analyze the behavior of a realization over long observation times.
Just consider that, by definition of stationary distribution, there must exist a point where it becomes independent of time
$$
\bm{\hat{\pi}}\\!\left[k+1\right]=\bm{\hat{\pi}}\\!\left[k\right]
$$
or, in vector terms,
$$
\bm{\hat{\pi}}\\,\bm{P}=\bm{\hat{\pi}}
$$
In other words, __the stationary PMF is the left eigenvector of the transition matrix, that corresponds to the eigenvalue \\(\lambda=1\\)__.

This eigenvalue equation can also be rewritten as a system of algebraic equations
{{< katex display >}}
\sum_{a=1}^{m}\hat{\pi}_{a}\,p_{ab}=\hat{\pi}_{b}\qquad\textrm{where}\ b\in\left\{1,2,\ldots,m\right\}
{{< /katex >}}
which, in the case of a system with only 2 states, reduces to

{{< katex display >}}
\left\{
\begin{aligned}
	\hat{\pi}_{_{1}}\,p_{_{11}} + \hat{\pi}_{_{2}}\,p_{_{21}} & =\hat{\pi}_{_{1}}\\
	\hat{\pi}_{_{1}}\,p_{_{12}} + \hat{\pi}_{_{2}}\,p_{_{22}} & =\hat{\pi}_{_{2}}
\end{aligned}
\right.
{{< /katex >}}
{{< katex display >}}
\left\{
\begin{aligned}
	\hat{\pi}_{_{1}}\left(1-p_{_{12}}\right) + \hat{\pi}_{_{2}}\,p_{_{21}} & =\hat{\pi}_{_{1}}\\
	\hat{\pi}_{_{1}}\,p_{_{12}} + \hat{\pi}_{_{2}}\left(1-p_{_{21}}\right) & =\hat{\pi}_{_{2}}
\end{aligned}
\right.
{{< /katex >}}
{{< katex display >}}
\left\{
\begin{aligned}
	-\hat{\pi}_{_{1}}\,p_{_{12}} + \hat{\pi}_{_{2}}\,p_{_{21}} & =0\\
	\hat{\pi}_{_{1}}\,p_{_{12}} - \hat{\pi}_{_{2}}\,p_{_{21}}  & =0
\end{aligned}
\right.
{{< /katex >}}
This is an homogeneous linear system with infinite solutions making up the 1-dimensional vector subspace spanned by {{< katex >}}\left\{\left(p_{_{21}}\ p_{_{12}}\right)\right\}{{< /katex >}} (i.e., the eigenspace associated with \\(\lambda=1\\)), namely
{{< katex display >}}
\bm{\hat{\pi}}=\left(\hat{\pi}_{_{1}}\quad\hat{\pi}_{_{2}}\right)=\beta\left(p_{_{21}}\quad p_{_{12}}\right)\qquad\textrm{with}\ \beta\in\mathbb{R}
{{< /katex >}}
However, because of the PMF normalization constraint, we must impose
{{< katex display >}}
\beta\,p_{_{21}}+\beta\,p_{_{12}}=1\ \Rightarrow\ \beta=\frac{1}{p_{_{21}}+p_{_{12}}}
{{< /katex >}}
to finally obtain the only admissible solution
{{< katex display >}}
\bm{\hat{\pi}}=\left(\hat{\pi}_{_{1}}\quad\hat{\pi}_{_{2}}\right)=\left(\frac{p_{_{21}}}{p_{_{21}}+p_{_{12}}}\quad\frac{p_{_{12}}}{p_{_{21}}+p_{_{12}}}\right)
{{< /katex >}}
which is the general solution for the 2-state ergodic system.
This form only involves the ratios between the off-diagonal elements of the transition matrix and, applied to our channel model, it becomes
{{< katex display >}}
\bm{\hat{\pi}}=\left(\hat{\pi}_{_{1}}\quad\hat{\pi}_{_{2}}\right)=\left(\frac{p_{oc}}{p_{oc}+p_{co}}\quad\frac{p_{co}}{p_{oc}+p_{co}}\right) =\left(\frac{\scriptstyle{0.01}}{\scriptstyle{0.01\,+\,0.02}}\quad\frac{\scriptstyle{0.02}}{\scriptstyle{0.01\,+\,0.02}}\right)=\left(\frac{1}{3}\quad\frac{2}{3}\right)
{{< /katex >}}
which confirms what we already found by a limit approximation.

Conceptually, the fact that the final distribution of open and closed channels in the system depends only on the ratio of the opening and closing probabilities of the single channel is very reasonable.
Yet not trivial.

## Ergodicity criteria
We already said that, if a chain is ergodic then its stationary distribution exists and is unique, but we still lack one fundamental thing: how can we be sure that a given stochastic system is ergodic?
In general the question is not trivial.
Fortunately, there are some theorems---that we will not prove---from which we can derive some useful criteria for spotting an ergodic system at first glance (or nearly so).

To understand these criteria we must first introduce the concept of _irreducible chain_.
- Loosely speaking, a set of states is said to be _closed_ if it is not possible to get out of it (i.e., it's a prison).
In the example below, sets \\(\left\\{A,B,C,D,E,F,G,H,I,J\right\\}\\), \\(\left\\{D,E,F\right\\}\\), and \\(\left\\{G,H,I,J\right\\}\\) are closed, but \\(\left\\{A,B,C\right\\}\\) is not.
- A Markov chain is said to be _irreducible_ if there is no other closed set except the one formed by all the states.
In the example below, set \\(\left\\{A,B,C,D,E,F,G,H,I,J\right\\}\\) is not irreducible, since it can be can be reduced to \\(\left\\{D,E,F\right\\}\\) and \\(\left\\{G,H,I,J\right\\}\\), which, on the contrary, are irreducible Markov chains.
<div style="text-align: center;">
{{< figure src="/images/reducible_markov.png" title="An example of reducible Markov chain" width=383 >}}
</div>

Also, we have to remember that all the eigenvalues of a stochastic matrix have modulus \\(\left|\lambda_{j}\right|\leq1\\), and among them the eigenvalue \\(\lambda_{1}=1\\) (possibly with multiplicity larger than 1) is always present.
Then, it can be shown that the following theorem holds true.
> __THEOREM__ 
> 
> __Irreducible Markov chains with a finite number of states are ergodic if and only if all the eigenvalues of the transition matrix are strictly less than 1 in modulus, apart from one (and only one) that is exactly 1, whose corresponding (and properly normalized) eigenvector is the stationary probability distribution of the ergodic chain and equal to any row of {{< katex >}}\lim_{k\rightarrow\infty}\bm{P}^{k}{{< /katex >}}.__

On the contrary,
- if the chain is reducible, the multiplicity of the eigenvalue \\(\lambda=1\\) indicates the number of irreducible finite chains in the system.
In this case, the transition matrix can be rearranged in diagonal blocks by swapping rows and columns and the way the system behaves---including its possible steady state---may depend on the initial state (\\(\lim_{k\rightarrow\infty}\bm{P}^{k}\\) will keep a different row for each possible starting state).
- if the chain is irreducible but all the eigenvalues are roots of the unity (hence \\(\left|\lambda_{j}\right|=1\ \forall j\\)), the chain is _periodic_.
In particular, if the cycle is unique and has period \\(W\\), all eigenvalues will be of the type \\(\lambda_{j}=e^{in_{j}\frac{2\pi}{W}}\\), with \\(n_{j}\in\mathbb{N}\\) and \\(n_{j} < W\\).

In practice, to make sure that the chain is ergodic, we
1. need to solve the _characteristic equation_ to find all the eigenvalues
$$
\det\left(\bm{P}-\lambda\bm{I}\right)=0
$$
1. check that \\(\lambda_{1}=1\\) has multiplicity 1 (or identify irreducible subchains otherwise)
1. check that 
$$
\lambda_{j}\neq1\quad\Rightarrow\quad\left|\lambda_{j}\right|<1
$$

Here is the __R__ code suitable for the eigenvalue analysis of any transition matrix
```r
# To get 'left' eigenvectors you need to transpose the matrix beforehand!
Eigen <- eigen(t(TM_depol), symmetric = FALSE)
# Eigenvalues
Eigen$values
# Modulus check
abs(Eigen$values)
# Eigenvectors (arranged by columns)
Eigen$vectors
# Stationary state (to be normalized)
v1 <- Eigen$vectors[,1]
v1/sum(v1)
```
As a final remark, note that calculating the steady state distribution of a Markov chain by eigendecomposition of the transition probability matrix \\(\bm{P}\\) when the number of states is large (or infinite) may be difficult (or impossible).
In these cases, approximate methods for calculating \\(\bm{\hat{\pi}}\\) can still be used.
However, consider that when using Markov chains to model ion channels the number of states will never be computationally prohibitive and, well, it is almost certain that your system will be ergodic. 😅
