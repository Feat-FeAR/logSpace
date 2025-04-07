---
title: "Recipes"
weight: 10
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
customcss: "css/recipe-selector.css"
---

# Recipe book of physiological solutions
## Select a Recipe
{{< recipe-selector >}}

## Table of Values
{{< show-mw >}}

## Calculation Notes
### Masses
{{< katex >}}{{< /katex >}}
Ingredient masses are calculated dynamically as
$$
m{\scriptscriptstyle\left(g\right)}=C{\scriptscriptstyle\left(mM\right)}\cdot MW{\scriptscriptstyle\left(g/mol\right)}\cdot V{\scriptscriptstyle\left(mL\right)}\cdot 10^{-6}{\scriptscriptstyle\left(g/\mu g\right)}
$$
based on the molar concentrations \\(C\\) provided in the recipe, the final volume \\(V\\) selected by the user, and the molecular weights \\(MW\\) reported in the table above.
{{< hint warning >}}
__Always check your hydration level!__  
Different molecular weights can be found on the market for the same commercial substance, depending on its level of hydration.
So, before applying the recipe _verbatim_, always check the specifications of your chemicals!
{{< /hint >}}

### Osmolarity
Solution osmolarity---i.e., the concentration of the _osmotically active solute particles_ in the solution---is dynamically estimated in two ways.
The _ideal osmolarity_ is simply calculated as
{{< katex display >}}
O_{\text{ideal}}=\sum_k C_{_{k}}\,n_{_{k}}
{{< /katex >}}
where {{< katex >}}C_{_{k}}{{< /katex >}} is the molar concentration of the \\(k\\)-th ingredient, while {{< katex >}}n_{_{k}}{{< /katex >}} (in \\(Osm/mol\\)) is the number of particles into which the \\(k\\)-th solute molecule dissociates, assuming 100% dissociation (_strong electrolyte_ hypothesis) and no electrostatic interaction among dissociated ions.

In fact, even assuming complete dissociation for all solutes in the solution, _ion pairing_ and _ion shielding_ occur to some extent in all real electrolyte solutions, causing the _effective_ \\(n\\) to be smaller than expected.
To account for the degree of non-ideality of the solution, the _osmotic coefficients_ {{< katex >}}\varphi_{_{k}}{{< /katex >}} are introduced in the estimation of the _real osmolarity_:
{{< katex display >}}
O_{\text{real}}=\sum_k C_{_{k}}\,n_{_{k}}\,\varphi_{_{k}}
{{< /katex >}}
Unfortunately---being related to the statistical probability that some cations and anions of a dissolved electrolyte re-associate temporarily at a given time---the values of the osmotic coefficients vary with the temperature, concentration, and nature of the solute.
\\(\varphi\\) values in the table above are given for each solute at the physiological concentrations at which they are found in the extracellular fluids of mammals, at 37 °C, as generally agreed upon in the literature, however...
{{< hint warning >}}
__Experimental osmolarity__  
Osmotic coefficients must be taken with caution because in practice it is quite impossible to determine \\(\varphi_{_k}\\) for each individual solute \\(k\\) within a composite solution---like the ones in our recipe book.
So, please, always remember that __the only effective way to measure the _real_ osmolarity of a solution is by using an osmometer.__
{{< /hint >}}

{{< hint warning >}}
__The EGTA approximation__  
In either way of calculating osmolarity, the chelating effects of EGTA are only roughly quantified by setting \\(n\\) to zero, so that the osmotic effects of calcium sequestration and chelator addition offset each other.
This is strictly true only when every free calcium ion is bound by an EGTA molecule and no EGTA molecule remains free, however, given the typical low concentrations of both \\(\text{Ca}^{2+}\\) ions and EGTA, this _lump-sum_ usually does not introduce major errors.
{{< /hint >}}

On top of that, we should also consider the _degree of dissociation_ \\(\alpha\\), that is the fraction of the original solute molecules that have _actually_ dissociated.
Solutes exhibiting an \\(\alpha<1\\) are called _weak electrolytes_.
So, in general, for each mole of solute, only \\(\alpha\\) moles dissociate into \\(n\varphi\\) osmoles, while \\(1-\alpha\\) moles keep intact, eventually leading to
$$
i\equiv\alpha n\varphi+\left(1-\alpha\right) = 1+\alpha\left(n\varphi-1\right)\ \frac{\text{Osm}}{\text{mol}}
$$
This coefficient \\(i\\) is usually referred to as the _van't Hoff factor_, that is __the overall ratio between the actual concentration of particles produced when the substance is dissolved and the formal concentration that would be expected from its chemical formula__.
Van't Hoff factors---albeit with all the limitations and estimation difficulties already discussed for the osmotic coefficients---allow for a more general calculation of the _real osmolarity_
{{< katex display >}}
O_{\text{real}}=\sum_k i_{_{k}}\,C_{_{k}}
{{< /katex >}}
Notably, for all the ingredients in our recipes of electrophysiological interest, it is quite reasonable to assume complete dissociation (\\(\alpha=1 \Rightarrow i=n\varphi\\)), thus making the two expressions for \\(O_{\text{real}}\\) essentially the same.

## References
### General
- [Osmotic Concentration - Wiki](https://en.wikipedia.org/wiki/Osmotic_concentration)
- [Van 't Hoff factor - Wiki](https://en.wikipedia.org/wiki/Van_%27t_Hoff_factor)
- [Saline - Wiki](https://en.wikipedia.org/wiki/Saline_(medicine))
- Joseph Feher (2012) Quantitative Human Physiology - Chapter 2.7 - Osmosis and Osmotic Pressure, _Academic Press_. pp.141-152, ISBN: 9780123821638, [DOI: B978-0-12-382163-8.00017-7](https://doi.org/10.1016/B978-0-12-382163-8.00017-7).

### \\(\varphi_{_{k}}\\) values
- _For a comprehensive list of osmotic coefficients of physiological solutes:_  
[UBC - Department of Zoology](https://www.zoology.ubc.ca/~biomania/tutorial/osmosis/fr01.htm).
- _For an experimental measure of the osmotic coefficient of NaAsp, as a proxy for KAsp:_  
Elena N. Tsurko _et al._ (2009) Activity of water, osmotic and activity coefficients of sodium glutamate and sodium aspartate in aqueous solutions at 310.15 K. _Acta Chimica Slovenica_ 56 (1), pp. 58-64.

NOTE: No primary source was found for the osmotic coefficient of Na<sub>2</sub>ATP, whose  estimate (\\(\varphi=0.90\\)) was taken from fragmentary online sources... however, given the low usage concentration of the compound, possible inaccuracies should have little impact.
