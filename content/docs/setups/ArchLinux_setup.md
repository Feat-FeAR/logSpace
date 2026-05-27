---
title: "Arch Linux"
weight: 10
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Install Arch Linux
{{< hint warning >}}
__Disclaimer__  
The following is a bulleted list summarizing _a possible basic installation_ procedure for Arch Linux.
It is designed as a quick and concise reference guide for personal use, a kind of _dryer version_ of the official [Installation Guide](https://wiki.archlinux.org/title/Installation_guide), organized into bullet points.
It is by no means intended to be a comprehensive guide to installing the operating system; for that, please refer to the official websites, specifically:
- [archlinux.org](https://archlinux.org/)
- [ArchWiki](https://wiki.archlinux.org/title/ArchWiki)
- [Installation Guide](https://wiki.archlinux.org/title/Installation_guide)
- [General Recommendations](https://wiki.archlinux.org/title/General_recommendations)
- [FAQ](https://wiki.archlinux.org/title/Frequently_asked_questions)
{{< /hint >}}

## Arch Linux
Arch Linux is a lightweight and flexible Linux distribution that tries to *Keep It Simple* (where "absence of unnecessary additions or modifications" is Arch's definition of *simplicity*).
The default installation is a minimal base system, configured by the user to *only add what is purposely required*.

Arch Linux is an independently developed *x86-64* general-purpose GNU/Linux distribution that strives to provide the latest stable versions of most software by following a *rolling release model*.
It uses the ___Pacman___ package manager to install, update, and remove the software from its [__Official Repositories__](https://archlinux.org/packages/) (`core` and `extra`, essentially).

Arch follows the *file system hierarchy* for operating systems using the *systemd* service manager.


## Installation procedure
1. Download the official ISO file from [here](https://archlinux.org/download/) and verify its integrity (image signature can be copied from [here](https://archlinux.org/download/#checksums)).

1. In Windows, use the multi-purpose USB ISO writer **Rufus** to create a bootable USB flash drive and run the *live system* on the target machine.
    - `Boot selection`: the Arch Linux ISO
    - `Device`: the USB drive you want to create the bootable Arch Linux onto
    - `Persistent partition size`: use the slider to choose the partition's size
    - `Partition scheme`: `MBR`
    - `Target system`: `BIOS or UEFI`
    - All other setting: (default)

1. Enter the UEFI and
    - Disable [*Secure Boot*](https://wiki.archlinux.org/title/Unified_Extensible_Firmware_Interface/Secure_Boot) (if desired, *Secure Boot* can be---sometimes---set up after completing the installation);
    - Set the USB drive as the boot priority.

1. Restart to boot the live environment, select _Arch Linux install medium_, and press `Enter` to enter the installation environment.
You will be logged in on the first *virtual console* as the root user, and presented with a **Zsh** shell prompt.
{{< hint info >}}
__NOTE__  
If the USB drive does not boot properly using the default ISO Image mode, *DD Image mode* should be used instead.
To switch this mode on, go back to point __2__ and select `GPT` from the Rufus `Partition scheme` drop-down menu.
After clicking `START` you will get the mode selection dialog, select `DD Image mode`.
{{< /hint >}}

1. The default console keymap is US.
Set alternative layouts (e.g., italian) by
    ```sh
    loadkeys it
    ```

1. Verify the boot mode by checking the UEFI bitness:
    ```sh
    cat /sys/firmware/efi/fw_platform_size
    ```
   If the command returns something different from `64`, please refer to the official documentation as referenced above.

1. Ensure your network interface (most commonly `wlan0` or `wlp1s0` for a wireless card) is listed and enabled:
    ```sh
    ip link
    ```

1. To connect to the network, simply plug in the Ethernet cable or use the *Internet Wireless Daemon (IWD)* to authenticate on the wireless network via Wi-Fi.
    - Enter the __IWD__ interactive prompt:
      ```sh
      iwctl
      ```
    - List all Wi-Fi devices:
      ```
      [iwd]# device list
      ```
    - Check the device or its corresponding adapter is turned on (i.e, _powered_).
    - Scan for available networks, list all, and connect to one (note that the first command will not output anything):
      ```
      [iwd]# station _name_ scan
      [iwd]# station _name_ get-networks
      [iwd]# station _name_ connect _SSID_
      ```
    - Enter the passphrase and exit the __IWD__ interactive prompt by pressing `Ctrl+d`.
    - Dynamic IP address and DNS server assignment should work out of the box for Ethernet and WLAN.
    - Verify connection with `ping`:
      ```sh
      ping ping.archlinux.org
      ```

1. Use `timedatectl` to ensure the system clock is synchronized.

1. Identify the target disk(s):
    ```sh
    fdisk -l
    ```
    or
    ```sh
    lsblk -pf
    ```

1. Modify partition tables by the *FDISK interactive prompt* (the M.2 NVMe SSD drive `/dev/nvme0n1` is used as an example below):
    ```sh
    fdisk /dev/nvme0n1
    ```
    Type:
    - `d` for help;
    - `p` to print the partition table;
    - `d` to delete old/unwanted partitions;
    - `n` to create the new ones by entering the first and last sectors (notation `+size{K,M,G,T,P}`---e.g., `+50G`---can be conveniently used to allocate *a number of consecutive sectors starting from the first one* for a given amount of disk space);
    - `q` to quit without saving changes;
    - `w` to write table to disk and exit.

    {{< hint warning >}}
__Partitioning Recommendations__  
The following partitions are required for **UEFI** with **GPT** (modern standard):
1. A *EFI system partition* (also called ESP) - Suggested: 1 GiB - (hereafter `nvme0n1p1`).
If you are installing Arch Linux on an UEFI-capable computer with an installed operating system (like Windows 10) it is very likely that you already have an EFI system partition.
**If the disk from which you want to boot already has an EFI system partition, do not create another one, but use the existing partition instead.**
1. A *Linux swap partition* - Suggested: > 4 GiB - (hereafter `nvme0n1p2`).
1. One partition for the *root directory* `/` - Suggested: > 23–32 GiB - (hereafter `nvme0n1p3`).
    {{< /hint >}}

1. Format each newly created partition with an appropriate file system, e.g.:
    ```sh
    mkfs.ext4 /dev/nvme0n1p3
    mkswap /dev/nvme0n1p2
    ```
    {{< hint warning >}}
__Partitioning Recommendations__  
If you created an EFI system partition, format it to FAT32 using `mkfs.fat -F 32 /dev/nvme0n1p1`, but **only if you created it during the partitioning step!**
    {{< /hint >}}

1. Mount the volumes in their corresponding hierarchical order to `/mnt`,
    ```sh
    mount /dev/nvme0n1p3 /mnt
    mount --mkdir /dev/nvme0n1p1 /mnt/boot
    ```
    and enable the swap volume:
    ```sh
    swapon /dev/nvme0n1p2
    ```

1. __Install the system!__
    - For a basic installation with the Linux kernel and firmware for common hardware, you can use the `pacstrap` command (that installs packages to a specified *new root* directory):
      ```sh
      pacstrap -K /mnt base linux linux-firmware
      ```
    - or you can use the usual `pacman` to install the same (meta)packages while *chrooted* into the new system (by changing root into the new system you can directly interact with its environment, tools, and configurations as if you were booted into it):
      ```sh
      arch-chroot /mnt
      pacman -S base linux linux-firmware
      ```

1. Since the only mandatory (meta)package to install is `base`, which **does not** include all tools from the live installation, installing more packages is frequently necessary.
For instance, in the installation image, `systemd-networkd`, `systemd-resolved`, and `iwd` are preconfigured and enabled by default.
That will not be the case for the installed system.
Packages commonly added at this step include:
    - **CPU microcode updates**: `amd-ucode` or `intel-ucode`;
    - **Firmware for Marvell wireless devices**: `linux-firmware-marvell` (and/or any of the multiple firmware packages for *Broadcom wireless*);
    - **Sound Open Firmware for onboard audio**: `sof-firmware`;
    - **Possible specific firmware for other devices** not included in `linux-firmware`;
    - **Software for networking**: `networkmanager` (or `iwd`, `dhcpcd`, ...);
    - **Console text editor**: `nano` and/or `vim`;
    - **Packages for accessing documentation**: `man-db`, `man-pages`, `texinfo`;
    - **Utilities**: `sudo`.

1. To get needed file systems mounted on startup, generate an *fstab file* with *persistent block device naming* (`-U` is to reference file systems by their UUIDs):
    ```sh
    genfstab -U /mnt >> /mnt/etc/fstab
    ```

1. Set the time zone, e.g.:
    ```sh
    ln -sf /usr/share/zoneinfo/Europe/Rome /etc/localtime
    ```
    and generate `/etc/adjtime` by running
    ```sh
    hwclock --systohc
    ```
    which sets the machine's hardware clock (RTC) to match the current system time (kernel time).

1. Edit `/etc/locale.gen` by uncommenting the UTF-8 locales you will be using for region and language specific formatting of dates, currency, decimal separators, etc. (`en_US.UTF-8 UTF-8` or `it_IT.UTF-8 UTF-8`).
Then, generate the locales by running
    ```sh
    locale-gen
    ```
    Also, create the `locale.conf` file, and set the `LANG` variable accordingly:
    ```sh
    echo "LANG=en_US.UTF-8" > /etc/locale.conf
    ```
    Finally, make possible changes to console keyboard layout persistent:
    ```sh
    echo "KEYMAP=it" > /etc/vconsole.conf
    ```

1. Create the hostname file:
    ```sh
    echo _yourhostname_ > /etc/hostname
    ```
    It must contain from 1 to 63 characters, using **only lowercase `a` to `z`, `0` to `9`, and `-`, and must not start with `-`**.

1. Recreate the *initramfs* by 
    ```sh
    mkinitcpio -P
    ```
    (only required If you have changed the default console keymap).

1. Set a secure password for the `root` user:
    ```sh
    passwd
    ```

1. Install a suitable [boot loader](https://wiki.archlinux.org/title/Arch_boot_process#Boot_loader), like **GRUB2**:
    - move inside the chroot (using `arch-chroot /mnt`);
    - install the packages `grub` and `efibootmgr` (by `pacman -S`);
    - install the GRUB EFI application `grubx64.efi` to `/boot/EFI/GRUB/` and its modules to `/boot/grub/x86_64-efi/`:
        ```sh
        grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=GRUB
        ```
     - optionally use the `efibootmgr` package to remove unnecessary entries;
     - generate the main configuration file:
        ```sh
        grub-mkconfig -o /boot/grub/grub.cfg
        ```

1. `exit` the *chroot* environment, (optionally) unmount all the partitions  (`umount -R /mnt`), and `shutdown now` or `reboot` to restart the machine.
Remove the installation medium and then login into the new system with the root account.

## Post-installation
### Unprivileged users 
Create one or more unprivileged users in the usual way and enable `sudo` for the `wheel` group.
Specifically, provided that you logged in as root:
1. Create a regular user with home directory and _bash_ shell:
    ```sh
    useradd -m -s /bin/bash _username_
    ```

1. Set the user's password:
    ```sh
    passwd _username_
    ```

1. Add the user to the wheel group if this user should administer the system:
    ```sh
    usermod -aG wheel _username_
    ```

1. Edit `/etc/sudoers` to enable `sudo` for the wheel group:
    ```sh
    EDITOR=nano visudo
    ```
    and in `visudo`, uncomment this line:
    ```
    %wheel ALL=(ALL:ALL) ALL
    ```

1. Switch to the new user:
    ```sh
    su - _username_
    ```

1. Test `sudo`:
    ```sh
    sudo pacman -Syu
    ```

### Internet connection by DHCP
1. Check if the driver for your wireless device is installed and loaded:
    ```sh
    lspci -k | less     # if the card is connected by PCIe
    lsusb -v | less     # if the card is connected by USB
    ```

1. Ensure your network interface is listed and enabled (even if in *DOWN* state):
    ```sh
    ip link
    ```
    Most common names for a wireless card are `wlan0`, `wlp1s0`, `wlp2s0`, ...

1. In case of [*NetworkManager*](https://wiki.archlinux.org/title/NetworkManager) (if previously installed) *enable* and *start* the corresponding service:
    ```sh
    sudo systemctl enable NetworkManager.service
    sudo systemctl start NetworkManager.service
    ```
    {{< hint warning >}}
__WARNING__  
Remember to run **only one [DHCP client or network manager](https://wiki.archlinux.org/title/Network_configuration#Network_managers) on the system** (i.e., each network interface should be managed by only one of them)!
    {{< /hint >}}

1. List nearby Wi-Fi networks:
    ```sh
    nmcli device wifi list
    ```

1. Connect to a Wi-Fi network by *SSID*:
    ```sh
    nmcli device wifi connect _SSID_ password _password_
    ```
    Now, `ip link` should report the device in *UP* state.

1. Verify connection with `ping`:
    ```sh
    ping ping.archlinux.org
    ```

1. Get a list of connections with their names, *UUIDs*, types and backing devices:
    ```sh
    nmcli connection show
    ```

1. Disconnect an interface:
    ```sh
    nmcli device disconnect ifname _name_
    ```

{{< hint info >}}
__NOTE__  
If you've *enabled* the service, and since the password and SSIDs are saved after the first successful connection, you should be automatically connected at the next reboot.
{{< /hint >}}

{{< hint info >}}
__INFO__  
NetworkManager comes with `nmcli` CLI and `nmtui` TUI.
Additional interfaces are `nm-connection-editor` for a GUI and `network-manager-applet` for a system tray applet.
{{< /hint >}}

### KDE Plasma GUI
{{< hint info >}}
__INFO__  
Starting from *Plasma 6.4*, the *Wayland* graphics platform has become the default and preferred one.
*X11* session is only available separately with the `plasma-x11-session` package.
{{< /hint >}}

1. Install the `plasma-meta` meta-package (or the `plasma` group) to get the *KDE Plasma* desktop environment.

1. If you are an *NVIDIA* user, ensure the proper [graphics card drivers](https://wiki.archlinux.org/title/NVIDIA) are installed and the [DRM kernel mode setting](https://wiki.archlinux.org/title/NVIDIA#DRM_kernel_mode_setting) is enabled.

1. Install the `kde-applications-meta` meta-package (or the `kde-applications` group) for the full set of *KDE Applications*.
Alternatively, install only the relevant dependencies of `kde-applications-meta`.

1. To start *Plasma*, install the `plasma-login-manager` package and enable the service:
    ```sh
    sudo systemctl enable plasmalogin.service
    ```

1. Install `powerdevil` (actually, this should be already present...) and the `power-profiles-daemon` optional dependency for an integrated *Plasma* power managing service:
    ```sh
    sudo pacman -Syu powerdevil power-profiles-daemon
    ```

1. Install alternative application for internet and mail (e.g., `firefox`, `thunderbird`)

### GRUB themes
For aesthetic reasons and/or to improve readability on HD laptop screens, it may be necessary to install additional [GRUB Themes](https://www.gnome-look.org/browse?cat=109&ord=latest).
For instance, in order to install this [Minimal GRUB Theme](https://www.gnome-look.org/p/2353413), download and extract the related folder, then run
```sh
sudo bash ./Install.sh
```
Use these settings:
- Font size:  42 points (good for high resolution screens)
- Countdown:  5 seconds

### AUR and Yay
The [__Arch User Repository (AUR)__](https://aur.archlinux.org/packages) is a community-driven repository for Arch Linux users.
The AUR was created to organize and share new packages from the community and to help expedite popular packages' inclusion into the _extra_ repository. 

#### Manual
To get any of the AUR packages, you can always opt for the manual procedure, namely: _clone the source_ → _build it_ → _install the package_:
```sh
git clone https://aur.archlinux.org/_packagename_.git
cd _packagename_
makepkg -si
```
{{< hint warning >}}
__WARNING__  
Since _Pacman_ is not intended to interact with AUR, this approach lacks a mechanism to automatically update the package when an updated version is published to the AUR.
{{< /hint >}}

#### Yay AUR helper
To avoid manual updating, many _AUR helpers_ (_yay_, _pikaur_, _paru_, _pacaur_, ...) have been created to help users install and update packages directly from the AUR repository, as if they were a kind of "_Pacman_ for the AUR".
This means that the only AUR package that needs to be installed manually is the AUR package manager itself (which, in most of the cases, will also update itself automatically).
To install _Yay_:
1. update the system and install `git` and `base-devel` as required packages:
    ```sh
    sudo pacman -Syu git base-devel
    ```

1. clone the _Yay_ package from the AUR:
    ```sh
    git clone https://aur.archlinux.org/yay-bin.git
    ```

1. build and install the package using `makepkg`:
    ```sh
    cd yay-bin
    makepkg -si
    ```

1. verify the installation and remove the cloned directory:
    ```sh
    yay --version
    cd ..
    rm -rf yay
    ```

Now you should be able to install packages from AUR by using _Yay_, __with almost the same flags as _Pacman___.
{{< hint warning >}}
__WARNING__  
Never run _Yay_ with `sudo`.
The tool prompts for privileges when required during package installation.
{{< /hint >}}
{{< hint info >}}
__NOTE on _-bin_ packages__  
Unless you want to patch the program or you don't trust the source, always prefer the _-bin_ (pre-compiled binaries) versions when available!
This way, you'll benefit from faster installation and updating, and minimize the risk of dependency conflicts during updates.
Otherwise, you'll have to compile the program for the initial installation and recompile it for every update!
{{< /hint >}}

### Cameras
- Install `linux-firmware`, `libcamera` to use the cameras in applications that support _libcamera_.
- The `qcam` utility available from `libcamera-tools` can be used to test camera functionality.
- Both cameras should work in _Firefox_ after installing `pipewire-libcamera` and enabling `media.webrtc.camera.allow-pipewire` in the browser.
