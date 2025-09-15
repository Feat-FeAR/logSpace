---
title: "Bash Strict Mode"
weight: 100
draft: true
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Bash _Strict Mode_
If you haven't learned Bash through formal teaching, but by tinkering around, then you'll probably come up against these issues sooner or later.

## The issue
Unlike all widely used general-purpose programming languages, by default, Bash ignores errors in scripts and continues executing even after a command fails (i.e., returns a non-zero exit status).
Such an _over-forgiving_ behavior may lead to silent failures or hard-to-debug behavior.
To overcome this problem, a best-practice configuration---known as "Strict Mode"---has emerged in the mid 2010s to makes shell scripts more robust, predictable, and safer, especially in production environments.

## Settings
Here are the strict-mode most common options.
```bash
set -euEo pipefail
```
which is a short for
```bash
set -o errexit    # a.k.a. `set -e` (exit-on-error)
set -o nounset    # a.k.a. `set -u` (no-unset option)
set -o pipefail   #                 (exit on within-pipe error)
set -o errtrace   # a.k.a. `set -E` (the `ERR` trap inherited by functions and
                  #                  subshells... and thus by pipes, command
                  #                  substitutions, process substitutions) 
```
All these commands are meant to be set at the beginning of a script, but you wouldn't want to set this for your command-line shell (you don't want a typo to log you out!).

Remember, `set +o ...` disables the option, and `set -o ...` enables it.
A bit counterintuitive, so take care...

## `set -e`
The `set -e` ("exit-on-error") options immediately stops the execution of a script if a command has non-zero exit status (i.e., fails).
This is the opposite of the default shell behavior, which is to _ignore_ errors in scripts.
### grep-like commands
The problem is that __a non-zero exit code not always means an error!__
In particular, if you use `grep` (or `pgrep`, but also `kill` or `pkill`) and __do NOT consider finding no match as an error__, you need to use the following syntax
```bash
grep "<expression>" "<target>" || [[ $? == 1 ]]
```
to prevent `grep` from causing premature termination of the script.
This works since:
- `set -e` is NEVER triggered by the left-hand side of a compound command like `cmd1 || cmd2` or `cmd1 && cmd2` (even if you `set -o pipefail`, see below);
- `[[ $? == 1 ]]` is executed if and only if `grep` fails;
- according to POSIX manual, `grep` exit code 1 means "no lines selected", while exit code > 1 means an error.

For the same reason, if you need to use `ls` you have to do this 
```bash
ls "<files>" 2> /dev/null || [[ $? == 2 ]]
```
However, for these purposes it is recommended to use `find`, which does not suffer from such a problem, since it returns an error only when the target directory is not found (which is a much more unlikely event).
When even the existence of the searching location is uncertain, you can use:
```bash
find "<target_dir>" -type f -name "<files>" 2> /dev/null || [[ $? == 1 ]]
```

The same is true for `which`:
```bash
which <command> 2> /dev/null || [[ $? == 1 ]]
```

### Penetration
Notably, the `-e` option is __inherited automatically by functions and subshells__ `( ... )`, but not by pipes (see next section) and is not effective in command substitutions `$( ... )` and process substitutions `<( ... )`.
This is due to the fact that `set -e` is inherited by the subshell running the substitution (thus, if a command fails inside, the subshell exits early) __BUT__ the parent only sees the exit status of the substitution as a whole, which is usually 0 (e.g., _stdout_ from command substitution is captured successfully).
So the parent shell (i.e., the main script) keeps running unless you explicitly capture or check the exit status.

### Logical tests
Reasonably, commands enclosed within the test of a conditional block (such as `if`, `while`, or `until`) are __always__ excluded from the `set -e` behavior.
E.g.,
```bash
if which <command> > /dev/null 2>&1; then ...; fi
```
is fine, even without `|| [[ $? == 1 ]]`.

Similar to conditional tests, `set -e` is __never__ triggered by the left-hand side of a compound command like `cmd1 || cmd2` (read it as "if not cmd1, then cmd2") or `cmd1 && cmd2` (read it as "if cmd1, then cmd2"), as already stated above.

## Notes on `-o pipefail` option
By default, the exit status of a pipe of many commands is the exit status of the last (rightmost) command in the pipe.
By setting `-o pipefail` the exit status of the first (leftmost) non-zero command of the pipeline is propagated to the end.
However, the remaining commands in the pipeline still run and---if the `-e` option is set---the script will exit at the end of the failing pipeline (to be regarded as a single command).
When using `grep` within a pipeline with both `-o pipefail` and `-e` option set, put the `|| [[ $? == 1 ]]` condition at the end of the pipeline.
```bash
grep "<expression>" "<target>" | command_2 | command_3 || [[ $? == 1 ]] 
```

Notably, `-o pipefail` affects pipes but not process substitutions `<( ... )`, even though they are two very similar things, conceptually.
```bash
#!/bin/bash
set -eo pipefail

cat <(false)
echo "still running?"

false | echo
echo "never run"
```

## Notes on `-o errtrace` option
Although the `set -e` option is by itself sufficient to terminate the script in case of an error, this happens silently, i.e., without any particular messages.
To make failures visible (and possibly and informative) you need to set up an error trap:
```bash
trap '<handler_command>' ERR
```
In this way, whenever a command fails (non-zero exit code), `<handler_command>` is run.
However, unlike the `set -e` option, by default the _ERR trap_ does not penetrate functions and subshells (i.e., it only fires for errors in the main script body).
The option `set -o errtrace` is needed for this behavior be inherited by functions and subshells (and thus by pipes, command substitutions, process substitutions).

As per what we have already said about the penetration of the `-e` option, the following script triggers the _ERR trap_ but does not stop the execution on error!
```bash
#!/bin/bash
set -eo errtrace
trap 'echo "ERR trap fired!"' ERR

# The parent shell only checks the status of the "consumer command" (cat), or
# the capturing of the substituted command. Not the substitution process itself.
cat <(false)
echo $(false)
echo "still running!"
```
The subshell running `false` does inherit the trap (`ERR trap fired!` is printed), but the exit status of a process substitution is not reflected in the pipeline or main script.
The subshell dies with exit code 1, but the parent sees only the cat status (success, 0).
So the script does not exit, even with `-e`.
Same deal for the subsequent command substitution.

In any case, the `set -o errtrace` option has no effect unless you actually define a `trap ERR ... ` somewhere in the script.

Even with errtrace, the ERR trap is not inherited by sourced scripts (`. file` or `source file`).
If you want that, you must explicitly add a trap ERR in the sourced file as well.

## Notes on `-u` option
With the `set -u` option, Bash will treat unset variables as errors.
The existence operator `${:-}` allows avoiding errors when testing variables by providing a default value in case the variable is not defined or empty.
```bash
 result=${var:-value}
```
If `var` is unset or null, `value` is substituted (and assigned to `results`).
Otherwise, the value of `var` is substituted and assigned.
Notice that `var` is a variable name, while `value` is literal string!

## References
http://redsymbol.net/
http://redsymbol.net/articles/unofficial-bash-strict-mode/
https://mywiki.wooledge.org/BashFAQ/105
[Aaron Maxwell](http://redsymbol.net/articles/unofficial-bash-strict-mode/).

Other interesting traps...
```bash
trap '<handler_command>' HUP
trap '<handler_command>' EXIT
trap '<handler_command>' DEBUG
```
set -o functrace (aka set -T)
Normally, a `DEBUG` trap only runs in the main shell execution context.
With `functrace` enabled, `DEBUG` (and `RETURN`) traps are also inherited by:
- functions
- command substitutions (like `$(...)`)
- subshells `( ... )`
So with `functrace`, your debug trap fires everywhere, not just top-level.




set -o functrace → make DEBUG/RETURN traps work inside functions and subshells.
set -o errtrace → make ERR trap fire inside functions and subshells.