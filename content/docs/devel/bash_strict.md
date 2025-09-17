---
title: "Bash Strict Mode"
weight: 100
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Bash Strict Mode
## The issue
Unlike all widely used general-purpose programming languages, by default, __Bash ignores errors in scripts__ and continues executing even after a command fails (i.e., returns a non-zero exit status).
Such an _over-forgiving_ behavior may lead to silent failures or hard-to-debug code.
To overcome this problem, a best-practice configuration---known as the "Strict Mode"---has emerged in the mid 2010s to makes shell scripts more robust, predictable, and safer, especially in production environments.

## Settings
Actually, a few variations of the Strict Mode exist out there, depending on developer preferences.
The following are some of the most typical settings for this Bash mode and the ones I personally use as standard in my scripts.
```bash
set -euEo pipefail
```
which is a short for
```bash
set -o errexit    # a.k.a. `set -e` (exit-on-error)
set -o nounset    # a.k.a. `set -u` (no-unset option)
set -o pipefail   #                 (exit on within-pipe error)
set -o errtrace   # a.k.a. `set -E` (the `ERR` trap is inherited by functions
                  #                  and subshells... and thus by pipes, command
                  #                  substitutions, and process substitutions) 
```
These options are meant to be set __at the beginning of your script__ (e.g., just after the shebang), but you wouldn't want any of them for your command-line shell (because you don't want a typo to log you out the shell!).

Remember that `set +o ...` _disables_ the option, while `set -o ...` _enables_ it... which is a bit counterintuitive, so take care.

## `set -e`
The `-e` ("exit-on-error") options force Bash to immediately stops executing a script if a command has non-zero exit status (i.e., fails), which is the opposite of the default shell behavior.

### Penetration
Notably, the `-e` option is __automatically inherited by functions and subshells__ `( ... )`, but not by pipes (use the _pipefail_ option for this), and it is not effective in command substitutions `$( ... )` and process substitutions `<( ... )`.
This is due to the fact that `set -e` is inherited by the subshell running the substitution (thus, if a command fails inside, the subshell exits early) __BUT__ the parent only sees the exit status of the substitution as a whole, which is usually 0 (i.e., the substitution is captured/consumed successfully).
Because of this, the parent shell (i.e., the main script) keeps running unless you explicitly capture or check the exit status inside the substitution.

### Logical tests
Reasonably, commands enclosed __within the test__ of a conditional block (such as `if`, `while`, or `until`) are __always excluded__ from the `set -e` behavior (since they legitimately can sometimes fail even in a perfectly designed script!).
E.g.,
```bash
#!/bin/bash
set -e

if which "<command>" > /dev/null 2>&1; then
    echo "Exit status = 0: found <command> in PATH"
else
    echo "Exit status = 1: Cannot find <command> in PATH"
fi
```
Similar to conditional tests, `set -e` is __never triggered__ by the left-hand side of a compound command like `cmd1 || cmd2` (read it as "if not cmd1, then cmd2") or `cmd1 && cmd2` (read it as "if cmd1, then cmd2").

### `grep`-like commands
One problem is that __a non-zero exit code not always means an error!__
In particular, if you use `grep` (or `pgrep`, but also `kill` or `pkill`) and __do NOT consider finding no match as an error__, you need to use the following syntax
```bash
grep "<expression>" "<target>" || [[ $? == 1 ]]
```
to prevent `grep` from causing premature termination of the script.
This works since:
1. `set -e` is NEVER triggered by the left-hand side of a compound command like `cmd1 || cmd2` or `cmd1 && cmd2` (even if you `set -o pipefail`, see below);
1. `[[ $? == 1 ]]` is executed if and only if `grep` fails;
1. according to POSIX manual, `grep` exit code 1 means "no lines selected", while exit code > 1 means an error.

For the same reason, if you need to use `ls` you have to do this 
```bash
ls "<files>" 2> /dev/null || [[ $? == 2 ]]
```
However, for these purposes it is recommended to use `find`, which does not suffer from such a problem, since it returns an error only when the target directory is not found (which is a much more unlikely event).
When even the existence of the searching location is uncertain, you can use:
```bash
find "<target_dir>" -type f -name "<files>" 2> /dev/null || [[ $? == 1 ]]
```
As already shown, the same is true for `which`:
```bash
which <command> 2> /dev/null || [[ $? == 1 ]]
```
Finally, remember that you can always opt for this more permissive solution, which effectively disables the `-e` option for one single command:
```bash
<command_that_can_fail> || true
``` 

## `set -o pipefail`
By default, the exit status of a pipe of many commands is the exit status of the last (rightmost) command in the pipe.
By setting `-o pipefail` the exit status of the first (leftmost) non-zero command of the pipeline is propagated to the end.
However, __the remaining commands in the pipeline still run__ and---if the `-e` option is set---the script will exit at the end of the failing pipeline (to be regarded as a single command).

When using `grep` within a pipeline with both `-o pipefail` and `-e` option set, put the `|| [[ $? == 1 ]]` condition at the end of the pipeline.
```bash
grep "<expression>" "<target>" | command_2 | command_3 || [[ $? == 1 ]] 
```

Notably, `-o pipefail` affects pipes but not process substitutions `<( ... )`, even though, from a conceptual point of view, they are two very similar things.
```bash
#!/bin/bash
set -eo pipefail

cat <(false)
echo "still running"

false | cat
echo "never run"
```

## `set -o errtrace`
Although the `-e` option is sufficient on its own to terminate the script in case of an error, this happens _silently_, i.e., without any particular message being printed on screen.
To make failures visible (and possibly and informative) you need to set up an _error trap_:
```bash
trap '<handler_command>' ERR
```
In this way, whenever a command fails (non-zero exit code), the custom `<handler_command>` is run.
However, unlike the `set -e` option, by default the _ERR trap_ does not penetrate functions and subshells (i.e., it only fires for errors in the main script body).
The option `set -o errtrace` is needed for this behavior be inherited by functions and subshells (and thus by pipes, command substitutions, and process substitutions).

As per what we have already said about the penetration of the `-e` option, the following script triggers the _ERR trap_ twice but does not stop the execution on error!
```bash
#!/bin/bash
set -eo errtrace
trap 'echo "ERR trap fired!"' ERR

# The parent shell only checks the status of the "consumer command" (cat), or
# the capturing of the substituted command. Not the substitution process itself.
# So the ERR trap fires, but the script does not exit, even with `-e`.
cat <(false)    # `ERR trap fired!`
echo $(false)   # `ERR trap fired!`
echo "still running!"
```
In any case, the `set -o errtrace` option has no effect unless you actually define a `trap ERR ... ` somewhere in your script!

Also remember that, even with `set -o errtrace`, the _ERR trap_ is __not inherited by sourced scripts__ (`. <file>` or `source <file>`).
If you want that, you must explicitly add a trap in the sourced file as well.

## `set -u`
With the `-u` option, Bash will treat unset variables as errors.
The existence operator `${:-}` allows avoiding errors when testing variables by providing a default value in case the variable is not defined or empty.
```bash
 result=${var:-value}
```
If `var` is unset or null, `value` is substituted (and assigned to `results`).
Otherwise, the value of `var` is substituted and assigned.
Notice that `var` is a variable name, while `value` is literal string!

## Other options
### `set -x`
The `-x` setting is the global equivalent of the `bash -x` option used for debugging scripts.
It enables execution tracing, whereby Bash prints each command (after expansions) to _stderr_ before executing it.

### DEBUG trap
Along with the _ERR trap_, the _DEBUG trap_ is another useful tool for error handling in Bash scripts.
```bash
trap '<handler_command>' DEBUG
```
This command sets up a _line tracker_ that executes a custom `<handler_command>` before every command in the script, with access to Bash variables such as `BASH_COMMAND` (the exact command about to run) and `LINENO` (the line number of that command).
So the _DEBUG trap_ and the `set -x` built-in tracing tool are related in spirit (in that both fire on every command), but _DEBUG trap_ is more customizable and used for advanced logging, profiling, and conditional tracing.
E.g.:
```bash
#!/bin/bash
trap 'echo "DEBUG: about to run $BASH_COMMAND" at line $LINENO.' DEBUG
echo hello
ls
```
Notably, _DEBUG_ and _ERR_ traps can be combined for advanced tracing as I did with the [`_interceptor` function](https://github.com/TCP-Lab/x.FASTQ/blob/main/workers/x.funx.sh) in my [x.FASTQ project](https://github.com/TCP-Lab/x.FASTQ/tree/main).

### `set -o functrace`
Normally, a _DEBUG trap_ only runs in the main shell execution context.
With `-o functrace` (a.k.a. `set -T`) enabled, the _DEBUG_ (and _RETURN_) trap is also inherited by functions and subshells (and thus by command substitutions and process substitutions).
In practice, `-o functrace` does to the _DEBUG trap_ what `-o errtrace` does to the _ERR trap_, i.e., your trap fires everywhere, not just top-level.

### Other traps
Other interesting traps are:
```bash
trap '<handler_command>' EXIT
trap '<handler_command>' RETURN
trap '<handler_command>' HUP
```

###  IFS variable 

### Stricter than strict

## References
http://redsymbol.net/
http://redsymbol.net/articles/unofficial-bash-strict-mode/
https://mywiki.wooledge.org/BashFAQ/105
[Aaron Maxwell](http://redsymbol.net/articles/unofficial-bash-strict-mode/).

