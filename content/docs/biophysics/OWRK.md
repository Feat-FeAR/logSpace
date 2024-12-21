---
title: "Surface Energy by OWRK"
weight: 300
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Surface Free Energy - The OWRK method

## Wettability and contact angle
Wettability of surfaces by liquids is a measure of their hydrophilicity, making
it a quantity of great interest in a number of fields ranging from engineering
to biophysics, chemistry, bio(techno)logy, and medicine. Wettability can be
quantified by the so-called _contact angle_ {{< katex >}}\theta{{< /katex >}}
via the _Young equation_ applied to a sessile drop of liquid on a surface:
$$
\gamma_{\scriptscriptstyle{SG}}-\gamma_{\scriptscriptstyle{SL}}-\gamma_{\scriptscriptstyle{LG}}\cos\theta=0
$$
<div style="text-align: center;">
<br>
{{< figure src="/images/drop.png" title="sessile drop of liquid to define quantities in Young equation" width=450 >}}
</div>

where
- \\(\gamma_{\scriptscriptstyle{SG}}\\) is the solid--vapor (or gas) interfacial
	energy (aka _surface free energy_);
- \\(\gamma_{\scriptscriptstyle{SL}}\\) is the solid--liquid interfacial energy;
- \\(\gamma_{\scriptscriptstyle{LG}}\\) is the liquid--vapor (or gas)
	interfacial energy (aka the _liquid surface tension_);
- \\(\theta\\) is the _contact angle_, defined as the angle between the surface
	tangent on the liquid--vapor interface and the tangent on the
	solid--liquid interface at their intersection.

A contact angle of 0° and 180° correspond to complete wetting and non-wetting
respectively. Surfaces exhibiting contact angles with water below 90° are called
_hydrophilic_ and those above 90° are called _hydrophobic_.

## Surface free energy and roughness
When designing and fabricating new materials, one is often interested in
controlling the hydrophobicity properties of their surfaces, that is, acting on
\\(\gamma_{\scriptscriptstyle{SG}}\\), the term in Young equation that
represents the surface free energy.

_Surface energy_ (or _surface free energy_) quantifies the disruption of
intermolecular bonds that occurs when a surface is created. It may therefore be
defined as the _excess energy_ at the surface of a material compared to the
bulk as a result of the incomplete, unrealized bonding. It is equivalent to the
work required to build an area of a particular surface, or to cut a bulk sample,
creating two surfaces.

Cutting a solid body into pieces disrupts its bonds and increases the surface
area, and therefore increases surface energy. In general, as surface energy
increases, the contact angle decreases because more of the liquid is being
"grabbed" by the surface. Conversely, as surface energy decreases, the contact
angle increases, because the surface doesn't want to interact with the liquid.

For the same reason, surface roughness usually has a strong effect on the
contact angle and wettability of a surface. More specifically, the effect of
roughness depends on if the droplet will wet the surface grooves or if air
pockets will be left between the droplet and the surface. If the surface is
wetted homogeneously, the droplet is in _Wenzel state_ and adding surface
roughness will enhance the wettability caused by the chemistry of the surface. 

## The OWRK method
There are several different models for calculating the surface free energy based
on the contact angle readings. The most commonly used method is the Owens,
Wendt, Rabel and Kaelble (OWRK) method, which based on a two-component model to
separate the interfacial tension according to the underlying interactions
between the molecules. These interactions are defined as _polar_ (\\(P\\)) and
_dispersive_ (\\(D\\)) interactions, and the total surface energy, both for a
solid and a liquid, is the sum of the two parts.
{{< katex display >}}
\left\{
\begin{aligned}
\gamma_{\scriptscriptstyle{SG}}=\gamma_{\scriptscriptstyle{SG}}^{\scriptscriptstyle{P}}+\gamma_{\scriptscriptstyle{SG}}^{\scriptscriptstyle{D}}\\
\gamma_{\scriptscriptstyle{LG}}=\gamma_{\scriptscriptstyle{LG}}^{\scriptscriptstyle{P}}+\gamma_{\scriptscriptstyle{LG}}^{\scriptscriptstyle{D}}
\end{aligned}
\right.
{{< /katex >}}
The polar interactions arise due to the permanent dipole--permanent dipole
interactions (or Keesom forces). They are stronger and only exist in polar
molecules. Dispersive component (also known as London forces) are weak and arise
due to random fluctuations in the electron density in an electron cloud and
hence lead to temporary/induced dipole interactions.

As for the solid-liquid interfacial energy
(\\(\gamma_{\scriptscriptstyle{SL}}\\)), the OWRK method resorts to Good's
equation, for which
$$
\gamma_{\scriptscriptstyle{SL}}=\gamma_{\scriptscriptstyle{SG}}+\gamma_{\scriptscriptstyle{LG}}-2\left(\sqrt{\gamma_{\scriptscriptstyle{SG}}^{\scriptscriptstyle{P}}\gamma_{\scriptscriptstyle{LG}}^{\scriptscriptstyle{P}}}+\sqrt{\gamma_{\scriptscriptstyle{SG}}^{\scriptscriptstyle{D}}\gamma_{\scriptscriptstyle{LG}}^{\scriptscriptstyle{D}}}\right)
$$
Combining Young and Good's equations to eliminate the
\\(\gamma_{\scriptscriptstyle{SL}}\\) term, and renaming
\\(\gamma_{\scriptscriptstyle{LG}}\equiv\gamma_{\scriptscriptstyle{L}}\\) and
\\(\gamma_{\scriptscriptstyle{SG}}\equiv\gamma_{\scriptscriptstyle{S}}\\) for
ease of notation, we get the following relation:
$$
\frac{\gamma_{\scriptscriptstyle{L}}\left(1+\cos\theta\right)}{2\sqrt{\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{D}}}}=\sqrt{\gamma_{\scriptscriptstyle{S}}^{\scriptscriptstyle{P}}}\sqrt{\frac{\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{P}}}{\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{D}}}}+\sqrt{\gamma_{\scriptscriptstyle{S}}^{\scriptscriptstyle{D}}}
$$
If the surface tension of the liquid is known in both its components
\\(\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{P}}\\) and
\\(\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{D}}\\), the above equation
is a linear equation of the form \\(y=mx+q\\) in which \\(x\\) is known as well,
while \\(y\\) can be drawn by contact angle measurement.
{{< katex display >}}
\left\{
\begin{aligned}
x & = \sqrt{{}^{\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{P}}}{\mskip -5mu/\mskip -3mu}_{\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{D}}}}\\
y & =\frac{\gamma_{\scriptscriptstyle{L}}\left(1+\cos\theta\right)}{2\sqrt{\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{D}}}}
\end{aligned}
\right.
{{< /katex >}}
In OWRK method, __the contact angle of the surface is measured with several (at
least two) liquids__ so that the slope and vertical intercept of the line can be
estimated to calculate the polar and dispersive components of the surface free
energy, respectively.
{{< katex display >}}
\left\{
\begin{aligned}
\gamma_{\scriptscriptstyle{S}}^{\scriptscriptstyle{P}} & =m^2\\
\gamma_{\scriptscriptstyle{S}}^{\scriptscriptstyle{D}} & =q^2
\end{aligned}
\right.
{{< /katex >}}

To get properly spaced points on the plane, (at least) two liquids with markedly
different surface tension properties are usually used, namely water and
diiodomethane (aka _methylene iodide_, MI), with the following reference values:

| Solvent |\\(\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{P}}\\) (mN/m)<sup>1</sup>|\\(\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{D}}\\) (mN/m)|\\(\gamma_{\scriptscriptstyle{L}}\\) (mN/m)|\\(x\\)|
|:-------------------:|:-----:|:-----:|:-----:|:----:|
| __Water__           | 43.70 | 29.10 | 72.80 | 1.23 |
| __Diiodomethane__   |  2.60 | 47.40 | 50.00 | 0.23 |
| __Ethylene Glycol__ | 21.30 | 26.40 | 47.70 | 0.81 |

<p style="font-size:12px;">
	<sup>1</sup> The surface energy is usually measured in units of joules per
	square meter (J/m<sup>2</sup>), which is equivalent in the case of liquids
	to surface tension, usually measured in newtons per meter (N/m).
</p>

In summary, for each surface \\(S\\) subjected to surface free energy
measurement by sessile drop technique, a regression line of this type needs to
be calculated:
<div style="text-align: center;">
{{< figure src="/images/surface_energy.png" title="OWRK method for SFE estimation" width=720 >}}
</div>

## Uncertainty estimation
Typically, the surface tension values of the probe liquids used in the sessile
drop test are known in the literature with such a precision that they can be
assumed as without any uncertainty. Therefore, the x-values in the graph above
are also assumed to be error-free. In contrast, the empirical measurements of
contact angles usually come with an uncertainty \\(s_\theta\\) resulting from
the stochastic fluctuations of the angle through its multiple measurements.
Overall, this makes simple linear regression by ordinary least squares (OLS)
minimization a suitable tool for analyzing this type of data.

If \\(\theta\\) is the mean contact angle from \\(n\\) measurements, then its
uncertainty \\(s_\theta\\) can be estimated by the standard error of the mean
(SEM), which is the standard deviation of the sample divided by \\(\sqrt{n}\\).
This uncertainty propagates to the \\(y\\) variable according to the usual rule:
$$
s_y=\sqrt{\left[\frac{d}{d\theta}\frac{\gamma_{\scriptscriptstyle{L}}\left(1+\cos\theta\right)}{2\sqrt{\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{D}}}}\right]^{2}s_{\theta}^{2}}=\frac{\gamma_{\scriptscriptstyle{L}}\sin\theta}{2\sqrt{\gamma_{\scriptscriptstyle{L}}^{\scriptscriptstyle{D}}}}\ s_{\theta}\qquad\textrm{with}\quad\theta\in\left[0,\pi\right]
$$
{{< hint danger >}}
It is extremely important here to make sure that all the angles are expressed in
__radians__, with special attention to the value of \\(s_\theta\\) !!
{{< /hint >}}

Although this is always true, the way in which to handle the uncertainty and
propagate it on the surface energy changes depending on the number \\(k\\) of
probe liquids used.

### Three or more probe liquids
If each surface was tested with at least three probe liquids (\\(k\geq3\\)), the
OLS method provides estimates for slope and intercept accompanied by their
standard errors, which are derived from the computed sum of squared residuals
\\(\sum_{i=1}^{k}\varepsilon_{i}^{2}\\), where \\(\varepsilon_i\\) are the
differences between actual and predicted values of the dependent variable
\\(y\\).
{{< katex display >}}
\left\{
\begin{aligned}
m & =\frac{\sum_{i=1}^{k}\left(x_{i}-\bar{x}\right)\left(y_{i}-\bar{y}\right)}{\sum_{i=1}^{k}\left(x_{i}-\bar{x}\right)^2}\\
\\
q & =\bar{y}-m\,\bar{x}
\end{aligned}
\right.\quad\Longrightarrow\quad
\left\{
\begin{aligned}
s_m & =\sqrt{\frac{\frac{1}{k-2}\sum_{i=1}^{k}\varepsilon_{i}^{2}}{\sum_{i=1}^{k}\left(x_{i}-\bar{x}\right)^{2}}}\\
\\
s_q & =s_m\sqrt{\frac{1}{k}\sum_{i=1}^{k}x_{i}^{2}}
\end{aligned}
\right.
{{< /katex >}}

Notably, the calculation of this error term "automatically" accounts for the
uncertainty \\(s_y\\) of each single point, since uncertainty on y-values
directly reflects on their scattering about the line. In other words, even
assuming a perfectly linear underlying relation, the more the points are
individually affected by uncertainty, the less likely they are to occur aligned.
Therefore, the regression can be conducted on the basis of the mean y-values
alone, without even the need to propagate the error from \\(\theta\\) on
\\(y\\). Just consider the use of weighted least squares (WSL) in case of
manifest heteroscedasticity.

### Two probe liquids
When only \\(k=2\\) probe liquids are used, \\(s_{y}\\) is the only information
we have about uncertainty, since the interpolation of two points by a line is
always exact. In that case it is necessary to "manually" propagate the
uncertainty on the slope and intercept estimators. With just two experimental
points (e.g., water and diiodomethane), instead of starting from the general
formulas for OLS linear regression, we can use these simpler relations:
{{< katex display >}}
\left\{
\begin{aligned}
m & =\frac{y_{\scriptscriptstyle{H_{2}O}}-y_{\scriptscriptstyle{MI}}}{x_{\scriptscriptstyle{H_{2}O}}-x_{\scriptscriptstyle{MI}}}\\
q & =y_{i}-m\,x_{i}
\end{aligned}
\right.\quad\Longrightarrow\quad
\left\{
\begin{aligned}
s_m & =\frac{1}{\left|x_{\scriptscriptstyle{H_{2}O}}-x_{\scriptscriptstyle{MI}}\right|}\sqrt{s_{y\scriptscriptstyle{H_{2}O}}^2+s_{y\scriptscriptstyle{MI}}^2}\\
s_q & =x_{i}\ s_m
\end{aligned}
\right.
{{< /katex >}}
where possible correlations between \\(y_{\scriptscriptstyle{H_{2}O}}\\) and
\\(y_{\scriptscriptstyle{MI}}\\) have been neglected (assumption of independent
variables), and \\(i\\) is either \\(\scriptscriptstyle{H_{2}O}\\) or
\\(\scriptscriptstyle{MI}\\). Actually, \\(\left(x_i,y_i\right)\\) can be _any_
point of the line, including, for instance, \\(\left(\bar{x},\bar{y}\right)\\).
Also, note how incidentally
\\(x_{\scriptscriptstyle{H_{2}O}}-x_{\scriptscriptstyle{MI}}\simeq1\\), which
makes it even easier to quickly estimate the surface free energy!

Of course, in both the cases,
{{< katex display >}}
\left\{
\begin{aligned}
s_{\gamma\scriptscriptstyle{P}} & =2m\,s_m\\
s_{\gamma\scriptscriptstyle{D}} & =2q\,s_q
\end{aligned}
\right.\quad\Longrightarrow\quad
s_{\gamma}=2\sqrt{m^{2}\,s_{m}^{2}+q^{2}\,s_{q}^{2}}
{{< /katex >}}

## Hydrophobic surfaces
For some of the more hydrophobic surfaces, the slope of the fitted line can even
return negative values, meaning that the surface is so hydrophobic that only the
dispersive component is actually relevant to the surface energy calculation. In
these cases, a slope of zero is usually assumed
$$
\gamma_{\scriptscriptstyle{S}}^{\scriptscriptstyle{P}}\simeq0\quad\Longrightarrow\quad\gamma_{\scriptscriptstyle{S}}\simeq\gamma_{\scriptscriptstyle{S}}^{\scriptscriptstyle{D}}
$$
and a horizontal line is fitted instead:
$$
q=\frac{y_{\scriptscriptstyle{H_{2}O}}+y_{\scriptscriptstyle{MI}}}{2}\quad\Longrightarrow\quad s_q=\frac{1}{2}\sqrt{s_{y\scriptscriptstyle{H_{2}O}}^2+s_{y\scriptscriptstyle{MI}}^2}
$$

## References
### Wiki-Links
- [Wettability](https://en.wikipedia.org/wiki/Wetting)
- [Contact angle](https://en.wikipedia.org/wiki/Contact_angle)
- [The lotus effect](https://en.wikipedia.org/wiki/Lotus_effect)
- [Petal effect _vs_ lotus effect](https://en.wikipedia.org/wiki/Wetting#%22Petal_effect%22_vs._%22lotus_effect%22)
- [Surface energy](https://en.wikipedia.org/wiki/Surface_energy)
- [Sessile drop technique](https://en.wikipedia.org/wiki/Sessile_drop_technique)
- [Simple linear regression](https://en.wikipedia.org/wiki/Simple_linear_regression)

### Research Papers
1. Annamalai M, Gopinadhan K, Han SA, Saha S, Park HJ, Cho EB, Kumar B, Patra A,
	Kim SW, Venkatesan T. _Surface energy and wettability of van der Waals
	structures_. __Nanoscale__. 2016 Mar 14;8(10):5764-70.
	DOI: 10.1039/c5nr06705g. PMID: 26910437.

1. Waldner C, Hirn U. _Modeling liquid penetration into porous materials based on
	substrate and liquid surface energies_. __J Colloid Interface Sci__. 2023
	Jun 15;640:445-455. DOI: 10.1016/j.jcis.2023.02.116. Epub 2023 Feb 28. PMID:
	36870220.

1. Mussano F, Genova T, Laurenti M, Zicola E, Munaron L, Rivolo P, Mandracci P,
	Carossa S. _Early Response of Fibroblasts and Epithelial Cells to
	Pink-Shaded Anodized Dental Implant Abutments: An In Vitro Study_. __Int J
	Oral Maxillofac Implants__. 2018 May/Jun;33(3):571-579. DOI:
	10.11607/jomi.6479. PMID: 29763495.
