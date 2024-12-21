---
title: "R"
weight: 20
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# R

## Win
### R
1. go to https://cloud.r-project.org/
1. choose _Download R for Windows_ > _base_
1. download __R__ from that page
1. double click on the executable file you just downloaded and follow the
    on-screen instructions
1. __(Optional)__ go back and choose _Download R for Windows_ > _Rtools_ to
    install the latest version of Rtools (tools to build __R__ packages on
    Windows)

### RStudio
__RStudio__ is a third-party program providing a nicer graphical interface to
__R__. The __RStudio__ integrated development environment (IDE) for __R__ is a
product of _Posit PBC_.
1. go to: https://posit.co/download/rstudio-desktop/
1. press the button you find below the line _2: Install RStudio_ (i.e.,
    _DOWNLOAD RSTUDIO DESKTOP FOR WINDOWS_)
1. double click on the executable file you just downloaded and follow the
    on-screen instructions to install __RStudio__

If all goes well, you should find __RStudio__ in the start menu, as with all
your other programs.

## Linux
Depending on your ditribution, use your package manager to download and install
both __R__ and __RStudio__.
### Arch - Manjaro
```sh
# Install R
sudo pacman -Syu r
# To `install.packages`` from within R, the following are also needed 
sudo pacman -Syu tk ttf-dejavu ttf-dejavu-nerd

# To install RStudio get yay first
sudo pacman -Syu && sudo pacman -S yay
# Get RStudio 
yay -S --noconfirm rstudio-desktop-bin
```
### Fedora - Redhat
```sh
# Install R
sudo dnf install R
```
### Debian - Ubuntu
```sh
# Install R
sudo apt update
sudo apt install r-base r-base-dev
```

## Posit Cloud
For occasional uses (e.g., individual training uses) _Posit_ also provides a
completely free online version of __RStudio__ called __Posit Cloud__.
Actually you just need a browser to get started!
1. go to https://posit.co/products/cloud/cloud/
1. select the "Get Started" button, then "Sign Up" (you can even use your Google
    credentials)
1. when you are in, choose _New Project_ -> _New RStudio Project_ and you will
    then immediately have a complete and fully functional __RStudio__ IDE at
    your disposal.
