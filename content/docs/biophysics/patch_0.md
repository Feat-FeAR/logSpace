---
title: "The RC parallel"
weight: 10
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
customcss: "css/rc-plotter.css"
---

# Parallel RC circuit
A _first order resistor–capacitor circuit_ (__RC circuit__) is an electric circuit composed of one resistor and one capacitor and is the simplest type of RC circuit.

Series configurations are by far the most studied, as they constitute _high-pass_ and _low-pass_ filters capable of acting on a voltage input.
In contrast, the parallel RC circuit is generally of less interest because the output voltage is equal to the input voltage and the circuit acts as a filter on a _current input_ instead of a voltage input.
Nevertheless, an analysis of the parallel RC circuit is very useful for the quantitative understanding of the current signals observed in the different voltage clamp configurations.
{{< hint info >}}
__Case notation__  
The convention whereby capital letters represent constant values, while lowercase letters represent quantities that vary over time is adopted throughout the section.
{{< /hint >}}

## Real voltage generator
What follows is a general discussion of the current and voltage dynamics in a __parallel RC circuit in response to a voltage step from a real voltage generator__, meaning an ideal voltage source with an internal series resistance \\(R_{_{0}}\\), as shown in the figure below.

Let's start by applying the two Kirchhoff's laws to our circuit, without making any particular assumptions about the input signal \\(v\\):
{{< katex display >}}
\begin{cases}
	v\!\!\! & = & R{_{_0}}i + v_p \\
	i\!\!\! & = & i{_{_R}} + i{_{_C}}
\end{cases}
{{< /katex >}}
where
{{< katex display >}}
i{_{_R}}=\frac{v_p}{R} \quad\quad\text{and}\quad\quad i{_{_C}}=C\,\frac{dv_p}{dt}
{{< /katex >}}
Thus, by combining all together, we can write
{{< katex display >}}
\frac{v-v_p}{R_{_{0}}}=\frac{v_p}{R}+C\,\frac{dv_p}{dt}
{{< /katex >}}
that can be rearranged as
{{< katex display >}}
C\,\frac{dv_p}{dt}=\frac{v}{R_{_{0}}}-v_p\left(\frac{1}{R_{_{0}}}+\frac{1}{R}\right)
{{< /katex >}}
Now, for convenience, we define the _effective resistance_
{{< katex display >}}
\frac{1}{R_{eq}}=\frac{1}{R_{_{0}}}+\frac{1}{R} \quad\Rightarrow\quad R_{eq}=\frac{R_{_{0}}R}{R_{_{0}}+R}
{{< /katex >}}
so that the equation simplifies to
{{< katex display >}}
\boxed{\frac{dv_p}{dt}+\frac{v_p}{R_{eq}C}=\frac{v}{R_{_{0}}C}}
{{< /katex >}}
which is a _first-order inhomogeneous linear ODE in standard form_.

The previous equation is quite general, in that it describes the behavior of \\(v_p\\) over time in response to ___any___ input signal \\(v\\!\left(t\right)\\).
Depending on the form of the forcing function \\(v\\!\left(t\right)\\), solving this equation is a problem of varying complexity.
However, in the case of a piecewise function like the voltage step, things are considerably simplified.
Indeed, if we assume that our voltage input is
{{< katex display >}}
v\!\left(t\right)=V\,\theta\!\left(t\right)
{{< /katex >}}
where
{{< katex display >}}
\theta\!\left(t\right) :=
\begin{cases}
	1 & \ \text{if}\ \ t \geq 0 \\
	0 & \ \text{if}\ \ t < 0
\end{cases}
{{< /katex >}}
is the _Heaviside step function_, we can solve our equation in each interval where the function is continuous to obtain local solutions that are valid within the corresponding domains.

For \\(t<0\\), the equation becomes homogeneous, admitting the trivial solution \\(v_p\\!\left(t\right)=0\\) (and therefore \\(i\\!\left(t\right)=\frac{v-v_p}{R_0}=0\\)).

For \\(t\ge 0\\), the step function switches to \\(v\\!\left(t\right)=V\\), so the equation becomes
{{< katex display >}}
\frac{dv_p}{dt}+\frac{v_p}{R_{eq}C}=\frac{V}{R_{_{0}}C}
{{< /katex >}}

The associated homogeneous equation
$$
\frac{dv_p}{dt}+\frac{v_p}{R_{eq}C}=0
$$
can be integrated as
$$
\int\frac{1}{v_p}\\;dv_p=-\frac{1}{R_{eq}C}\int dt
$$
$$
\ln{v_p}=-\frac{1}{R_{eq}C}\\,t+k^\prime
$$
$$
v_p\\!\left(t\right)=k\\,e^{-t/\tau}
$$
where the \\(R_{eq}C\\) time constant has been rewritten as \\(\tau\\) in the last step.

To find the general solution of the inhomogeneous equation we now need to find one of its _particular solutions_ (\\(\bar{v}_p\\)), which can be conveniently done by considering the steady state at \\(t\rightarrow\infty\\), where \\(\frac{dv_p}{dt}=0\\) and therefore 
{{< katex display >}}
\bar{v}_p=V\,\frac{R_{eq}}{R_{_{0}}}
{{< /katex >}}
So, the general solution of the inhomogeneous equation is
{{< katex display >}}
v_p\!\left(t\right)=k\,e^{-t/\tau}+V\,\frac{R_{eq}}{R_{_{0}}}
{{< /katex >}}
which is actually a _family_ of functions.
To determine the constant of integration \\(k\\), we need to impose the initial condition that the capacitor is uncharged at \\(t=0\\) (although at that point the input voltage is already equal to \\(V\\), in the very first instants the capacitor acts as a short circuit and the entire voltage drop occurs across {{< katex >}}R_{_{0}}{{< /katex >}}).
{{< katex display >}}
v_p\!\left(0\right)=0
{{< /katex >}}
{{< katex display >}}
k+V\,\frac{R_{eq}}{R_{_{0}}}=0
{{< /katex >}}
{{< katex display >}}
k=-V\,\frac{R_{eq}}{R_{_{0}}}
{{< /katex >}}
Thus, the final solution describing the time course of the voltage drop across the parallel elements is
{{< katex display >}}
v_p\!\left(t\right)=V\,\frac{R_{eq}}{R_{_{0}}}\left(1-e^{-t/\tau}\right)
{{< /katex >}}
or, in terms of \\(R\\),
{{< katex display >}}
\boxed{v_p\!\left(t\right)=V\frac{R}{R+R_{_{0}}}\left(1-e^{-t/\tau}\right)}
{{< /katex >}}
Based on this, we can compute the total current \\(i\\) flowing in the main branch of the circuit using Kirchhoff's voltage law again:
{{< katex display >}}
\begin{aligned}
i 	& = \frac{V-v_p}{R_{_{0}}} \\
	& = \frac{V}{R_{_{0}}}-\frac{V}{R_{_{0}}}\frac{R}{R+R_{_{0}}}\left(1-e^{-t/\tau}\right) \\
	& = \frac{V}{R_{_{0}}}\left(1-\frac{R}{R+R_{_{0}}}+\frac{R}{R+R_{_{0}}}\;e^{-t/\tau}\right) \\
	& = \frac{V}{R_{_{0}}}\left(\frac{R_{_{0}}}{R+R_{_{0}}}+\frac{R}{R+R_{_{0}}}\;e^{-t/\tau}\right)
\end{aligned}
{{< /katex >}}
yielding the following final form for \\(i\\):
{{< katex display >}}
\boxed{i\!\left(t\right)=\frac{V}{R+R_{_{0}}}\left(1+\frac{R}{R_{_{0}}}\,e^{-t/\tau}\right)}
{{< /katex >}}

### Observations
- At time \\(t=0\\), the voltage imposed by the generator instantaneously jumps from \\(0\\) to \\(V\\).
At that moment, the capacitor is uncharged and the capacitive branch behaves like a short-circuit, absorbing all the current of the parallel path.
Accordingly, when evaluated at \\(t=0\\), voltage and current functions return \\(v_p=0\\) and {{< katex >}}i=V/R_{_{0}}{{< /katex >}}, respectively.
In other words, the entire system is reduced to a circuit consisting of only the internal resistor \\(R_{_{0}}\\).
- As the capacitor charges, its impedance rapidly increases, causing the voltage across the parallel elements to increase and the total current to decrease, both as exponentials with time constant \\(\tau=R_{eq}C\\).
As a consequence of this, the current is progressively deviated towards the resistive branch.
- For \\(t\rightarrow\infty\\), the system approaches a steady state in which the capacitor is fully charged and therefore behaves like an open branch (with infinite impedance).
In this configuration the current flows only in the resistive branch (\\(i\\!=\\!\frac{V}{R+R_{0}}\\)), generating a potential drop across the parallel branch equal to \\(v_p\\!=\\!V\\!\frac{R}{R+R_{0}}\\), as expected from the Ohm's law when applied to a simple voltage divider.

## Ideal voltage generator
Voltage generators are typically built trying to minimize internal resistance to resemble ideal ones as much as possible.
With respect to the previous discussion, when \\(R_{_{0}}\ll R\\) (i.e., the internal resistance can be neglected compared to the load), we have that the voltage \\(V\\) is imposed by the (ideal) generator __directly on the RC parallel circuit__:
{{< katex display >}}
v\!\left(t\right)=v_p\!\left(t\right)=V\,\theta\!\left(t\right)
{{< /katex >}}
So we can simply apply Kirchhoff's current law
{{< katex display >}}
i = i{_{_R}} + i{_{_C}} = \frac{v_p}{R}+C\,\frac{dv_p}{dt}
{{< /katex >}}
to get an explicit form for the total current:
{{< katex display >}}
\boxed{i\!\left(t\right)=\frac{V}{R}\,\theta\!\left(t\right) + CV\,\delta\!\left(t\right)}
{{< /katex >}}
where \\(\delta\\!\left(t\right)\\) is the Dirac delta function (with the inverse dimension of its argument).

### Observations
- This expression for \\(i\\!\left(t\right)\\) is valid over the entire time domain and it also correctly represents the current transient due to the discontinuity of the input voltage step.
- The effect of such a discontinuity is a current of infinite intensity at time \\(t=0\\) (represented by the Dirac delta) that instantly charges the capacitor completely (\\(Q=CV\\)).
- Apart from this initial capacitive transient of infinite current, upon the onset of the voltage step, \\(v_p\\) stabilizes instantly at \\(V\\), while the current assumes the constant value \\(V/R\\).
- The same results can be derived as limiting cases of those obtained for the real voltage generator, when
{{< katex display >}}
R_{_{0}} \rightarrow 0 \quad\Rightarrow\quad R_{eq} \rightarrow 0 \quad\Rightarrow\quad \tau \rightarrow 0
{{< /katex >}}
that is, in the case of _extremely small time constants_ \\(\tau\\) leading to _extremely rapid capacitive transients_.
For the current expression, just remember that a decaying exponential function can serve as a _nascent delta function_ (on the positive real line):
$$
\lim_{\tau\rightarrow 0^{+}} \frac{1}{\tau}\\,e^{-t/\tau} = \delta\\!\left(t\right)\quad\quad t\ge 0
$$

## Interactive plot
{{< RC-plotter >}}
