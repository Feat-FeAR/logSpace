---
title: "Bash Config"
weight: 20
draft: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Bash Customization

## Bash prompt
### Prompt variables
In Bash, the shell prompt is mainly controlled through a few special environment or shell variables.
Bash displays the primary prompt `PS1` when it is ready to read a command, and the secondary prompt `PS2` when a command continues on the next line.
`PS3` is for selection inputs, while `PS4` is used in debug mode.
`PS0` is a less known and less commonly used prompt variable: it is expanded after Bash reads a command and before the command is executed.

| Variable Name | Purpose                       | Default String    |
|:-------------:|:------------------------------|-------------------|
|`PS0`          | Pre-execution prompt          | `""`              |
|`PS1`          | __Primary prompt__            | `"[\u@\h \W]\$ "` |
|`PS2`          | __Secondary prompt__          | `"> "`            |
|`PS3`          | Prompt for `select` loops     | `""`              |
|`PS4`          | Debug/Trace prompt (`set -x`) | `"+ "`            |

Check the current value of Bash primary prompt:
```sh
echo $PS1
```
or all prompts
```sh
set | grep '^PS'
```

In addition, there is also the related `PROMPT_COMMAND` variable, which stores a command that is meant to be executed before Bash displays `PS1`.
This is very commonly used for:
- dynamic prompts
- updating terminal titles
- Git branch information
- timers
- status checks

Here is a possible default for terminal title updating, as returned by `echo $PROMPT_COMMAND`:
```text
printf "\033]0;%s@%s:%s\007" "${USER}" "${HOSTNAME%%.*}" "${PWD/#$HOME/\~}"
```

### Escape sequences
Within Bash prompt environment variables, the following special characters can be used:

| Sequence | Meaning |
|:--------:|:--------|
| `\u`     | Username |
| `\h`     | Hostname, short form (up to the first `.`) |
| `\H`     | Full hostname |
| `\w`     | Current working directory (with `$HOME` abbreviated as `~`) |
| `\W`     | Basename of `$PWD` (with `$HOME` abbreviated as `~`) |
| `\d`     | Date (in "Weekday Month Date" format) |
| `\t`     | Time, 24-hour format: `HH:MM:SS` |
| `\T`     | Time, 12-hour format |
| `\@`     | Time, 12-hour format with AM/PM |
| `\!`     | History number |
| `\$`     | `#` if root, `$` otherwise |
| `\n`     | Newline |
| `\a`     | A bell character |
| `\\`     | Literal backslash |
| `\e`     | Start ANSI escape (`ESC`) character |
| `\033`   | An alternative syntax for the `ESC` character |
| `\[`     | Begin a sequence of non-printing characters |
| `\]`     | End a sequence of non-printing characters |

{{< hint warning >}}
__WARNING__  
ANSI escape sequences are terminal-dependent.
Most modern terminals (including _xterm_, _GNOME Terminal_, _iTerm2_, _Windows Terminal_, _Alacritty_, _Kitty_, ...) support them. 
Older terminals may not.
{{< /hint >}}

### Context variables
These variables are frequently referenced in prompt definitions (by using the usual _variable expansion_ `$` syntax).

| Variable | Meaning |
|:--------:|---------|
| `USER` | Current username |
| `HOSTNAME` | Hostname |
| `PWD` | Current directory |
| `HOME` | Home directory |
| `OLDPWD` | Previous directory |
| `SHLVL` | Shell nesting level |
| `TERM` | Terminal type |

### Commands outputs
The output of any Bash command can be showed in the prompt by using the usual _command substitution_ `$(...)` syntax .
For example:
```sh
PS1="$(date)>"
```

### Color handling
For an explanation of how colors are defined in Bash through ANSI escape sequences, see the section ...

When used in prompt variables, non-printing characters must be wrapped in `\[` and `\]` to tell Bash that these characters do not take screen space.
Without them, cursor positioning and line editing can become broken.

Example:
- in regular usage: `\033[32mThis is in green\033[0m`
- for PS0/1/2/4: `\[\033[32m\]This is in green\[\033[m\]`

Here's what every color tag will look like:
```text
\033[<n>m
# or
\e[<n>m
```
```sh
# E.g., red text
echo -e "\e[31mHello\e[0m"
```
where `<n>` is a placeholder for the actual color code.

So any colored text line will look like this:
```sh
\[\033[1;34m\]"ANYTHING"\[\033[0m\]

# Breaking it down...
\[  # Color sequences in prompt are enclosed in escaped square brackets
  \033[   # Start of color tag
    1;34  # Color pair x;y to use (bold/light blue)
  m     # End of color tag
\]
"ANYTHING" # Characters, specials, or some command output 
\[\033[0m\] # End of color change (back to default color scheme)
```











## Escaping
If you are going to use these codes in your special Bash variables
- PS0
- PS1
- PS2 (= this is for prompting)
- PS4
you should add extra escape characters so that Bash can interpret them correctly. Without this adding extra escape characters it works but you will face problems when you use `Ctrl + r` for search in your history.


## Linux KALI-style prompt
```sh
┌──(fear@SilverLife-3)-[~/Documents]
└─$ echo $PS1

\[\e]0;\u@\h: \w\a\]\[\033[;32m\]┌──(\[\033[1;34m\]\u@\h\[\033[;32m\])-[\[\033[0;1m\]\w\[\033[;32m\]]\n\[\033[0;32m\]└─\[\033[1;34m\]\$\[\033[0m\]

# Breaking it down...

\[
  \e]0;           # Set the title of the terminal...
  \u@\h: \w\a     # ...to <user>@<host>: <path>
\]

\[\033[;32m\]     # sequence of colored elements
  ┌──(

\[\033[1;34m\]
  \u@\h           # <username>@<hostname>

\[\033[;32m\]
  )-[

\[\033[0;1m\]
  \w              # the current working directory

\[\033[;32m\]
  ]

\n                # a new line

\[\033[;32m\]
  └─

\[\033[1;34m\]
  \$              # "$" or "#" for normal user or root, respectively

\[\033[0m\]       # remove all attributes (formatting and colors)
                  # It can be a good idea to add it at the end of
                  # each colored text.
```

## Customization  
```sh
# Save the contents of the current PS1 variable into a backup variable
DEFAULT=$PS1

# To test a custom prompt just reassign the PS1 variable with one of the
# following expressions (between quotes)
PS1="..."

# green-blue, with a "\[\033[;32m\]_Ʌ†_" in the place of "@"
\n\[\e]0;\u@\h: \w\a\]\[\033[1;32m\]┌──(\[\033[1;34m\]\u\[\033[1;32m\]_Ʌ†_\[\033[1;34m\]\h\[\033[1;32m\])-[\[\033[0;1m\]\w\[\033[1;32m\]]\n\[\033[1;32m\]└─\[\033[1;34m\]\$ \[\033[0m\]

# purple-cyan
\n\[\e]0;\u@\h: \w\a\]\[\033[1;35m\]┌──(\[\033[1;36m\]\u\[\033[1;35m\]_Ʌ†_\[\033[1;36m\]\h\[\033[1;35m\])-[\[\033[0;1m\]\w\[\033[1;35m\]]\n\[\033[1;35m\]└─\[\033[1;36m\]\$ \[\033[0m\]

# hybrid colors
\n\[\e]0;\u@\h: \w\a\]\[\033[1;35m\]┌──(\[\033[1;36m\]\u\[\033[1;32m\]_Ʌ†_\[\033[1;34m\]\h\[\033[1;35m\])-[\[\033[0;1m\]\w\[\033[1;35m\]]\n\[\033[1;35m\]└─\[\033[1;36m\]\$ \[\033[0m\]

# green-blue, with a "💀" in the place of "@"
\n\[\e]0;\u@\h: \w\a\]\[\033[1;32m\]┌──(\[\033[1;34m\]\u\[\033[1;32m\] 💀 \[\033[1;34m\]\h\[\033[1;32m\])-[\[\033[0;1m\]\w\[\033[1;32m\]]\n\[\033[1;32m\]└─\[\033[1;34m\]\$ \[\033[0m\]
```


## Aliases

## Persisting Changes

Prompt settings are usually placed in one of these files:

- `~/.bashrc`
- `~/.bash_profile`
- `/etc/bash.bashrc`, for system-wide settings


To make that new prompt permanent you need to change the contents of the PS1 variable in the Bash prompt configuration stored in your user account’s `.bashrc` file which is at `~/.bashrc`.
So, open the `.bashrc` file in a text editor (e.g., nano), scroll down and locate the *PS1=* section. Just replace the default variable with your customized variable. Enter your colored PS1 variable under the *if* line that check for color feature in the shell
```sh
if [ "$color_prompt" = yes ]; then
# or
if ${use_color} ; then
# or somethink alike...
```
And, possibly, enter the variable without colors under the *else* line.
Remember that root's UID is 0, so
```sh
if [[ ${EUID} == 0 ]]
```
means 'if user is the root user'.
Finally, save the file and close your text editor.


NOTE

Technically:

- `PS1`, `PS2`, `PS3`, and `PS4` are shell variables.
- They become environment variables only if exported.

Example:

```sh
export PS1
```

Normally, they stay local to the shell session.


Example:

```sh
echo "export PS1='\u@\h:\w\$ '" >> ~/.bashrc
source ~/.bashrc
```


## References - colors in Bash
- https://linuxhint.com/ls_colors_bash/
- https://www.howtogeek.com/307701/how-to-customize-and-colorize-your-bash-prompt/
- https://wiki.archlinux.org/title/Bash_(Italiano)/Prompt_customization_(Italiano)
- https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
