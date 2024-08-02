---
title: "Git & GitHub"
weight: 10
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Git and GitHub
WARNING:
This is NOT:
1. a full guide to Git or GitHub
1. an introduction to Git or GitHub
1. a glossary of Git commands

This is:
1. a collections of personal notes taken when I started learning Git
1. a list of Git commands that I use the most

## Authentication
Basic authentication to GitHub using a simple password is deprecated and no
longer works. To _clone_, _commit_, and _push_, two protocols are supported:
- __HTTPS__: you can use a classic Personal Access Token (PAT). PATs function
    like ordinary OAuth access tokens and can be used instead of a password for
    Git over HTTPS.
- __SSH__: you can connect to GitHub with SSH adding a new password-protected
    SSH key to your GitHub account. This is the recommended way, because it
    allows more agile Git operations prompting authentication only once per
    session.

To configure SSH
1. check for existing SSH keys (within `~/.ssh/`);
1. if none exists (or if you want to overwrite it), create one with passphrase
    (not obligatory but always recommended) in this way:
    ```bash
    # Create the key through ssh-keygen
    # -t ed25519: The -t flag is used to indicate the algorithm to
    #             create the digital signature of the key pair. If your
    #             system supports it, ed25519 is the best algorithm you
    #             can use to create SSH key pairs.
    # -C “email”: The -C flag is used to provide a custom comment at the
    #             end of the public key, which usually is the email or
    #             identification of the creator of the key pair.
    ssh-keygen -t ed25519 -C "federicoalessandro.ruffinatti@unito.it"

    # Start the ssh-agent in the background
    eval "$(ssh-agent -s)"

    # Add your SSH private key to the ssh-agent
    ssh-add ~/.ssh/id_ed25519

    # Copy the SSH public key to your clipboard from:
    cat ~/.ssh/id_ed25519.pub
    ```
1. add the SSH key to your account on GitHub web site:
    `<your profile>` > `Settings` > `SSH and GPG keys` in the _Access_ section >
    `New SSH key` > add a title (usually, the device you’ll use that key from)
    and select `Authentication Key` as key type > paste your key into the _Key_
    field (including the "-C" comment) > `Add SSH key`;
1. test your SSH connection
    ```bash
    ssh -T git@github.com
    ```
    This message means that the operation was successful:
    ```
    Hi <user_name>! You've successfully authenticated, but GitHub does not
    provide shell access.
    ```

## General
- All Git info is locally stored in the `.git` folder (i.e., the _object
    database_). For this reason the folder of the local repository can be freely
    moved in the personal filesystem, and Git will keep working smoothly.
- The `.gitignore` file contains all the filenames to be ignored by Git: they
    won't be staged, committed, or pushed in any case, though being in the local
    repository folder.
- Monitoring Git:
    ```bash
    git status   # To show the working tree status
    git log      # To view the Commit History and hash (of the current branch)
    ```
- There are 3 levels of Git configuration settings:
    - __project__: only available for the current project and stored in the
        `.git/config` file within the project's directory. This is the default
        level for each `git config` command executed under the project's
        directory: 
        ```bash
        git config <setting> <option>
        ```
    - __global__: available for all projects for the current user and stored in
        `~/.gitconfig` file.
        ```bash
        git config --global <setting> <option>
        ```
    - __system__: available for all the users/projects and stored in
        `/etc/gitconfig`.
        ```bash
        git config --system <setting> <option>
        ```
    {{< hint info >}}
**NOTE**  
Quite obviously, __project__ overrides __global__ and __global__ overrides
__system__.
    {{< /hint >}}
    {{< hint warning >}}
**WARNING**  
__Project__ configs are local to just one particular copy/clone of any given
repo, and need to be reapplied if the repo is recloned clean from the remote;
`git config` command changes a local file that is not sent to the remote with a
commit/push action.
    {{< /hint >}}

## Configuration Settings
- List and check all configuration settings:
    ```bash
    git config -l # [--list]
    ```
- Set the following global options, otherwise you'll be asked for upon the first
    commit:
    ```bash
    git config --global user.email "federicoalessandro.ruffinatti@unito.it"
    git config --global user.name "Federico Alessandro Ruffinatti"
    ```
- Set ___Nano___ as the default text editor for commit messages. When you create
a Git commit, the default editor that will be opened is ___Vim___. This can be
very confusing for people that have never worked with it previously. However,
default text editor can be changed in this way:
    ```bash
    git config --global core.editor "nano"
    ```
- Line ending: Git has a configuration setting called `core.autocrlf` which is
    specifically designed to make sure that, when a text file is written to the
    repository's object database, all line endings in that text file are
    normalized to `LF` (i.e., the standard _de facto_ eol in Git and GitHub).
    The `core.autocrlf` setting variable can take three possible values:
    - `core.autocrlf=false` Default behavior. Don't do anyting to eols: all
                            types of line endings are left untouched by Git. 
    - `core.autocrlf=true`  Line endings of text files are converted to Unix
                            style (`LF`) when writing to the object database
                            (e.g., by `git commit`), however `LF` are turned
                            back into `CR` `LF` when writing out into the
                            working directory.
    - `core.autocrlf=input` Line endings of text files are converted to Unix
                            style `LF` when writing to the object database
                            (e.g., by `git commit`), and no reverse conversion
                            is performed when writing out into the working
                            directory.
    
    For any Linux project use the following settings at `project level` (to be
    execute under the local project's directory):
    ```bash
    git config core.autocrlf input  # See above
    git config core.eol lf          # When Git needs to change line endings to
                                    # write a file in your working directory
                                    # (e.g., by `git checkout`, `git pull`,
                                    # `git clone`) it will always use LF to
                                    # denote end of line.
    ```
    {{< hint info >}}
**NOTE**  
Since the __project__ level overrides the __global__ one, you can keep the
default options (i.e., `core.autocrlf=false` and `core.eol=native`) at global
level.
    {{< /hint >}}
    > **Refs and additional readings**  
    > - [Stack Overflow](https://stackoverflow.com/questions/9976986/force-lf-eol-in-git-repo-and-working-copy)
    > - [Adaptive Patchwork](https://adaptivepatchwork.com/2012/03/01/mind-the-end-of-your-line/)

 ## Locally Clone a Repository
Copy an existing Git repository `<git_repo_url>` into a local directory
`<local_dir>/<git_repo>`
```bash
cd <local_dir>
git clone <git_repo_url>
```
To get `<git_repo_url>`, go to a GitHub repository > `Code` > `copy HTTPS` or
`copy SSH`. E.g.,
```bash
git clone https://github.com/Feat-FeAR/GATTACA_beta.git     # HTTPS
git clone git@github.com:Feat-FeAR/GATTACA_beta.git         # SSH
```

## Make a New Repository
### GitHub Web
To create a new repository `<git_repo>` from scratch, create it from the GitHub
web site, then
- clone it locally and work on it.
- alternatively,
    1. create a directory `<git_repo>` to contain the new repo and move there
    1. create the repository locally (initialize the local object database)
        ```bash
        cd <git_repo>
        git init
        ```
    1. initialize the remote repository on GitHub
        ```bash
        git remote add origin git@github.com:<user>/<git_repo>.git
        # E.g.,:
        git remote add origin git@github.com:Feat-FeAR/Kerblam_prototype.git
        ```
    1. write some code... and possibly a `README.md`, then _stage_ and _commit_
        ```bash
        git add .
        git commit -m "<message>"
        ```
To make a repository from an existing folder
```bash
git init
git remote add origin git@github.com:<user>/<git_repo>.git
git add .
git commit -m "<message>"
```
Create a repository `<git_repo>` from the GitHub web site and then push the
first commit
```bash
git push --set-upstream origin main
git push -u origin main
```

### GitHub CLI
__GitHub CLI__ (to be installed separately) allows doing everything from the
command line
```bash
gh auth login # Just the first time
gh repo create <git_repo> --public --source=. --remote=upstream --push
```
Make a repository from an existing folder
```bash
git init
git remote add origin git@github.com:<user>/<git_repo>.git
git add .
git commit -m "<message>"
```
Use GitHub CLI to create the repository `<git_repo>`, then push the first commit
```bash
git push --set-upstream origin main
git push -u origin main
```





## Stage, Commit, and Push
The most standard Git workflow is made up of the following few steps. After each
one of them you can always run
```bash
git status
```
to check if you are behind or ahead of 'origin/main' by any commits, or to list
changed files or the changes staged to be committed.

1. Move to the working directory (i.e., the Git local repository folder).
    ```bash
    cd <local_dir>/<git_repo>
    ```

1. Fetch from the remote repository and _integrate_ with the local branch.
    ```bash
    git pull
    ```
    Note that this is not a _synchronization_ procedure, since all the
    uncommitted changes in the local branch are preserved by `git pull`.

1. Make changes to one or multiple project files. The best practice here is to
    work on just __one feature per commit__.

1. Explore/check line-by-line differences in all changed files,
    ```bash
    git diff
    ```
    or within a single file, 
    ```bash
    git diff <filename>
    ```
    where `<filename>` is the file path relative to the project directory, as
    shown by `git status`.

1. Prepare the content for the next commit by adding all changed files to the
    _staging area_,
    ```bash
    git add .
    ```
    or selectively choose single files to stage.
    ```bash
    git add <filename>
    ```

1. Record changes to the local repository,
    ```bash
    git commit
    ```
    then fill out a _commit message_ using the default text editor (e.g., Vim,
    Nano, Notepad++, ...), save, and quit. Alternatively, use the option `-m` to
    do it all in one.
    ```bash
    git commit -m "Here my (short) message"
    ```

1. Possibly, check the commit(s).
    ```bash
    git log
    ```

1. Make other changes and/or stage other files (go back to points 3 or 5,
    respectively).

1. Publish all your local commits at once (i.e., update remote refs).
    ```bash
    git push
    ```

## Undos
- Discard changes in working directory.
    ```bash
    git restore <file_name>
    ```

- Unstage (i.e., remove from staging area) `<file_name>`.
    ```bash
    git restore --staged <file_name>
    ```

- Remove the last commit __from the local Git__.
    ```bash
    git reset --hard HEAD^
    ```
    Remove `--hard` to uncommit but keep the changes around for reworking.
    ```bash
    git reset HEAD^
    ```

- Remove from the local Git multiple commits __from the top__.
    ```bash
    git reset --hard HEAD~<NUM>

    # E.g.:
        git reset --hard HEAD~3   # removes the last three commits
        git reset --hard HEAD~1   # is equivalent to HEAD^
    ```
    Remove `--hard` to uncommit but keep the changes around for reworking.
    ```bash
    git reset HEAD~<NUM>
    ```

- Revert individual pushed commits __from remote__.
    ```bash
    git revert <commit_hash>
    git push
    ```
    {{< hint info >}}
__INFO__  
Actually, this will create a new commit (needing to be pushed) which reverts the
changes of `<commit_hash>`.
    {{< /hint >}}
    {{< hint warning >}}
__WARNING__  
This only reverts that specific commit, and not all other commits that come
after that!
    {{< /hint >}}

- Revert all the pushed commits after `<oldest_commit_hash>` up to and including
    `<latest_commit_hash>`.
    ```bash
    git revert <oldest_commit_hash>..<latest_commit_hash>
    git push
    ```
    {{< hint warning >}}
__WARNING__  
On some versions of Git it also reverts the `<oldest_commit_hash>`, so double
check if that commit gets reverted or not.
```bash
git log
git status
```
{{< /hint >}}





## Manage Branches

```bash
    # Create a new branch <new_branch> locally
    git branch <new_branch>

    # List branches 
    git branch -l # [--list] list local branches (current one marked with a *)
    git branch -r # [--remotes] list remote branches
    git branch -a # [--all] list all branches

    # Switch to a different branch <new_branch> (if the working tree is clean)
    git checkout <new_branch>
    # A '(<new_branch>)' label should appear at the end of the prompt when using
    # 'Git Bash'

    # Push the new branch to the remote repository for the first time
    git push --set-upstream origin <new_branch>
    git push -u origin <new_branch>

    # Go back to main
    git checkout main

    # Delete the branch <old_branch> locally:
    #  - This only deletes the branch if it has already been fully merged in its
    #    upstream branch.
    git branch --delete <old_branch>
    git branch -d <old_branch>
    #  - This deletes the branch irrespective of its merged status.
    git branch --delete --force <old_branch>
    git branch -D <old_branch>
        git branch --list # Check it out

    # Delete the branch <old_branch> remotely
    git push origin --delete <old_branch>
    git push origin -d <old_branch>
        git branch --list # Check it out

    # Merge changes from one branch into another.
    # NOTE: 'git merge' merges the specified branch into the currently active
    #       branch. So you need to be on the branch that you are merging into
    #       (i.e., usually the main).
    git checkout main
    git merge <new_branch>
    git push
```
{{< hint info >}}
**NOTE**  
When checking out, the local repository changes automatically to reflect the
(committed) content of the new current branch + all your still-uncommitted
changes!
{{< /hint >}}


{{< hint warning >}}
**WARNING**  
GitHub usually deletes a branch after merging of pull request, but this
action will delete the branch only in the remote. To clean up your local
references to the romote branches do this
```bash
# Lists defunct branches that can be deleted/pruned 
git remote prune origin --dry-run

# Actually prune/cleanup the local references 
git remote prune origin

# Check brach status
git branch -a
```
{{< /hint >}}




## Stash and Pop

- You can use <git stash> to briefly work on something else without committing,
    but saving, your current changes.
    ```bash
        # Stash the changes in a dirty working directory away
        git stash

        # See the stashes currently stored in the stack
        git stash list

        # See the files that changed in stash@{n}, where n is an integer from 0
        # (i.e. the most recent stash) to the index of the oldest stored stash
        git stash show stash@{n}
        git stash show # equivalent to 'git stash show stash@{0}', will show you
                       # the files that changed in your most recent stash.
        git stash show -p stash@{n} # Line-by-line differences in changed files
        git stash show -p # Default to the most recent stash (stash@{0})

        # Reapply any of the stacked stashes (restore changes)
        git stash apply stash@{n}
        git stash apply # equivalent to 'git stash apply stash@{0}', will apply
                        # the most recent stash.

        # Remove a single stash from the stack
        git stash drop stash@{n}

        # Delete all of the stashes at once (clear the stack)
        git stash clear

        # Apply the stash and then immediately drop it from your stack
        git stash pop

        # When an old stash is hard to be cleanly reapplied due to the many
        # changes occurred in time, you can type
        git stash branch <test_branch_name>
        # Git creates a new branch for you, checks out the commit you were on
        # when you stashed your work, reapplies your work there, and then drops
        # the stash if it applies successfully.
    ```

{{< hint info >}}
**NOTE**  
You can save a stash on one branch, switch to another branch later, and
try to reapply the changes (as a practical way to 'move changes' from
one branch to another). You can also have modified and uncommitted files
in your working directory when you apply a stash: Git gives you merge
conflicts if anything no longer applies cleanly.
{{< /hint >}}

- You may not want to stash some work or files in your working directory, but
    simply get rid of them. The <git clean> command will do this for you. You'll
    want to be pretty careful with this command, since it's designed to remove
    files from your working directory that are not tracked...
    ```bash
        git clean # Remove all the untracked files in your working directory
        git clean -f -d # Remove any files and also any subdirectories that become
                        # empty as a result. -f means 'force'.
        git clean -d -n # [--dry-run] Don't actually remove anything,
                        # just show what would be done.
        git clean -i # Use the "interactive" flag to step through each file
                     # individually or specify patterns for deletion interactively.
    ```





## Tips

Alerts are an extension of Markdown used to emphasize critical information. On
GitHub, they are displayed with distinctive colors and icons to indicate the
importance of the content. An example of all five types:


> [!NOTE]  
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

