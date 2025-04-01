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
{{< katex >}}{{< /katex >}}
Based on the molar concentration of the ingredients (\\(C\\)) and the final volume selected by the user (\\(V\\)), masses are calculated dynamically as
$$
m{\scriptscriptstyle\left(g\right)}=C{\scriptscriptstyle\left(mM\right)}\cdot MW{\scriptscriptstyle\left(g/mol\right)}\cdot V{\scriptscriptstyle\left(mL\right)}\cdot 10^{-6}{\scriptscriptstyle\left(g/\mu g\right)}
$$
using the molecular weight values (\\(MW\\)) reported above in the _Table of Values_.

Osmolarity---the concentration of _osmotically active solute particles_ in the solution---is carried out in two ways.
The _ideal osmolarity_ of the solution is calculated as 
{{< katex display >}}
O_{\text{ideal}}=\sum_k C_{_{k}}\,n_{_{k}}
{{< /katex >}}
where \\(C_{k}\\) is the molar concentration of the \\(k\\)-th ingredient, while \\(n_{k}\\) is the number of particles into which the \\(k\\)-th solute molecule dissociates assuming 100% dissociation (strong electrolyte hypothesis) and no electrostatic interaction among dissociated ions (_ion pairing_ or _ion shielding_ effects).

However, even assuming complete dissociation for all the solute in the solution, _ion pairing_ and _ion shielding_ occur to some extent in all ___real___ electrolyte solutions.
Thus, for real salts, electrostatic effects cause the _effective_ \\(n\\) to be smaller than 1 even if 100% dissociation occurs.
In the estimation of the _real osmolarity_, the osmotic coefficient \\(\varphi\\) is thus introduced for each solute to account for the degree of non-ideality of the solution.
{{< katex display >}}
O_{\text{real}}=\sum_k C_{_{k}}\,n_{_{k}}\,\varphi_{_{k}}
{{< /katex >}}
Unfortunately, the values of the osmotic coefficients vary with the temperature, concentration,
and nature of the solute, being related to the statistical probability that some cations and anions of a dissolved electrolyte re-associate temporarily at a given time.
Values for \\(\varphi\\) in the table above refer to saline solutions of physiological concentrations, for which there is general agreement in the literature, however...
{{< hint warning >}}
WARNING  
...in practice it is quite impossible to determine \\(\varphi_k\\) for each individual solute \\(k\\) within a solution that is made of many type of solutes, like the ones in our recipe book.
Therefore, to measure the ___real___ osmolarity, the only effective way it is usually using an osmometer.
{{< /hint >}}

{{< hint warning >}}
EGTA  
in both ways of calculating osmolarity, the possible chelating effects of EGTA are not roughly quantified by setting phi to zero, so that calcium sequestration and addition of the chelator offset each other. Given the typical low concentrations of the calcium ion and chelator, this flat rate does not usually introduce important errors.
{{< /hint >}}

In addition, we should also consider that the degree of dissociation \\(\alpha\\) is the fraction of the original solute molecules that have _actually dissociated_, and for _weak electrolytes_ this value is \\(<1\\).
In these cases, we can imagine that out of each mole of solute, \\(\alpha\\) moles dissociate, giving rise to \\(n\varphi\\) osmoles, while \\(1-\alpha\\) moles keep their molecules intact, eventually leading to
$$
i\equiv\alpha n\varphi+\left(1-\alpha\right) = 1+\alpha\left(n\varphi-1\right)\ \frac{\text{Osm}}{\text{mol}}
$$
This coefficient \\(i\\) is usually referred to as the _van't Hoff factor_, that is __the ratio between the actual concentration of particles produced when the substance is dissolved and the formal concentration that would be expected from its chemical formula__.
Van't Hoff factors allow for a more general estimation of the _real osmolarity_
{{< katex display >}}
O_{\text{real}}=\sum_k i_{_{k}}\,C_{_{k}}
{{< /katex >}}
Notably, for all the ingredients listed in the recipes of electrophysiologic interest, it is quite reasonable to assume complete dissociation (\\(\alpha=1 \Rightarrow i=n\varphi\\)) thus making the two expressions for \\(O_{\text{real}}\\) essentially equivalent.

{{< hint warning >}}
WARNING  
...in practice it is quite impossible to determine \\(\varphi_k\\) for each individual solute \\(k\\) within a solution that is made of many type of solutes, like the ones in our recipe book.
Therefore, to measure the ___real___ osmolarity, the only effective way it is usually using an osmometer.
{{< /hint >}}


## References
- [Osmotic Concentration - Wiki](https://en.wikipedia.org/wiki/Osmotic_concentration)
- [Osmotic Coefficient - Wiki](https://en.wikipedia.org/wiki/Osmotic_coefficient)
- [Van 't Hoff factor - Wiki](https://en.wikipedia.org/wiki/Van_%27t_Hoff_factor)
- [UBC - Department of Zoology](https://www.zoology.ubc.ca/~biomania/tutorial/osmosis/fr01.htm)
- Joseph Feher (2012) Quantitative Human Physiology - Chapter 2.7 - Osmosis and Osmotic Pressure, _Academic Press_. pp.141-152, ISBN: 9780123821638, [DOI: B978-0-12-382163-8.00017-7](https://doi.org/10.1016/B978-0-12-382163-8.00017-7).
