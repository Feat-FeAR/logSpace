---
title: "BASH Prompt"
weight: 20
draft: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# BASH Prompt Customizationx



## Escaping
If you are going to use these codes in your special bash variables
- PS0
- PS1
- PS2 (= this is for prompting)
- PS4
you should add extra escape characters so that bash can interpret them correctly. Without this adding extra escape characters it works but you will face problems when you use `Ctrl + r` for search in your history.

exception rule for bash
You should add `\[` before any starting ANSI code and add `\]` after any ending ones.

Example:
- in regular usage: `\033[32mThis is in green\033[0m`
- for PS0/1/2/4: `\[\033[32m\]This is in green\[\033[m\]`




## Environment variables
Bash prompt configuration is stored in four environment variables named `PS1`, `PS2`, `PS3`, and `PS4`.
Bash displays the primary prompt `PS1` when it is ready to read a command, and the secondary prompt `PS2` when it needs more input to complete command.
`PS3` and `PS4` are rarely used.
```sh
# Print the current value of Bash prompt
echo $PS1
```

### Special characters
Within Bash prompt environment variables you can use the folowing special characters:
- `\u` &emsp;&nbsp; your username
- `\h` &emsp;&nbsp; the hostname (computer name), up to the first `.`
- `\H` &emsp;&nbsp; the hostname
- `\d` &emsp;&nbsp; the date, in "Weekday Month Date" format
- `\w` &emsp;&nbsp; the current working directory, with `$HOME` abbreviated as `~`
- `\W` &emsp;&nbsp; the basename of `$PWD`, with `$HOME` abbreviated as `~`
- `\$` &emsp;&nbsp; `$` if you’re a normal user account or `#` if you’re root
- `\a` &emsp;&nbsp; a bell character
- `\n` &emsp;&nbsp; a newline
- `\e` &emsp;&nbsp; an escape character
- `\033` &nbsp; an alternative syntax for the `Esc` character 
- `\[` &emsp;&nbsp; begin a sequence of non-printing characters
- `\]` &emsp;&nbsp; end a sequence of non-printing characters

The default prompt is typically something like
```
"[\u@\h \W]\$ "
```
or
```
"\u@\h:\w\$"
```

### Including commands outputs
The output of any Bash command can be showed in the prompt just by using the usual _command substitution_ syntax `$(...)`.
For example:
```sh
PS1="$(date)>"
```

## Prompt colors
1. Include the entire color code information between `\[` and `\]`;
2. Inside the tag, you must begin with either `\033[` or `\e[` to indicate to Bash that this is color information;
3. At the end of the tag, you must end with `m`;

Here’s what every color tag will look like:
```bash
\[\033["COLOR"m\]
```
where `"COLOR"` is a placeholder for the actual color code.

### Foreground text color
Most used foreground text color:
- `30` &ensp; Black
- `31` &ensp; Red
- `32` &ensp; Green
- `33` &ensp; Yellow
- `34` &ensp; Blue
- `35` &ensp; Purple
- `36` &ensp; Cyan
- `37` &ensp; White

### Text attributes
You can also specify an attribute for the text.
This attribute must be added _before_ the color number, separated by a semicolon `;`.

- Normal_Text:    0 (the default; doesn't actually need to be included)
- Bold_or_Light_Text:  1 (It depends on the terminal emulator)
- Dim_Text:     2
- Underlined_Text:  4
- Blinking_Text:    5 (This does not work in most terminal emulators)
- Reversed_Text:    7 (This inverts the foreground and background colors)
- Hidden_Text:    8

However, keep in mind that text with these attributes will look different in different terminal emulators.

### General color tag
```bash
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










## Linux KALI-style prompt
```bash
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
```bash
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

To make that new prompt permanent you need to change the contents of the PS1 variable in the Bash prompt configuration stored in your user account’s `.bashrc` file which is at `~/.bashrc`. So, open the `.bashrc` file in a text editor (e.g., nano), scroll down and locate the *PS1=* section. Just replace the default variable with your customized variable. Enter your colored PS1 variable under the *if* line that check for color feature in the shell
```bash
if [ "$color_prompt" = yes ]; then
# or
if ${use_color} ; then
# or somethink alike...
```
And, possibly, enter the variable without colors under the *else* line.
Remember that root's UID is 0, so
```bash
if [[ ${EUID} == 0 ]]
```
means 'if user is the root user'.
Finally, save the file and close your text editor.







## References - colors in Bash
- https://linuxhint.com/ls_colors_bash/
- https://www.howtogeek.com/307701/how-to-customize-and-colorize-your-bash-prompt/
- https://wiki.archlinux.org/title/Bash_(Italiano)/Prompt_customization_(Italiano)
- https://stackoverflow.com/questions/5947742/how-to-change-the-output-color-of-echo-in-linux
