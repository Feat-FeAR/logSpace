---
title: "The RC parallel"
weight: 0
draft: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Parallel RC circuit
A _first order resistor–capacitor circuit_ (__RC circuit__) is an electric circuit composed of one resistor and one capacitor and is the simplest type of RC circuit.

Series configurations are by far the most studied, as they constitute high-pass and low-pass filters capable of acting on a voltage input.

In contrast, the parallel RC circuit is generally of less interest because the output voltage is equal to the input voltage and the circuit acts as a filter on a current input instead of a voltage input.

Nevertheless, an analysis of the parallel RC circuit is very useful for the quantitative understanding of the current signals observed in the different voltage clamp configurations.
{{< hint info >}}
__Notation__  
The convention for which upper case letters represent constant values, while lower case letters are time-variable quantities is adopted all through the section. 
{{< /hint >}}

## Real voltage generator
What follows is a general discussion of the current and voltage dynamics in a _parallel RC circuit_ in response to a step voltage from a real voltage generator, meaning an ideal voltage source with an internal series resistance \\(R_{_{0}}\\), as shown in the figure below.

Let's start by applying Kirchhoff’s laws to our circuit:
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
Now, for convenience, we define the effective resistance
{{< katex display >}}
\frac{1}{R_{eq}}=\frac{1}{R_{_{0}}}+\frac{1}{R} \quad\Rightarrow\quad R_{eq}=\frac{R_{_{0}}R}{R_{_{0}}+R}
{{< /katex >}}
so that the equation simplifies to
{{< katex display >}}
\frac{dv_p}{dt}+\frac{v_p}{R_{eq}C}=\frac{v}{R_{_{0}}C}
{{< /katex >}}
which is a _first-order inhomogeneous linear differential equation_ for \\(v_p\\) in standard form.
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
v_p\left(t\right)=k\\,e^{-t/\tau}
$$
where in the last step the \\(R_{eq}C\\) time constant has been rewritten as \\(\tau\\).

To find the general solution of the inhomogeneous equation we now need to find one of its particular solutions, which---depending on the form of \\(v\\!\left(t\right)\\)---is a problem of varying complexity.
However, in the case of a voltage step things are considerably simplified.
If we assume that our input voltage is
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
is the _Heaviside step function_ (aka the _unit step function_), for \\(t\ge 0\\) we get
{{< katex display >}}
\frac{dv_p}{dt}+\frac{v_p}{R_{eq}C}=\frac{V}{R_{_{0}}C}
{{< /katex >}}


Now, to find a particular integral of the inhomogeneous equation, consider the limit case \\(t\rightarrow\infty\\).
Since a voltage step is actually a constant input for \\(t \ge 0\\), the RC system eventually reaches a steady state such that \\(\frac{dv_p}{dt}=0\\), which implies 
{{< katex display >}}
v_p=V\,\frac{R_{eq}}{R_{_{0}}}
{{< /katex >}}
The general solution of the inhomogeneous equation is therefore
{{< katex display >}}
v_p\left(t\right)=k\,e^{-t/\tau}+V\,\frac{R_{eq}}{R_{_{0}}}
{{< /katex >}}
which is actually a _family_ of functions.
To determine the integration constant \\(k\\), we need to impose the initial condition that the capacitor is uncharged at \\(t=0\\).
{{< katex display >}}
v_p\left(0\right)=0
{{< /katex >}}
{{< katex display >}}
k+V\,\frac{R_{eq}}{R_{_{0}}}=0
{{< /katex >}}
{{< katex display >}}
k=-V\,\frac{R_{eq}}{R_{_{0}}}
{{< /katex >}}
Thus, the final solution describing the time course of the voltage drop across the parallel elements is
{{< katex display >}}
v_p\left(t\right)=V\,\frac{R_{eq}}{R_{_{0}}}\left(1-e^{-t/\tau}\right)
{{< /katex >}}
or, in terms of \\(R\\),
{{< katex display >}}
v_p\left(t\right)=V\frac{R}{R+R_{_{0}}}\left(1-e^{-t/\tau}\right)
{{< /katex >}}
Based on this, we can compute the total current \\(i\\) flowing using the Kirchhoff’s Voltage Law again:
{{< katex display >}}
\begin{aligned}
i 	& = \frac{V-v_p}{R_{_{0}}} \\
	& = \frac{V}{R_{_{0}}}-\frac{V}{R_{_{0}}}\frac{R}{R+R_{_{0}}}\left(1-e^{-t/\tau}\right) \\
	& = \frac{V}{R_{_{0}}}\left(1-\frac{R}{R+R_{_{0}}}+\frac{R}{R+R_{_{0}}}\;e^{-t/\tau}\right) \\
	& = \frac{V}{R_{_{0}}}\left(\frac{R_{_{0}}}{R+R_{_{0}}}+\frac{R}{R+R_{_{0}}}\;e^{-t/\tau}\right) \\
	& = \frac{V}{R+R_{_{0}}}\left(1+\frac{R}{R_{_{0}}}\,e^{-t/\tau}\right)
\end{aligned}
{{< /katex >}}
Thus, the final solution describing the time course of the total current flow in the main branch of the circuit is
{{< katex display >}}
i\left(t\right)=\frac{V}{R+R_{_{0}}}\left(1+\frac{R}{R_{_{0}}}\,e^{-t/\tau}\right)
{{< /katex >}}

## Considerations
- At time \\(t=0\\), the voltage imposed by the generator instantaneously jumps from \\(0\\) to \\(V\\).
At that moment, the capacitor is uncharged and the capacitive branch behaves like a short-circuit, absorbing all the current in the parallel path.
Accordingly, when evaluated at \\(t=0\\), voltage and current functions return \\(v_p=0\\) and {{< katex >}}i=V/R_{_{0}}{{< /katex >}}, respectively.
In other words, the entire system is reduced to a circuit consisting of a single resistor, which is the internal resistor \\(R_{_{0}}\\).
- As the capacitor charges, its impedance rapidly increases, causing the voltage across the parallel elements to increase and the total current to decrease, both as exponentials with time constant \\(\tau=R_{eq}C\\).
As a consequence of this, the current is progressively deviated towards the resistive branch.
- For \\(t\rightarrow\infty\\), the system approaches a steady state in which the capacitor is fully charged and therefore behaves like an open branch (with infinite impedance).
In this configuration the current flows only in the resistive branch (\\(i\\!=\\!\frac{V}{R+R_{0}}\\)), generating a potential drop across the parallel branch equal to \\(v_p\\!=\\!V\\!\frac{R}{R+R_{0}}\\), as expected from the Ohm's law when applied to a classic voltage divider.

## Ideal voltage generator
Voltage generators are typically built trying to minimize internal resistance to resemble ideal ones as much as possible.
With respect to the previous discussion, when the internal resistance \\(R_{_{0}}\\) can be neglected compared to the load resistance \\(R\\), we have that the voltage \\(V\\) is imposed by the (ideal) generator directly on the RC parallel circuit.
This makes the Kirchhoff’s voltage law quite uninformative (though current one holds unchanged).
In this case, we can take advantage of the analytical form of the voltage step:
{{< katex display >}}
v_p=V\,\theta\!\left(t\right)
{{< /katex >}}




{{< katex display >}}
R_{_{0}} \rightarrow 0 \quad\Rightarrow\quad
{{< /katex >}}


