---
title: "Patch configurations"
weight: 0
draft: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Patch Clamp Configurations






## Membrane Resistance (RM) and Membrane Capacitance (CM) - The RC Circuit

Cells are frequently modeled as electrical circuits composed of resistors and capacitors due to their membrane properties. The cell membrane is primarily a lipid bilayer, which acts as an electrical insulator, separating ions in the extracellular space from ions and charged proteins in the cytoplasm.

Because of this, it behaves like a capacitor. To alter the voltage across this membrane, it must first be charged, according with the relationship defining electrical capacity Vm = Q / CM

However, some of the proteins embedded within this membrane form ion-permeable channels, reducing the membrane's resistance (Rm) and enabling electrical currents to flow across the lipid bilayer.

The parallel arrangement of membrane resistance and capacitance constitutes an RC circuit, widely used in electronics for filtering frequencies.


## Basic voltage clamp experiment

Applying voltage steps across the membrane generates characteristic current responses, initially large (the initial peak) and declining exponentially to a steady state. The early response charges the membrane capacitance, whereas the steady-state current is maintained by the membrane resistance.

The amplitude of the initial fast current is entirely determined by the amplitude of the voltage step and the internal resistance (i.e., the sum of the electrode resistance and the resistance of the electrode's connection to the cell, aka access resistance).
In the steady state, the amount of current required to maintain the membrane voltage is only determined by the membrane resistance and Ohm's law applies

The values of membrane capacitance and membrane resistance determine how quickly this steady state is reached: the larger the product of membrane resistance and membrane capacitance (the membrane time constant \tau), the longer the charging will take.

It is possible to simplify the calculations further by using resistance in units of MOhm (10e+6 Ohm), voltage in units of mV (10-3 V) and current in units of nA (10-9 A), as the unit prefixes, cancel each other (10-3 V = 10e+6 Ohm * 10-9 A).




## Bath Configuration

When just entering the bath, the voltage between the recording electrode and the reference electrode (ground) is---by definition---zero. Accordingly, the amplifier's offset voltage needs to be adjusted until the measured voltage is indeed 0 mV.

By observing the shape and amplitude of the current response to a small voltage pulse at the electrode (the so-called test pulse) we gain lots of useful information about the recording electrode and the cell.

Initially, electrodes submerged in the solution have current responses determined solely by pipette resistance, calculable through Ohm's law.




Example:

Considering the Axopatch 200B amplifier, the total amplifier gain (which is usually telegraphed to Clampex software) is given by
1. \beta: the  headstage gain
1. \alpha: the amplifier output gain
The scale factor at unity alpha×beta gain is 0.001 V/pA = 1 mV/pA
This value depends on amplifier circuitry and never changes

So, if a 5 mV test pulse yields a voltage signal of 500 mV at the Axopatch 200B amplifier output (set with unity gain \alpha\beta = 1), this correspond to an actual current response of 500 pA, thus indicating a pipette tip resistance of 10 MOhm (= 5 mv / 0.5 nA).

In whole cell recordings, it is common to use pipettes with tip resistances of 5-10 MOhm.



## Patch (aka cell-attached or on-cell) Configuration

As the electrode approaches the cell, resistance increases, leading to a drop in the current amplitude, especially upon forming a high-resistance seal (gigaseal).


As the small patch of cell membrane in the pipette tip has a very high resistance, any current flowing from the pipette will be flowing through the minute gap where the membrane seals onto the glass of the pipette (i.e., the current over the membrane patch is negligible).

Reliable patch-clamp experiments commonly require a ‘tight seal’ in the range of GOhms, a so-called ‘gigaseal’. 
The seal resistance, measured by small current responses to voltage pulses, confirms the integrity of the cell-electrode interaction during the whole experiment.


Pipette capacitance often produces quick transient currents at the onset of voltage steps, which can be compensated using the ‘fast capacitance compensation’ (most importation if you are interested in fast ionic currents, as action potential of excitable cells).


## Cell (whole-cell) configuration

Breaking through the cell membrane creates direct electrical and diffusional access to the cell's interior (while preserving the obtained seal).

In this configuration, the recording pipette is electrically directly coupled to the cell:

Here, the current response to a given voltage pulse significantly changes, reflecting membrane resistance and capacitance. The series resistance (combination of access and pipette resistances) becomes essential for analyzing the recordings.


On breaking into the cell, the membrane in the pipette tip ruptures and current between the recording electrode and the ground can now flow into the cell and across the cell membrane. In this whole-cell configuration, almost all current flows across the cell membrane and charges the membrane capacitance. Only a negligible amount of current will flow across the seal, as the seal resistance is at least an order of magnitude larger than the membrane resistance (now, the membrane resistance is determined by the entire cell’s membrane area, not just the membrane patch within the pipette tip). Because the membrane is ruptured and not removed, membrane components will obstruct current access from the electrode to the cell and contribute a so-called ‘access resistance’. The sum of access resistance and initial pipette resistance make up the total resistance at the pipette tip, referred to as series resistance.



 As before, the fast initial jump in current is determined by the flow of charge through the pipette: series resistance (RS) = test voltage (VT) / initial current (IP).
 Thus, if in response to a -5 mV step, the initial current is measured as -600 pA, the series resistance is 8.3 MOhm (-5 mV / -0.6 nA).

The decay of the current is determined by the membrane time constant, which is simply the product of membrane capacitance and membrane resistance (tm = Cm * Rm) in the unperturbed cell

l. Finally, once the current has reached steady state, the offset current (‘holding current’, IH) is determined by the membrane resistance (Rm = VT / IH). 


## Practical vs. Theoretical Considerations

The described principles hold true primarily for passive, compact cells. Real neurons, however, possess complex morphologies and voltage-gated channels, complicating direct application of basic RC circuit theory. Voltage pulses may activate channels, influencing recorded currents and introducing the "space clamp" problem, where voltage distribution within complex cell structures varies significantly from the electrode-applied voltage.


## PATCH-1U model cell specifications

The PATCH-1U model cell emulates three experimental configurations:
- BATH: 10 MΩ "electrode" resistor to ground.
- PATCH: 10 GΩ "patch" resistor to ground.
Approximately 5 pF stray capacitance to ground.
- CELL: 10 MΩ "electrode" resistor.
500 MΩ "cell membrane" resistor in parallel with 33 pF "cell membrane" capacitor.
Approximately 5 pF stray capacitance to ground.



## References


Lea Goetz and Christian Wilms. [Understanding the cell as an electrical circuit](https://www.scientifica.uk.com/learning-zone/understanding-the-cell-as-an-electrical-circuit) @ Scientifica Ltd, Uckfield, UK