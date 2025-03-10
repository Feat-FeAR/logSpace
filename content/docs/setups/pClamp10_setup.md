---
title: "pCLAMP 10"
weight: 20
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Install pCLAMP 10 on Windows 10 Pro
{{< hint info >}}
__NOTE__  
This tutorial assumes that __you have an original license for pCLAMP 10 with the relative hardware dongle__.
If you don't have the dongle you won't be able to run Clampex except in _demo mode_.
Also note that the _Axopatch 200B_ amplifier and the _Digidata 1440A Digitizer_ are used as examples for the final configuration steps, but conceptually the procedure would be the same for different device models.
{{< /hint >}}

## OS, pCLAMP, and the Sentinel HASP dongle
1. Use [Rufus](https://rufus.ie/) to get a copy of ___Windows 10 Pro___ (pCLAMP won't work on ___Home___ edition!).
Update and (possibly) activate it through the [Microsoft Activation Scripts (MAS)](https://massgrave.dev/) ([GitHub](https://github.com/massgravel/Microsoft-Activation-Scripts)).

1. Download ___pCLAMP 10.7.0___ from _Molecular Devices_ web site ([Axon pCLAMP - Installers for v. 7, 8, 9, 10](https://support.moleculardevices.com/s/article/Axon-pClamp-Where-can-I-download-update-or-installers-for-version-7-8-9-or-10) or [Axon pCLAMP 10](https://support.moleculardevices.com/s/article/Axon-pCLAMP-10-Electrophysiology-Data-Acquisition-Analysis-Software-Download-Page)).

1. Make sure that Windows _Memory Integrity_ is disabled (`Start > Settings > Update & Security > Windows Security > Device security > Core isolation > Core isolation details > Memory integrity > Off`) to allow later installation of the _Sentinel HASP_ hardware protection key (dongle).

1. Insert the dongle key and restart.

1. Run pCLAMP installer.

1. After installing pCLAMP, the Sentinel HASP installation will start automatically.
This process may hang halfway through or, even more likely, produce a BSOD ([aksfridge.sys Blue Screen](https://answers.microsoft.com/en-us/windows/forum/all/aksfridgesys-blue-screen/39216a73-1244-4a2f-bc25-618f05b19321)).
In either case, restart the PC.

1. Update the HASP drivers to fix the problem.
Download the Sentinel HASP/LDK Runtime Environment Installer GUI for Windows from the [vendor website](https://supportportal.thalesgroup.com/csm?sys_kb_id=61fb0ee1dbd2e78cfe0aff3dbf9619ab&id=kb_article_view&sysparm_rank=8&sysparm_tsqueryId=d846bbc81b511450f12064606e4bcbf6&sysparm_article=KB0018320).
Extract the `Sentinel_LDK_Run-time_setup.zip` archive.
Right click the `HASPUserSetup.exe` and _Run as Administrator_ to install.

1. After the installation is complete, restart the system.

1. Run the ___DongleFind___ application to check that the dongle is correctly detected by the system.

## Clampex
1. Connect the _Digidata 1440A Digitizer_ to a USB port and turn it on.
Drivers should already be installed by pCLAMP (check `Control Panel > Device Manager > Molecular Devices > DD1440`).

1. Open ___Clampex___ and select `Configure > Digitizer... > Change... > Digidata 1440 Series > Scan`.
The Configuration field changes from *Not present* to *Available* and the OK button is enabled.
Click OK and exit the dialog.

1. Open the Clampex Tutorial _Setting Up ClampexSoftware for Data Acquisition_ to configure the _Axopatch 200B_ amplifier telegraphs, input/output channels, and protocols. 

## AxoScope
1. Connect the MiniDigi Digitizer to a USB port.
Drivers should already be installed by pCLAMP (check in `Control Panel > Device Manager > Molecular Devices > ...`).
{{< hint warning >}}
__WARNING__  
Due to limitations imposed by the drivers, the _MiniDigi 1A Digitizer_ can only work on 32-bit systems.
Unlike Windows 11, Windows 10 Pro does have a 32-bit version, but with the typical limitation of 32-bit systems of not recognizing more than 4 GB of RAM.
For 64-bit systems, Axon Instruments/Molecular Devices has released the _MiniDigi 1B Digitizer_.
{{< /hint >}}

1. Open _AxoScope_ and select `Configure > Digitizer... > Change... > MiniDigi > Scan`.
The Configuration field changes from *Not present* to *Available* and the OK button is enabled.
Click OK and exit the dialog.

1. Now press the `Configure` button to open the Configure MiniDigi dialog and select the style of filtering to use (*Analog filtering* or *MinMax filtering*).

1. To calibrate the MiniDigi digitizer, attach a grounding plug to the *Channel 0* BNC, then press the Start button.
Repeat for *Channel 1*.
Click OK and exit the dialog.
