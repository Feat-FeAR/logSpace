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
{{< hint warning >}}
__DISCLAIMER__  

__This is NOT:__
1. a full guide to Git or GitHub
1. an introduction to Git or GitHub
1. a glossary of Git commands
1. a compendium of what I know about Git/GitHub

__This is instead:__
1. a collections of personal notes I took when I started learning Git
1. a commented list of Git commands that I use the most
{{< /hint >}}

## Authentication
Basic authentication by simple password to access repositories on GitHub from
the command line is deprecated and no longer works. 
Instead, when you `git clone`, `git fetch`, `git pull`, or `git push` to a
remote repository two protocols are supported:

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
    (not mandatory but always recommended);
    ```bash
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

1. test your authentication via SSH connection to GitHub.
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
    database_), which makes any Git repository _locally self-contained_. For
    this reason the folder of the local repository can be freely moved in the
    personal filesystem, and Git will keep working smoothly.

- The `.gitignore` file contains all the filenames to be ignored by Git: they
    won't be staged, committed, or pushed in any case, though being in the local
    repository folder.

- At any time, you can use the following commands for monitoring Git:
    ```bash
    git status   # Shows the working tree status
    git diff     # Shows the line-wise changes in files not yet committed
    git show     # Shows the last commit (hash, message, and line-wise diffs)
    git log      # Shows the commit history and hashes (of the current branch)
    git log --patch <file_name>   # Shows commit history and diffs combined
    ```
    {{< hint info >}}
__NOTE__  
Use `git log --oneline` to get a compact version of the log. You can also
combine this option with others. One useful combination adds `--graph` to
display the commit history as a text-based graph and to indicate which commits
are associated with the current `HEAD`, the current branch _main_, or other Git references.
```
git log --oneline --graph
```
{{< /hint >}}

- You can always refer to the _most recent commit_ of the working directory by
    using the identifier `HEAD` or `HEAD~0`, while previous commits in the
    history can be referred to through the syntax `HEAD~<NUM>`, where `<NUM>` is
    the commit order in history, from the top. E.g.,
    ```bash
    # Current still uncommited changes
    git diff
    git diff HEAD
    git diff HEAD~0

    # Changes recorded by the last commit
    git show
    git show HEAD
    git show HEAD~0

    # Changes recorded by the last commit + current still uncommited changes
    # (imagine shifting the time reference 1 commit earlier)
    git diff HEAD~
    git diff HEAD~1

    # Changes recorded by the second to last (i.e., penultimate) commit
    # (imagine shifting the time reference 1 commit earlier)
    git show HEAD~
    git show HEAD~1

    # Changes recorded by the last 2 commits + current still uncommited changes
    # (imagine shifting the time reference 2 commits earlier)
    git diff HEAD~~
    git diff HEAD~2

    # And so on...
    ```
    {{< hint info >}}
__INFO__  
You can also refer to commits using the unique 40-character IDs (aka commit
hashes) for the changes shown, e.g., by `git log` or `git show`.
```
git diff <commit_hash>

# E.g.,
git diff 5c19306cbe5021c51aee993a60ac7a44d8a3f8ca
```
Since typing out random 40-character strings is annoying, Git lets us use just
the first few characters (typically seven for normal size projects):
```
git diff 5c19306
```
Commit hashes are powerful, allowing users to precisely locate commits in the
chain. For example, you can use them in combination with `diff` to inspect the
differences between any two commits.
```
git diff <older_commit_hash>..<later_commit_hash>

# E.g.,
git diff 5c19306..901da28
```
    {{< /hint >}}

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
__NOTE__  
Quite obviously, __project__ overrides __global__ and __global__ overrides
__system__.
    {{< /hint >}}
    
    {{< hint warning >}}
__WARNING__  
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
You can locally clone a repository from two types of URL addresses:
- An __HTTPS__ URL, like `https://github.com/user/repo.git`
- An __SSH__ URL, like `git@github.com:user/repo.git`

To get them, go to any GitHub repository > `Code` > `copy HTTPS` or
`copy SSH`, respectively. E.g.,
```
https://github.com/Feat-FeAR/GATTACA_beta.git     # HTTPS URL
git@github.com:Feat-FeAR/GATTACA_beta.git         # SSH URL
```

To clone (i.e., _copy_) an existing GitHub repository `<git_repo>` into a local
directory `<local_dir>/<git_repo>`, get the `<git_repo_url>` from GitHub,
locally move to the _supposed_ parent directory, and clone the repo.
```bash
cd <local_dir>
git clone <git_repo_url>
```

## Make a New Repository
To create a new GitHub repository `<git_repo>` from scratch you can either use
the __GitHub Web__ graphical interface or choose the __GitHub CLI__ as a fully
command-line alternative.

### GitHub Web
1. go to the
    [_GitHub_](https://github.com/)
    website and log in with your credentials;

1. from `Your profile` > `Repositories` > `New` > set `<git_repo>` as name for
    the new repository > `Create repository`.

### GitHub CLI
1. Install the __GitHub CLI__ (to be installed separately from Git);
    ```bash
    # Example syntax for Arch systems
    sudo pacman -Syu github-cli
    ```

1. create the GitHub public repository `<git_repo>`.
    ```bash
    gh auth login  # Just the first time
    gh repo create <git_repo> --public --source=. --remote=upstream --push
    ```

### Git Local Repo
Regardless of how you chose to create the remote GitHub repository,

1. either `git clone` it locally, or
    - create a local directory `<git_repo>` to contain the new repo;
    - move there and create the repository locally (initialize the local
        _object database_);
        ```bash
        cd <git_repo>
        git init
        ```
    - make the GitHub repository a _remote_ for the local repository;
        ```bash
        git remote add origin git@github.com:<user>/<git_repo>.git
        # E.g.,:
        git remote add origin git@github.com:Feat-FeAR/Kerblam_prototype.git
        ```
        {{< hint info >}}
__NOTE__  
`origin` is a local name used to refer to the remote repository. It could be
called anything, but _origin_ is a convention that is often used by default in
Git and GitHub, so it’s helpful to stick with this unless there’s a reason not
to.
        {{< /hint >}}
    - check the command has worked;
        ```bash
         git remote -v
        ```

1. write some code... and possibly a `README.md`, then _stage_ and _commit_;
    ```bash
    git add .
    git commit -m "<message>"
    ```

1. push the first commit.
    ```bash
    git push --set-upstream origin main
    git push -u origin main
    ```

Similarly, to make a repository from an existing `<project>` folder, create the
GitHub repo beforehand, then
```bash
cd <project>
git init
git remote add origin git@github.com:<user>/<project>.git
git add .
git commit -m "<message>"
git push -u origin main     # To push the first commit only
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
    {{< hint info >}}
__NOTE__  
`git pull` will _synchronize_ your local repository with the remote in terms of
_committed changes_, leaving all the uncommitted changes possibly present in the
local branch untouched, though.
    {{< /hint >}}

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
    {{< hint info >}}
__INFO__  
Sometimes, a _line-wise diff_ is too coarse. That is where the `--color-words`
option of `git diff` comes in very useful as it highlights the changed _words_
using colors (_word-based diffing_).
    {{< /hint >}}

1. Prepare the content for the next commit by adding all changed files to the
    _staging area_,
    ```bash
    git add .
    ```
    or selectively choose single files to stage.
    ```bash
    git add <filename>
    ```
    {{< hint info >}}
__NOTE__  
Once your modified files have been staged, you can still explore/check
line-by-line differences within them by using `git diff --staged`.
    {{< /hint >}}

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
- Discard changes (not yet committed) in working directory.
    ```bash
    git restore <file_name>
    ```

- Restore an older version of `<file_name>` (go back to commit `<commit_hash>`)
    by using `-s` (or `--source=`) option.
    ```bash
    git restore -s HEAD~<NUM> <file_name>
    git restore -s <commit_hash> <file_name>
    ```

- Unstage (i.e., remove from staging area) `<file_name>`.
    ```bash
    git restore --staged <file_name>
    ```
    {{< hint info >}}
__INFO__  
When using `git restore`, by default the _working tree_ is restored. Specifying
`--staged` (`-S`) will only restore the index. Specifying both `--worktree`
(`-W`) and `--staged` (`-S`) restores both.
    {{< /hint >}}

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
    git reset --hard HEAD~<NUM>   # or by using the commit hash

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
    git revert <commit_hash>      # or by using the HEAD~<NUM> syntax
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

{{< hint info >}}
__NOTE__  
In case of linear (or `-<=` branching) commit chains, `git revert` and
`git restore` can be used to produce the same results, i.e.,
```
git restore -s <commit_hash> .
git revert <commit_hash>..HEAD
```
or, even better,
```
git restore --worktree --staged -s <commit_hash> .
git revert --no-commit <commit_hash>..HEAD
```
However, in the case of a branch-Y chain of this type (`=>-`)
```
...--F
      \
       G--H   <-- branch-name (HEAD)
      /
...--E

```
the `git restore` of commit `F` would have no issues, while `git revert` would
go awry when attempting to undo `G` because it is a merge commit and, as such,
it cannot be unambiguously reverted, ultimately leading to a failure.
{{< /hint >}}
> **Refs and additional readings**  
> - [Stack Overflow](https://stackoverflow.com/questions/63661460/difference-between-git-restore-and-git-revert)

## Manage Branches
1. Create a new branch `<new_branch>` __locally__.
    ```bash
    git branch <new_branch>
    ```

1. List branches.
    ```bash
    git branch -l  # [--list]    list local branches (current one marked with *)
    git branch -r  # [--remotes] list remote branches
    git branch -a  # [--all]     list all branches
    ```

1. Switch to a different branch `<new_branch>`, __if the working tree is clean__
    (i.e., nothing to stage or commit).
    ```bash
    git checkout <new_branch>
    ```
    {{< hint info >}}
__NOTE__  
When checking out, the local repository changes to reflect the ___committed___
contents of the new current branch. However, if the destination branch is still
_aligned_ with the current one (no ahead, nor behind by any commits), all your
still-uncommitted changes will be preserved and passed to the new branch. On the
contrary, if the two branches have already diverged, it will be necessary to
stash uncommitted changes before checking out (see ___Stash and Pop___ section
below).
    {{< /hint >}}

1. Push the new branch to the remote repository for the first time.
    ```bash
    git push --set-upstream origin <new_branch>
    # or
    git push -u origin <new_branch>
    ```

1. Go back to main.
    ```bash
    git checkout main
    ```

1. Delete the branch `<old_branch>` __locally__.
    - This only deletes the branch if it has already been fully merged in its
        upstream branch.
        ```bash
        git branch --delete <old_branch>
        # or
        git branch -d <old_branch>
        ```
    - This deletes the branch irrespective of its merged status.
        ```bash
        git branch --delete --force <old_branch>
        # or
        git branch -D <old_branch>
        ```

1. Delete the branch `<old_branch>` __remotely__.
    ```bash
    git push origin --delete <old_branch>
    # or
    git push origin -d <old_branch>
    ```

1. Merge changes from one branch into another.
    ```bash
    git checkout main
    git merge <new_branch>
    git push
    ```
    {{< hint info >}}
__NOTE__  
`git merge` merges the specified branch into the currently active branch. So you
need to be on the branch that you are merging into (i.e., usually the main).
    {{< /hint >}}
    {{< hint warning >}}
__WARNING__  
GitHub usually deletes a branch after merging of a _pull request_, but this
action will delete the branch only in the remote. To clean up your local
references to the remote branches do this:
```bash
# Lists defunct branches that can be deleted/pruned 
git remote prune origin --dry-run
# Actually prune/cleanup the local references 
git remote prune origin
# Check branch status
git branch -a
```
{{< /hint >}}

## Stash and Pop
You can use `git stash` to briefly work on something else without committing,
but saving, your current changes.

- Stash the changes in a dirty working directory away.
    ```bash
    git stash
    ```

- See the stashes currently stored in the stack.
    ```bash
    git stash list
    ```

- See the files that changed in `stash@{n}`, where `n` is an integer from 0
    (i.e., the most recent stash) to the index of the oldest stored stash.
    ```bash
    git stash show stash@{n}
    git stash show               # Equivalent to 'git stash show stash@{0}',
                                 # will show you the files that changed in your 
                                 # most recent stash.
    
    git stash show -p stash@{n}  # Line-by-line differences in changed files
    git stash show -p            # Default to the most recent stash (stash@{0})
    ```

- Reapply any of the stacked stashes (restore changes).
    ```bash
    git stash apply stash@{n}
    git stash apply              # Equivalent to 'git stash apply stash@{0}',
                                 # will apply the most recent stash.
    ```

- Remove a single stash from the stack.
    ```bash
    git stash drop stash@{n}
    ```

- Delete all of the stashes at once (clear the stack).
    ```bash
    git stash clear
    ```

- Apply the stash and then immediately drop it from your stack.
    ```bash
    git stash pop
    ```

- When an old stash is hard to be cleanly reapplied due to the many changes
    occurred in time, you can type
    ```bash
    git stash branch <test_branch_name>
    ```
    and Git will create a new branch `<test_branch_name>` for you, check out the
    commit you were on when you stashed your work, reapply your work there,
    and then drop the stash if it applies successfully.

    {{< hint info >}}
__NOTE__  
You can save a stash on one branch, switch to another branch, and try to reapply
the changes (as a practical way to _move changes_ from one branch to another).
You can also have modified and uncommitted files in your working directory when
you apply a stash: Git gives you merge conflicts if anything no longer applies
cleanly.
    {{< /hint >}}

You may not want to stash some work or files in your working directory, but
simply get rid of them. The `git clean` command will do this for you.
```bash
git clean         # Remove all the untracked files in your working directory
git clean -f -d   # Remove any files and also any subdirectories that become
                  # empty as a result. -f means 'force'.
git clean -d -n   # [--dry-run] Don't actually remove anything,
                  # just show what would be done.
git clean -i      # Use the "interactive" flag to step through each file
                  # individually or specify patterns for deletion interactively.
```
{{< hint danger >}}
__DANGER__  
You'll want to be pretty careful with this command, since it is designed to
remove files from your working directory that are not tracked.
{{< /hint >}}

## Tips
___Alerts___ are an extension of Markdown used to emphasize critical
information. On GitHub, Alerts (e.g., from README files) are displayed with
distinctive colors and icons to indicate the importance of the content. An
example of all five types:
```
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
```
While [here](https://github.com/orgs/community/discussions/16925) you can find
how they are displayed on GitHub.
