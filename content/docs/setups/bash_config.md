---
title: "Bash Config"
weight: 20
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Bash Customization

## GNU nano
### Colors
Enable colors in ___GNU nano___ by editing `/etc/nanorc`:
```sh
sudo nano /etc/nanorc
```
1. To color the interface elements in ___nano___, locate the section 
    ```sh
    ## Paint the interface elements of nano.
    ```
    and uncomment all (or some of) the lines below it.

1. To enable syntax highlighting, uncomment the following line under the section  
    `## === Syntax coloring ===` :
    ```sh
    ## To include most of the existing syntax definitions, you can do:
    include "/usr/share/nano/*.nanorc"
    ```

1. Check it by opening, e.g., the Bash startup configuration file in your home:
    ```sh
    nano ~/.bashrc
    ```
### Text
1. Enable word wrapping by uncommenting this line:
    ```sh
    ## Spread overlong lines over multiple screen lines.
    set softwrap
    ```
    {{< hint warning >}}
__WARNING__  
___Nano___ supports two different forms of line wrapping:
- _soft_ line wrapping (toggled by `Alt`+`$`), which is is purely visual (i.e., it wraps lines without inserting line break characters into the file);
- _hard_ line wrapping (toggled by `Alt`+`L`, which wraps lines by inserting line breaks into the file.
__In this case the file is physically changed, and likely broken in the case of files where wraps are meaningful, such as scripts, config files, or source codes.__
{{< /hint >}}

1. To avoid mistakes with (soft) word wrapping, it is recommended to also enable line numbering by uncommenting this line:
    ```sh
    ## Display line numbers to the left (and any anchors in the margin).
    set linenumbers
    ```

### Issues
If you're having trouble pasting in ___nano___ __non-ASCII Unicode characters__ like `Ʌ†┌──💀`, it might be due to [this well known issue](https://bbs.archlinux.org/viewtopic.php?id=311249) with Plasma desktop, which corrupts UTF-8 encoding.
As per the official [_Arch Linux Wiki_](https://wiki.archlinux.org/title/KDE#Plasma_desktop_does_not_respect_locale/language_settings), try to log out and log in after removing `~/.config/plasma-localerc`.

## Bash prompt
### Prompt variables
In Bash, the shell prompt is mainly controlled through a few special _shell variables_: `PS0`, `PS1`, `PS2`, `PS3`, `PS4`.
Bash displays (actually _expands_) the primary prompt `PS1` when it is ready to read a command, and the secondary prompt `PS2` when a command continues on the next line.
`PS3` is for selection inputs, while `PS4` is used in debug mode.
`PS0` is a less known and less commonly used prompt variable: it is expanded after Bash reads a command and before the command is executed.

| Variable Name | Purpose                       | Default String    |
|:-------------:|:------------------------------|:------------------|
|`PS0`          | Pre-execution prompt          | _none_            |
|`PS1`          | __Primary prompt__            | `'[\u@\h \W]\$ '` |
|`PS2`          | __Secondary prompt__          | `'> '`            |
|`PS3`          | Prompt for `select` loops     | _none_            |
|`PS4`          | Debug/Trace prompt (`set -x`) | `'+ '`            |

Check the current value of Bash primary prompt:
```sh
echo $PS1
```
or all prompts
```sh
set | grep '^PS'
```
{{< hint info >}}
__NOTE__  
`set` and `env` are used to list all the currently assigned _shell_ and _environment_ variables, respectively.
While environment variables are inherited by all child processes (including sub-shells), shell variables are not (i.e., they exist only inside the current shell).
A shell variable becomes an environment one when exported through the `export` command.
Normally, __prompt variables are just _shell_ variables__ but, even when we want to make them available to child processes, __they do not need to be exported__.
This is because they are typically encoded in the `~/.bashrc` startup file (or in some other config file), which is used by any new sub-shell to reinitialize prompt-related settings (see below).
{{< /hint >}}

In addition, there is also the related `PROMPT_COMMAND` shell variable, which stores a command to be executed _before_ Bash displays `PS1`.
This is very commonly used for:
- dynamic prompts
- updating terminal titles
- Git branch information
- timers
- status checks

A possible default value for terminal title updating, as returned by my `echo $PROMPT_COMMAND`, is:
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
| `\t`     | Time, 24-hour `HH:MM:SS` format |
| `\T`     | Time, 12-hour `HH:MM:SS` format |
| `\@`     | Time, 12-hour AM/PM format |
| `\A`     | Time, 24-hour `HH:MM` format |
| `\!`     | History number |
| `\$`     | `#` if root, `$` otherwise |
| `\n`     | Newline |
| `\a`     | Bell character |
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
These variables are frequently referenced in prompt definitions through the usual _variable expansion_ `$` syntax.

| Variable | Meaning |
|:--------:|---------|
| `USER` | Current username |
| `HOSTNAME` | Hostname |
| `PWD` | Current directory |
| `HOME` | Home directory |
| `OLDPWD` | Previous directory |
| `SHLVL` | Shell nesting level |
| `TERM` | Terminal type |

{{< hint info >}}
__NOTE__  
To make context variables to be evaluated _each time PS* is used_ it is important to reassign prompts by using single quotes (e.g., `PS1='...'`), otherwise the expression will be evaluated once, as soon as `~/.bashrc` is run, and the result is substituted forever after.
As an alternative, you can use double quotes and escape all the variable expansions that need to be evaluated regularly at prompt-time (e.g., `"\${PWD}"`).
The same is true for _command substitution_ (see below).
{{< /hint >}}

### Commands outputs
The output of any Bash command can be shown in the prompt by using the usual _command substitution_ `$(...)` syntax .
For example:
```sh
PS1='$(date)>'
```

### Color handling
For an explanation of how colors are defined in Bash through ANSI escape sequences, see <a href="../../devel/bash_colors/index.html">this section</a>.

When used in prompt variables, non-printing characters must be wrapped in `\[` and `\]` to tell Bash that these characters do not take screen space.
Without them, cursor positioning and line editing can become broken.

Example:
- in regular usage: `\033[32mThis is in green\033[0m`
- in PS0/1/2/3/4: `\[\033[32m\]This is in green\[\033[m\]`

So any colored text line in prompt definition will look like this:
```sh
\[\e[1;34m\]"anything"\[\e[0m\]
```
Breaking it down
```sh
\[        # Color sequences in prompt are enclosed in escaped square brackets
  \e[     # Start of color tag
    1;34  # Color pair x;y to use (bold;blue)
  m       # End of color tag
\]
"anything" # Characters, specials, or some command output 
\[\e[0m\]  # End of color change (back to default color scheme)
```
{{< hint info >}}
__NOTE__  
Although most terminals now support the <a href="../../devel/bash_colors/index.html#truecolor-24-bit-rgb">24-bit RGB TrueColor specification</a>, in most cases it is much more practical to use the 8 basic colors (`\[\e[30-37m\]`) and then apply a _theme_ to the console to get more refined color palettes.
{{< /hint >}}

### Kali-style prompt
Here is an example of custom prompt.
Since I've always found the Kali Linux prompt cool, I tried to replicate it in my shell, but with a few tweaks and improvements:
```sh
# To paste into ~/bashrc

_set_prompt () {

  if [[ ${SHLVL} == 1 ]]; then
    local lvl_str="1;34m\]level 1"
  elif [[ ${SHLVL} == 2 || ${SHLVL} == 3 ]]; then
    local lvl_str="1;3${SHLVL}m\]level ${SHLVL}"
  else
    local lvl_str="1;31m\]level ${SHLVL}"
  fi

  PS1="\n\[\e[1;35m\]┌──(\[\e[1;36m\]\u\[\e[1;35m\]_Ʌ†_\[\e[1;36m\]\h\[\e[1;35m\])──[\[\e[${lvl_str}\[\e[1;35m\]]──[\[\e[\$(code=\$?; [ \$code == 0 ] && echo \"1;34m\]exit \${code}\" || echo \"1;31m\]exit \${code}\")\[\e[1;35m\]]──[\[\e[1;34m\]\w\[\e[1;35m\]]\n\[\e[1;35m\]└─\[\e[1;36m\]\$ \[\e[0m\]"
}

_set_prompt
```
Breaking it down:
```sh
_set_prompt () {} # Function to define local variables
                  # (not to interfere with global environment).

if [[ ... ]]; fi  # Tag about (sub)-shell level, with color-coded levels.
                  # External to PS1 to prevent the exit code from being
                  # overwritten by `echo` commands.
                  # This is evaluated only at shell startup... which is fine to
                  # store the (sub)-shell level, since each newly spawned
                  # sub-shell reads `~/.bashrc` at startup!

PS1=" ... "       # Prompt assignment by double quotes (allows early expansions)

\n                # New line

\[\e[1;35m\]      # Color tag (escaped as per prompt variable)
  ┌──(            # Connectors (text)

\[\e[1;36m\]
  \u              # Username

\[\e[1;35m\]
  _Ʌ†_            # Cool replacement for @ symbol

\[\e[1;36m\]
  \h              # Hostname

\[\e[1;35m\]
  )──[            # Connectors

\[\e[${lvl_str}   # Level-tag expansion


\[\e[1;35m\]
  ]──[            # Connectors

\[\e[             # In-line conditional color tag.
                  # Herein, we need to escape everything we want to send
                  # "verbatim" to PS1 (`$` and `"` need to be present in the
                  # prompt definition as such to enable the on-line evaluation
                  # and expansion of the exit code... check with "echo $PS1"!).
  \$(             # Command substitution (executed in sub-shell...
    code=\$?;     # ...so this <--- won't pollute the global environment).
                  # Grab the status as soon as you can, not to be overwritten
                  # by the outcome of test operator.
    [ \$code == 0 ]                      # If exit-status == 0; then
      && echo \"1;34m\]exit \${code}\"   # show zero exit status in blue; else
      || echo \"1;31m\]exit \${code}\"   # show non-zero exit status in red
  )

\[\e[1;35m\]
  ]──[          # Connectors

\[\e[1;34m\]
  \w            # Current working directory

\[\e[1;35m\]
  ]\n           # Connector + new line

\[\e[1;35m\]
  └─            # Connector

\[\e[1;36m\]
  \$            # $ or # for normal user or root, respectively.

\[\e[0m\]       # Remove all attributes (formatting and colors).
```
{{< hint info >}}
__NOTE__  
Provided that a proper encoding (usually UTF-8) has been set correctly system-wide, all Unicode symbols can be used for prompt literal text, including emoji symbols like 💀 or similar! 
{{< /hint >}}

### Persisting changes
To test a custom prompt, you can save the contents of the current prompt variable into a backup variable and then reassign it with a new value.
```sh
`DEFAULT=$PS1`
PS1='custom_prompt'
```
However, to make this changes permanent and shared with child processes (sub-shells), prompt variable definitions are to be stored within some startup file.
In particular, prompt settings are usually placed in one of these files:
- `~/.bashrc`, per-user settings
- `~/.bash_profile`, per-user settings
- `/etc/bash.bashrc`, for system-wide settings

Open the `~/.bashrc` file in a text editor, locate the _PS1=_ section, and replace the default variable with your customized variable.
Finally, save the file, close your text editor, and
```sh
source ~/.bashrc
```

### References
> [Arch Linux Wiki](https://wiki.archlinux.org/title/Bash/Prompt_customization)

## Custom commands
### Aliases
_Alias_ is a command, which enables a replacement of a word with another string.
It is often used for abbreviating a system command, or for adding default arguments to a regularly used command.

Personal aliases can be made persistent by storing them in `~/.bashrc` or any separate file sourced from `~/.bashrc`.
System-wide aliases (which affect all users) belong in `/etc/bash.bashrc`.
As an example, here is a list of the aliases I use the most.
```sh

alias ls='ls --color=auto'
alias ll='ls -hal'   # Human Long-format list of All files

alias please='sudo $(fc -ln -1)'   # Run the previous command as admin
alias fuck="please"   # ...the same, but with a better sense of control

# NOTE: the previous only works for simple commands. If the command contains
# redirections or pipes, you need to invoke a shell under sudo:
alias please='sudo "$BASH" -c "$(history -p !!)"'

alias myip='curl ipinfo.io/ip'   # Print my public IP
alias joke="curl https://icanhazdadjoke.com"   # Have a joke!
```

### Shell functions
In `~/.bashrc` you can also define shell functions, and they behave like _custom commands_ available in your interactive shell.
Functions are often better than aliases when you need logic, arguments, conditionals, local variables, or commands like `cd`.
{{< hint info >}}
__NOTE__  
Because a Bash function runs inside the current shell, it can do:
```sh
cd somewhere
```
and your current terminal session really changes directory.
A standalone script usually cannot do that, because it runs in a child process.
{{< /hint >}}

Since `history` stores commands---not their output---Bash does not automatically remember the output of the previous command.
As an example, here is a powerful function that allow the user to move to location of the last returned file or directory.
```sh
# Move to the directory of the last queried file or directory
gothere () {
  # Get previous command, excluding this gothere invocation
  # Also remove leading and trailing whitespaces
  local last_cmd="$(
    HISTTIMEFORMAT= history 2 |
    head -n 1 |
    sed -E 's/^[[:blank:]]*[0-9]+[[:blank:]]+//' |
    sed -E 's/[[:blank:]]*$//')"

  # Safety layer to avoid rerun dangerous commands
  if [[ "${1:-}" != -u || "${1:-}" != --unsafe ]]; then
    local safe_cmd='^(ls|ll|which|find)([[:blank:]]|$)' # List of allowed commands
    local unsafe_syntax='([;&|`<>]|-exec|-delete)' # List of unsafe characters

    if [[ ! "$last_cmd" =~ $safe_cmd ]]; then
      echo "Cannot go. Last command in history could be unsafe:" >&2
      echo "   $last_cmd" >&2
      return 1
    fi

    if [[ "$last_cmd" =~ $unsafe_syntax ]]; then
      echo "Cannot go. Last command in history contains shell metacharacters:" >&2
      echo "   $last_cmd" >&2
      return 1
    fi
  fi

  # Get the output of the last command
  # (in case of multi-line output, use the last one)
  last_cmd="$(echo "${last_cmd}" |
    sed -E 's/(^ll[[:blank:]]+|^ls[[:blank:]]+)/ls -d -- /')" # Adjust the output
  local last_output="$(eval "${last_cmd}" | sed '/^[[:space:]]*$/d' | tail -n 1)"
  if [[ -d "$last_output" ]]; then
      cd -- "$last_output" || {
        echo "Failed to change directory." >&2
        return 1
      }
  elif [[ -f "$last_output" ]]; then
      cd -- "$(dirname "$last_output")" || {
        echo "Failed to change directory." >&2
        return 1
      }
  else
      echo "Not a valid directory or file:" >&2
      echo "   $last_output" >&2
      return 1
  fi
}
```
{{< hint danger >}}
__DANGER__  
__Using `eval` on shell history has to be considered an _unsafe and dangerous_ approach because it actually re-executes a previous command, which can be risky and surprising__.
For instance, if your previous command collaterally moved or removed some file, then `gothere` will do it again.
The `find` command itself can run actions like `-exec`.
Even if a basic safety layer is implemented in the function, it is pretty much heuristic and in any case it can be suppressed by the `-u | --unsafe` option.
__So use this function at your own risk and always keep in mind that it may run something other than what you mentally think it is running!__

But then again, it’s also true that, as adults, we're exposed every day to the risks posed by the tools we choose to use.
{{< /hint >}}
