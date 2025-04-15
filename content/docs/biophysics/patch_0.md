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
A _first order resistor–capacitor circuit_ (__RC circuit__) is an electric circuit composed of one resistor and one capacitor, that is the simplest type of RC circuit.

Series configurations are by far the most studied, as they constitute _high-pass_ and _low-pass_ filters capable of acting on a _voltage input_.
By contrast, the parallel RC circuit is generally of less interest because the output voltage is equal to the input voltage and the circuit acts as a filter on a _current input_ instead of a voltage input.
Nevertheless, analyzing the parallel RC circuit turns out to be very useful for the quantitative understanding of the current signals observed in the different voltage clamp configurations.
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
However, in the case of a piecewise function---like the voltage step---things are considerably simplified, since we can solve our equation in each interval where the function is continuous to obtain local solutions that are valid within the corresponding domains.
So, let us assume that our voltage input is
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
is the _Heaviside step function_.

Then, for \\(t<0\\), the equation becomes homogeneous, admitting the trivial solution \\(v_p\\!\left(t\right)=0\\) (and therefore \\(i\\!\left(t\right)=\frac{v-v_p}{R_0}=0\\)).

Whereas, for \\(t\ge 0\\), the step function switches to \\(v\\!\left(t\right)=V\\), so that the equation becomes
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
To determine the constant of integration \\(k\\), we need to impose the initial condition that the capacitor is uncharged at \\(t=0\\) (although at that point the input voltage is already equal to \\(V\\), in the very first instants the capacitor acts as a short circuit and the entire voltage drop occurs across {{< katex >}}R_{_{0}}{{< /katex >}}) :
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
Based on this, we can compute the resistive and capacitive current components, as well as the total current \\(i\\) flowing in the main branch of the circuit, by using Kirchhoff's current law again.
E.g.:
{{< katex display >}}
\begin{aligned}
i{_{_R}} 	& = \frac{v_p}{R} = \frac{V}{R+R_{_{0}}}\left(1-e^{-t/\tau}\right) \\
i{_{_C}}	& = C\,\frac{dv_p}{dt} = CV\,\frac{R_{eq}}{R_{_{0}}}\,\frac{1}{\tau}\,e^{-t/\tau} = \frac{V}{R_{_{0}}}\,e^{-t/\tau} \\
i\ \ 		& = i{_{_R}} + i{_{_C}} = \frac{V}{R+R_{_{0}}}\left(1-e^{-t/\tau}+\frac{R+R_{_{0}}}{R_{_{0}}}\,e^{-t/\tau}\right)
\end{aligned}
{{< /katex >}}
yielding the following final form for \\(i\\):
{{< katex display >}}
\boxed{i\!\left(t\right)=\frac{V}{R+R_{_{0}}}\left(1+\frac{R}{R_{_{0}}}\,e^{-t/\tau}\right)}
{{< /katex >}}

### Comments
- At time \\(t=0\\), the voltage imposed by the generator instantaneously jumps from \\(0\\) to \\(V\\).
At that moment, the capacitor is uncharged and the capacitive branch behaves like a short-circuit, absorbing all the current of the parallel path.
Accordingly, when evaluated at \\(t=0\\), voltage and current functions return \\(v_p=0\\) and {{< katex >}}i=V/R_{_{0}}{{< /katex >}}, respectively.
In other words, the entire system is reduced to a circuit consisting of only the internal resistor \\(R_{_{0}}\\).
- As the capacitor charges, its impedance rapidly increases, causing the voltage across the parallel elements to increase and the total current to decrease, both as exponentials with time constant \\(\tau=R_{eq}C\\).
As a consequence of this, the current is progressively deviated towards the resistive branch.
- For \\(t\rightarrow\infty\\), the system approaches a steady state in which the capacitor is fully charged, meaning that it behaves like an open branch (infinite impedance).
In this configuration the current flows only in the resistive branch (\\(i\\!=\\!\frac{V}{R+R_{0}}\\)), generating a potential drop across the parallel elements equal to \\(v_p\\!=\\!V\\!\frac{R}{R+R_{0}}\\), as expected from the Ohm's law when applied to a simple voltage divider.

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

### Comments
- This expression for \\(i\\!\left(t\right)\\) is valid over the entire time domain and it also correctly represents the current transient due to the discontinuity of the input voltage step.
- The effect of such a discontinuity is a current of infinite intensity at time \\(t=0\\) (represented by the Dirac delta) that instantly charges the capacitor completely (\\(Q=CV\\)).
- Apart from this initial capacitive transient of infinite current, upon the onset of the voltage step, \\(v_p\\) stabilizes instantly at \\(V\\), while the current assumes the constant value \\(V/R\\).
- The same results can be derived as limiting cases of those obtained for the real voltage generator, when
{{< katex display >}}
R_{_{0}} \rightarrow 0 \quad\Rightarrow\quad R_{eq} \rightarrow 0 \quad\Rightarrow\quad \tau \rightarrow 0
{{< /katex >}}
i.e., in the case of _extremely small time constants_ \\(\tau\\) leading to _extremely rapid capacitive transients_.
For the current expression, just remember that a decaying exponential function can serve as a _nascent delta function_ (on the positive real line):
$$
\lim_{\tau\rightarrow 0^{+}} \frac{1}{\tau}\\,e^{-t/\tau} = \delta\\!\left(t\right)\quad\quad t\ge 0
$$

## Interactive plot
{{< RC-plotter >}}

## Ideal current generator
In the case where the RC parallel circuit is connected to a _current generator_ instead of a voltage generator, the previous equation
{{< katex display >}}
i\!\left(t\right) = \frac{v_p}{R}+C\,\frac{dv_p}{dt}
{{< /katex >}}
holds true, with the difference that now the known term is the current
{{< katex display >}}
i\!\left(t\right)=I\,\theta\!\left(t\right)
{{< /katex >}}
and the unknown is the voltage drop \\(v_p\\) across the parallel circuit (which is equal to the voltage rise \\(v\\) across the current generator, needed to produce the desired current \\(i\\)).

As previously shown, the general solution to such an ODE is
{{< katex display >}}
v_p\!\left(t\right)=k\,e^{-t/\tau}+\bar{v}_{p}
{{< /katex >}}
where now the time constant is \\(\tau=RC\\).
Focusing on the non-trivial domain \\(t>0\\), the particular solution of the inhomogeneous equation can be determined by analyzing the steady state at \\(t\rightarrow\infty \Rightarrow \frac{dv_p}{dt}=0\\):
{{< katex display >}}
\bar{v}_{p}=RI
{{< /katex >}}
while the constant of integration \\(k\\) is then obtained by imposing the initial condition that at time \\(t=0\\) the voltage across the parallel is zero (i.e., the capacitor is still discharged):
{{< katex display >}}
k=-RI
{{< /katex >}}
Overall, this leads to the following final form for the voltage across the parallel
{{< katex display >}}
\boxed{v_p\!\left(t\right)=RI\left(1-e^{-t/\tau}\right)}
{{< /katex >}}
For the resistive and capacitive current components we can instead write the two following expressions:
{{< katex display >}}
\begin{aligned}
i{_{_R}} 	& = \frac{v_p}{R} = I\left(1-e^{-t/\tau}\right) \\
i{_{_C}}	& = C\,\frac{dv_p}{dt} = CRI\,\frac{1}{\tau}\,e^{-t/\tau} = I\,e^{-t/\tau}
\end{aligned}
{{< /katex >}}
which add to \\(I\ \forall t\\), as expected.

### Comments
- In this case, there are no extreme capacitive transients, neither in terms of current (whose flow is controlled by the ideal generator) nor in terms of voltage at the capacitor terminals (which charges progressively at the pace set by the generator).
- For large time constants \\(\tau=RC\\), the current flowing in the resistive branch (as well as the voltage \\(v_p\\) across the whole parallel) is the _integral_ of the input signal: \\(\left(1-e^{-t/\tau}\right)\sim t/\tau\\).
- For small time constants \\(\tau=RC\\), the current flowing in the capacitive branch is the _derivative_ of the input signal: \\(e^{-t/\tau}\sim\tau\\,\delta\\!\left(t\right)\\).
- By contrast, when \\(\tau\\) is large, the current in the capacitive branch is identical to the input current, but with the DC component still removed (capacitive decoupling).

### Frequency filtering
As mentioned at the beginning of the chapter, in AC systems, the parallel RC circuit acts as a _frequency filter on a current input_ in the same way in which a series RC circuit acts on a voltage input.
This can be conveniently shown by means of _phasors_ (i.e., the _symbolic method_ for steady-state sinusoidal analysis).

{{< hint info >}}
__Complex notation__  
Any generic voltage or current quantity sinusoidally oscillating over time

$$
x\\!\left(t\right)=X\cos(\omega t + \theta)
$$

can be turned into a complex number by adding an imaginary term (let \\(j\\) be the imaginary unit):

$$
\bar{X}=X\left[\cos(\omega t+\theta)+j\sin(\omega t+\theta)\right]=X\\,e^{j(\omega t+\theta)}=X\\,e^{j\theta}e^{j\omega t}
$$

Although these complex quantities clearly represent signals that vary over time, their amplitude \\(X\\) and initial phase \\(\theta\\) are assumed to be time-invariant.
For this reason, they are always denoted by capital letters and a bar is used to distinguish the overall complex quantity from its modulus.
However, since the angular frequency \\(\omega\\) is always fixed, phasors offer a more compact and lightweight notation:

$$
\bar{X}=X\angle\theta
$$
{{< /hint >}}

The complex impedance of the parallel elements is
$$
\bar{Z}=\left(\frac{1}{R}+j\omega C\right)^{-1}=\frac{R}{1+j\omega RC}
$$
which enables us using Ohm’s Law in phasor domain:
{{< katex display >}}
\bar{V}_{p}=\bar{Z}\cdot\bar{I}_{i}
{{< /katex >}}

- For the resistive branch we get the following current output
{{< katex display >}}
\bar{I}_{_{R}}=\frac{1}{R}\bar{V}_{p}=\frac{\bar{I}_{i}}{1+j\omega RC}
{{< /katex >}}
and the following _transfer function_
{{< katex display >}}
\bar{H}_{_{R}}\!\left(j\omega\right)=\frac{\bar{I}_{_{R}}}{\bar{I}_{i}}=\frac{1}{1+j\omega RC}=\frac{1}{1+j\frac{\omega}{\omega_{_{H}}}}
{{< /katex >}}
where the cutting (angular) frequency \\(\omega_{_{H}}=\frac{1}{RC}\\) has been introduced.
Modulus and angle can be drawn to describe the output signal in terms of gain and phase shift, respectively, as a function of the linear frequency {{< katex >}}\nu=\frac{\omega}{2\pi}{{< /katex >}}:
{{< katex display >}}
\frac{I_{_{R}}}{I_{i}}=\left|\bar{H}_{_{R}}\right|=\frac{1}{\sqrt{1+\left(\frac{\nu}{\nu_{_{H}}}\right)^{2}}}
{{< /katex >}}
{{< katex display >}}
\phi_{_{R}}=\arg\!\left(\bar{H}_{_{R}}\right)=-\arctan\!\left(\frac{\nu}{\nu_{_H}}\right)
{{< /katex >}}
which is the frequency response of a __low-pass filter__.
- For the capacitive branch we get the following current output
{{< katex display >}}
\bar{I}_{_{C}}=j\omega C\,\bar{V}_{p}=\frac{j\omega RC}{1+j\omega RC}\,\bar{I}_{i}
{{< /katex >}}
and the following transfer function
{{< katex display >}}
\bar{H}_{_{C}}\!\left(j\omega\right)=\frac{\bar{I}_{_{C}}}{\bar{I}_{i}}=\frac{j\omega RC}{1+j\omega RC}=\frac{1}{1-j\frac{\omega_{_{L}}}{\omega}}
{{< /katex >}}
In this case, gain and phase shift as a function of frequency \\(\nu\\) are given by
{{< katex display >}}
\frac{I_{_{C}}}{I_{i}}=\left|\bar{H}_{_{C}}\right|=\frac{1}{\sqrt{1+\left(\frac{\nu_{_{L}}}{\nu}\right)^{2}}}
{{< /katex >}}
{{< katex display >}}
\phi_{_{C}}=\arg\!\left(\bar{H}_{_{C}}\right)=\arctan\left(\frac{\nu_{_{L}}}{\nu}\right)
{{< /katex >}}
which is the frequency response of a __high-pass filter__.
