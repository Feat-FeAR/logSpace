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

<div>
<br>
<table style="border-collapse: collapse; width: 85%; margin: auto;">
  <tr>
    <td style="border: none;">
        {{< figure src="/images/Git_logo.png" title="Git logo" width=300 >}}
    </td>
    <td style="border: none;">
        {{< figure src="/images/GitHub_logo.png" title="GitHub logo" width=370 >}}
    </td>
  </tr>
</table>
</div>


> ## __DISCLAIMER__ (with External Refs)
>
> __This is NOT:__
> 1. __a full guide to Git.__  
>   And how could it be? However, the
>   [official Git documentation](https://git-scm.com/docs) is freely available
>   online, along with the popular
>   [Pro Git book](https://git-scm.com/book/en/v2)).
> 1. __a structured and friendly introduction to Git or GitHub.__  
>   Examples include the _Version Control with Git_ lesson provided by the
>   [Software Carpentry](https://swcarpentry.github.io/git-novice/)
>   or the
>   [Happy Git and GitHub for the useR](https://happygitwithr.com/)
>   web book by Jenny Bryan.
> 1. __a glossary of all Git commands.__  
>   But such a [complete list of Git commands](https://git-scm.com/docs/git#_git_commands)
>   can be easily accessed from the official website.
> 1. __even a Git/GitHub cheat sheet.__  
>   Luckily, both [printable](https://training.github.com/)
>   and [interactive](https://ndpsoftware.com/git-cheatsheet.html#loc=index;)
>   Git cheatsheets are available on the web.
> 1. __a list of *how to fix this mess I made with Git?*__  
>   For this purpose,
>   [Oh Shit, Git!?!](https://ohshitgit.com/) could help (as per the _xkcd_
>   below).
> 1. __an article explaining how Git works under the hood.__  
>   This would be a long story, but _Git from the bottom up_ by John Wiegley
>   does a good job at conveying the essential concepts clearly and succinctly.
>   Available in both
>   [PDF](http://ftp.newartisans.com/pub/git.from.bottom.up.pdf) and
>   [online](https://jwiegley.github.io/git-from-the-bottom-up/) versions.
> 1. __something smart, cool, and nerdy about Git...__  
>   ...such as the fictional-but-realistic
>   [Git man page generator](https://github.com/Lokaltog/git-man-page-generator)
>   or this site to make your
>   [commit history scrolling by Star Wars style](http://starlogs.net/).
>
> __This is instead:__
> 1. a collection of __personal notes__ I took since I started learning Git;
> 1. a sectioned and annotated list of the
> __Git commands and procedures I use the most__.

<div style="text-align: center;">
    <br>
    {{< figure
        src="/images/how_to_git.webp"
        title="If that doesn't fix it, git.txt contains the phone number of a friend of mine who understands git. Just wait through a few minutes of 'It's really pretty simple, just think of branches as...' and eventually you'll learn the commands that will fix everything."
        width=300
    >}}
    <br>
</div>

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
- __`--everything-is-local`__ (popular Git claim)  
    All Git info is locally stored in the `.git` folder (with the _object
    database_ and the _index_ living in the `.git/objects` and `.git/index`
    subfolders respectively), which makes any Git repository _locally
    self-contained_. Hence, the folder of the local repo can be freely moved in
    the personal filesystem, and Git will keep working smoothly.

- __`--distributed-is-the-new-centralized`__ (another Git claim)  
    Git is a _distributed version control system_, meaning that your local
    repository has exactly the same features and functionality as __any other
    Git repository__. So a Git repo on a server is the same as a Git repo on
    GitHub (granted GitHub adds additional features) which is the same as your
    coworker's local repo. In this way, there is no _central repo_ you have to
    have access to do your work. You can commit, branch, and party on your own
    repo on your local machine even without internet access. Then, when you have
    a connection again, you can push your changes to any other Git repo you have
    access to. So, while most people treat a particular repo as the "central
    repo", that's a process choice, not a Git requirement.

- In every Git project, there are (at least) three active copies of each file,
    stored in three different locations:
    1. the ___working directory___, aka the ___working tree___, or the local
        ___workspace___.  
        Files therein are copied out of the local repo and are the only ordinary
        read'n'write files that you can work on.

    2. the ___staging area___, aka the ___index___ (a meaningless term), or
        ___cache___ (a mostly defunct term).  
        It is like a draft space to prepare changes before committing them and
        making them part of the project's history. Changes added here are only a
        _proposed_ commit, not a real one yet, so they can be modified, even if
        already stored in a de-duplicated format.

    3. the ___local repository___, loosely identifiable with the ___object
        database___.  
        It holds the whole project’s history, including the `HEAD` (or _current
        commit_) copy of all files as well as all the previous commits and
        branches since the initialization of the repo. This copy is frozen and
        de-duplicated (i.e., it can't be changed because it is in a commit).

    In addition, if using `git stash`,

    4. the ___stash___.  
        It's meant to temporarily store a snapshot of your changes without
        committing them to the repository. Useful when you’ve made changes to a
        branch that you aren’t ready to commit, but you need to switch to
        another branch.

    In addition, if using an hosting remote service like GitHub or GitLab, you
    also need to consider

    5. the ___remote repository___, aka ___upstream repository___, or simply
        the ___remote___.  
        This is a copy of your project hosted on the internet or network. It
        allows multiple people to collaborate by pushing to and pulling from
        this shared resource.

    Accordingly, you use and modify the working tree copies, you use `git add`
    or `git restore --staged` to create or remove the index copies, and then you
    use `git commit` to turn the proposed next commit into an actual commit. In
    this step, Git simply packages up the files that are in its index at that
    time. To make that work, the initial `git checkout` (or `git switch`) step
    first fills in Git's index.

    <div style="text-align: center;">
    {{< figure
        src="/images/git_transports.png"
        title="Git transport scheme"
        width=670
    >}}
    <figcaption style="font-size: 13px;">
        Scheme of the main Git actions moving information across the different
        storage sections of a Git repository. 
    </figcaption>
    <br>
    </div>

- The `.gitignore` file contains all the filenames to be ignored by Git: they
    won't be staged, committed, or pushed in any case, though being in the local
    repository folder.

- The following operations for monitoring Git are safe to run at any time since
    they never change anything in your local branches:
    ```bash
    git fetch    # Updates remote-tracking branches by obtaining the most
                 # up-to-date commits from the remote GitHub repository
    git status   # Shows the working tree status
    git diff     # Shows the still uncommitted (nor staged) changes in local
                 # files, line by line 
    git diff <branch_A> <branch_B>   # Shows the committed changes in <branch_B>
                                     # relative to <branch_A> taken as reference
    git show     # Shows the last commit (hash, message, and line-wise diffs)
    git log      # Shows the commit history and hashes of the current branch
    git log --patch <file_name>      # Shows commit history and diffs combined
    git reflog   # Shows a list of times when HEAD changed
    ```
    Accordingly, run `git fetch` followed by `git diff main origin/main` to see
    which new changes for the `main` branch are currently available from the
    remote repository. 
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
    - __local__: only available for the current project and stored in the
        `.git/config` file within the project's directory. This is the default
        level for each `git config` command with a _writing option_, executed
        under the project's directory:
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
Quite obviously, __local__ overrides __global__ and __global__ overrides
__system__.
    {{< /hint >}}
    
    {{< hint warning >}}
__WARNING__  
__Local__ configs are actually effective for just one particular copy/clone of
any given repo, and need to be reapplied if the repo is recloned clean from the
remote; `git config` command changes a local file that is not sent to the remote
with a commit/push action.
    {{< /hint >}}

## Configuration Settings
- List, check, or edit all the configuration settings. When no option is
    included, the command lists the config settings of ALL three levels.
    ```bash
    git config [--local|--global|--system] -l # [--list]
    git config [--local|--global|--system] -e # [--edit]
    ```

- Set the following global options, otherwise you'll be asked for upon the first
    commit:
    ```bash
    git config --global user.email "federicoalessandro.ruffinatti@unito.it"
    git config --global user.name "Federico Alessandro Ruffinatti"
    ```

- Set the name of the default branch created when initializing any new
    repository. Git defaults to `master`, but you got to set it to `main` if you
    want to conform to the GitHub standard.
    ```bash
    git config --global init.defaultBranch main
    ```

- Set the default text editor for commit messages. 
    ```bash
    git config --global core.editor "<editor>"
    ```
    ```bash
    # Some common values for "<editor>" in Linux
    "vim"
    "nano"
    "kate"
    "gedit --wait --new-window"

    # Some common values for "<editor>" in Windows
    "'C:/Program Files/Git/usr/bin/vim.exe'"
    "'C:/Program Files/Git/usr/bin/nano.exe'"
    "C:/Windows/System32/notepad.exe"
    "'C:/Program Files/Sublime Text/sublime_text.exe' -w"
    "'C:/Program Files/Notepad++/notepad++.exe' -multiInst -notabbar -nosession -noPlugin"
    ```
    {{< hint info >}}
__NOTE__  
When you create a Git commit, the default editor that will be opened is 
___Vim___. This can be very confusing for people that have never worked with it
previously.
- To __exit a session without saving your changes__, press `Esc` then type `:q!`
    and hit `Enter`.
- If you want to __save your changes and quit__, press `Esc` then type `:wq` and
    hit `Enter`.
    {{< /hint >}}

- Set up __line ending__ (EOL) setting. Git has a configuration setting called
    `core.autocrlf` which is specifically designed to make sure that, when a
    _text_ file is written to the repository's _object database_, all line
    endings in that text file are normalized to `LF` (_de facto_ EOL standard in
    Git and GitHub). The `core.autocrlf` setting variable can take three
    possible values:
    - `core.autocrlf=false` __Default behavior__. Don't do anything to EOLs: all
                            types of line endings are left untouched by Git. 
    - `core.autocrlf=true`  __Good for Windows projects__. Line endings of text
                            files are converted to Unix style (`LF`) when
                            writing to the _object database_ (more precisely,
                            when files are staged to the _index_), however `LF`
                            are turned back into `CR` `LF` when writing out into
                            the working directory.
    - `core.autocrlf=input` __Good for Linux projects__. Line endings of text
                            files are converted to Unix style (`LF`) when
                            writing to the _index_ and no reverse conversion is
                            performed when writing out into the working
                            directory.
    
    In any Linux-only project you can force `LF` EOL in __every copy__
    (working tree, index, local repo, and remote) of every text file of the
    project by using the following settings at `local` level (commands are to
    be executed under the project working directory):
    ```bash
    git config core.autocrlf input  # See above.
    git config core.eol lf          # When Git needs to change line endings to
                                    # write a file in your working directory
                                    # (e.g., by `git checkout`, `git pull`,
                                    # `git clone`) it will always use LF to
                                    # denote end of line.
    git config core.safecrlf warn   # Git should warn about possible corruption
                                    # of binary files (based on their mixed
                                    # content of LF and CRLF) before committing.

    git add --renormalize .         # To update EOLs of all tracked (committed)
                                    # files in the 'local repo' according to the
                                    # new config settings.
    git rm --cached -r .            # Run these two commands with your 'working
    git reset --hard                # directory clean' to update existing line
                                    # endings in your 'working tree' taking into
                                    # account config changes and replacing any
                                    # potential overlooked CRLF in text files.

    git ls-files --eol              # To verify that the files in your repo are
                                    # using the correct line endings.
    ```
    {{< hint info >}}
__NOTE__   
As of 2018, starting with Windows 10 1809, most Windows applications, including
[Notepad](https://devblogs.microsoft.com/commandline/extended-eol-in-notepad/),
support Unix/Linux (`LF`) and old Macintosh (`CR`) line endings, in addition to
the usual Windows (`CR` `LF`) line endings. Therefore, even in the case of
cross-platform collaboration projects, or Win-Linux hybrid systems sharing the
same working directory (as in the case of _WSL_), using the former settings
might be a good choice... unless you need to run batch scripts, in which case
you should use `git config core.autocrlf true` and `git config core.eol native`,
since batch files need `CR` `LF` line endings to run properly. In any case, if
you want to avoid `CR` `LF` being introduced into the remote code from some
Windows device, you have to make sure that __all your collaborators__ have
changed the default Git setting (`core.autocrlf=false`) before starting staging
and committing (not so handy when working in a large team of developers).

To solve all these problems (and more), using a `.gitattributes` file to
encapsulate line endings within your repository is now considered the best
practice, thus ceasing depending on everyone having the proper settings (see
_Refs_ below).
    {{< /hint >}}
    > __Refs and additional readings__  
    > - [Pro Git book](https://www.git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_core_autocrlf)
    > - [Stack Overflow](https://stackoverflow.com/questions/9976986/force-lf-eol-in-git-repo-and-working-copy)
    > - [Wikipedia](https://en.wikipedia.org/wiki/Newline)
    > - [Tim Clem's Adaptive Patchwork](https://adaptivepatchwork.com/2012/03/01/mind-the-end-of-your-line/)
    > - [Aleksandr Hovhannisyan's blog](https://www.aleksandrhovhannisyan.com/blog/crlf-vs-lf-normalizing-line-endings-in-git/)
    > - [Muhammad R. Saeed's blog](https://rehansaeed.com/gitattributes-best-practices/)

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

To clone (i.e., copy) an existing GitHub repository `<git_repo>` into a local
directory `<local_dir>/<git_repo>`, get the `<git_repo_url>` from GitHub,
locally move to the _supposed_ parent directory, and clone the repo.
```bash
cd <local_dir>
git clone <git_repo_url>
```
{{< hint info >}}
__NOTE__  
`git clone` makes a local copy of a remote repository and automatically sets up
a _tracking branch_ to the _remote_ using `origin` as the default name for it.
This is the reason why, `origin` is not special, but nevertheless a sensible
choice when you set up remotes by hand.

See also next section for more info on _tracking branches_ and the `origin`
name.
{{< /hint >}}

## Make a New Empty Repository
To create a new GitHub repository `<git_repo>` from scratch you can either use
the __GitHub Web__ graphical interface or choose the __GitHub CLI__ as a fully
command-line alternative.

### GitHub Web
1. Go to the
    [_GitHub_](https://github.com/)
    website and log in with your credentials;

1. From `Your profile` > `Repositories` > `New` > set `<git_repo>` as name for
    the new repository > `Create repository`;

1. Copy the `git_repo_url` to clone the empty repository locally.
    ```bash
    git clone <git_repo_url>
    ```

1. Now you are ready to _stage_, _commit_, and _push_ from within the newly
    created `<git_repo>` directory (see next section).

### GitHub CLI
1. Install the __GitHub CLI__ (to be installed separately from Git) and log in;
    ```bash
    # Example syntax for Arch systems
    sudo pacman -Syu github-cli
    
    # To be done just once
    gh auth login
    ```

1. Create an empty GitHub public repository named `<git_repo>`;
    ```bash
    gh repo create <git_repo> --public
    ```

1. Check it out on GitHub and copy the `git_repo_url` to clone the empty
    repository locally;
    ```bash
    git clone <git_repo_url>
    ```

1. Now you are ready to _stage_, _commit_, and _push_ from within the newly
    created `<git_repo>` directory (see next section).

## Make a Repo from a Local Folder
Follow these steps to make a local Git repository from an existing project folder.

1. Make the project directory and move into it; 
    ```bash
    mkdir <git_repo>
    cd <git_repo>
    ```

1. Create the repository locally (i.e., initialize the local _object database_);
    ```bash
    git init
    git branch -m main # to override the default name 'master'
    # OR, in one single step,
    git init -b main
    ```

1. Add some files (e.g., code files, `README.md`, `.gitignore`), then _stage_
    and _commit_;
    ```bash
    git add .
    git commit -m "<message>"
    ```

This way, you have a fully functional local Git repository. The next steps will
show you how to connect it to a remote GitHub repository. Also in this case you
can choose between the __GitHub Web__ graphical interface and the __GitHub CLI__.

### GitHub Web
1. Create the GitHub repo from the
    [_GitHub_](https://github.com/)
    website:  `Your profile` > `Repositories` > `New` > set `<git_repo>` as name for
    the new repository > `Create repository`;

1. Make the GitHub repository a _remote_ for the local repository;
    ```bash
    git remote add origin git@github.com:<user>/<git_repo>.git
    # E.g.,:
    git remote add origin git@github.com:Feat-FeAR/Kerblam_prototype.git
    # Check the command has worked
    git remote -v
    ```
    {{< hint info >}}
__INFO__  
In Git, a _remote_ is a copy of the repository that is hosted somewhere else,
that we can _push to_ and _pull from_. To avoid entering the full address each
time, Git allows the use of local names to refer to the _remote_. Even if in
principle it could be called anything, `origin` is a convention that is often
used by default in Git and GitHub (see, e.g., `git clone`), so it’s helpful to
stick with this unless there’s a reason not to. However, pay attention...
`upstream` is another name sometimes used for the _remote_.

__In any case, remember that the name you give to a remote only exists
_locally_. It’s an alias that you choose and not something intrinsic to the
remote repository.__
    {{< /hint >}}

1. Push the first commit by using the option `--set-upstream` (`-u`) to set up
    a _tracking branch_ that will associate the current local branch with a
    _remote_ so that subsequent `git push`, `git fetch`, `git merge`, and
    `git pull` _can_ be used without any arguments (notably, it also affects
    `git status`, which will then report the difference between your current
    branch and its _upstream_ in terms of commits).
    ```bash
    git push --set-upstream origin main
    # or
    git push -u origin main
    ```
    {{< hint info >}}
__INFO__  
A _tracking branch_ in Git is a __local__ branch that is connected to a remote
branch (also referred to as its _upstream branch_). When you push and pull on
that branch, it automatically pushes and pulls to the remote branch that it is
connected with. Use this if you always pull/push from/to the same upstream
branch, and if you don't want to use those Git commands explicitly.

Remote-tracking branch names take the form `<remote>/<branch>` (e.g.,
`origin/main`) and can be listed by `git branch -r`.

Notably, _tracking branches_ can also be used in Git commands like `diff`,
`checkout`, `merge`, etc., and, more generally, are to be considered as any
other local branch, thus providing an handy bridge to work with the _remotes_.
    {{< /hint >}}

### GitHub CLI
1. Use __GitHub CLI__ to create a GitHub public repository (named `<git_repo>`)
    based on the content of the local repo, make it a _remote_ for the local
    repository, and push the committed changes in one single step.
    ```bash
    gh repo create <git_repo> --public --source=. --remote=origin --push
    ```
    {{< hint info >}}
__NOTE__  
In all these examples, the local project directory and the remote repository
have always the same name (`<git_repo>`), but this is not actually necessary. In
fact, there is no such thing as a "repository name" in Git, and the name of the
GitHub repository does not necessarily have to be the same as the name of the
project directory.
{{< /hint >}}

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

1. Fetch from the remote repository and integrate with the local branch.
    ```bash
    # In all the following commands, with no additional arguments, Git uses the
    # current branch's upstream, if set (i.e., `origin/main`).
    git pull
    # or
    git fetch
    git merge
    ```
    {{< hint info >}}
__NOTE__  
Actually, `git pull` is a wrapper that runs two different Git commands in a row:
1. `git fetch`, to update remote-tracking branches by obtaining new commits from
    the remote GitHub repository;
1. a second command to combine committed changes between the remote and local
    branches.

The precise nature of the second step depends on a _git config_ setting, namely
```
git config pull.rebase false    =>   git fetch; git merge
git config pull.ff only         =>   git fetch; git merge --ff-only
git config pull.rebase true     =>   git fetch; git rebase
```
`git config pull.rebase false` (and thus `git merge`) is the "traditional" Git
standard approach, which runs a _fast-forward merge_ if possible (i.e., when new
commits are in the remote branch only) and attempts a _real merge_ otherwise.
However, a more cautious approach (possibly becoming a new standard) might be to
set `git config pull.ff only` so that only fast-forward merges are automatically
performed when using `git pull`, while in the case where the remote and local
branches have diverged (i.e., both have unique commits, even if related to
different files) one can take the time to explore changes and choose the most
appropriate way to _manually merge_ (or _rebase_, if one wishes to be
adventurous...) to resolve possible conflicts.
    {{< /hint >}}

1. Make changes to one or multiple project files. The best practice here is to
    work on just __one feature per commit__ (aka _atomic commits_).
    {{< hint info >}}
__NOTE__  
If you run `git pull` and uncommitted changes are already present in the local
branch, Git will synchronize committed changes and leave all the uncommitted
ones untouched if they are on files not targeted by the merge step, otherwise
the whole procedure will be aborted.
    {{< /hint >}}

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
    _staging area_ (aka _index_),
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
In Git, _undo_ can mean many slightly different things.

- Discard local changes (not yet staged or committed) in the _working tree_.
    ```bash
    git checkout -- <file_name>
    # or
    git restore <file_name>
    ```
    {{< hint info >}}
__NOTE__  
The double hyphen `--` in `git checkout` means _treat everything afterwards as a
file_, according to the full form of the command:
```
git checkout [<commit-like>] [<file>]
```
where `<commit-like>` can be a branch, a tag, a specific commit, etc. If you
omit the `<commit-like>` argument it defaults to the current `HEAD`, but, when
used with only the `<file>` argument, `--` is necessary for the command to know
that you are actually omitting the first one.
    {{< /hint >}}
    {{< hint info >}}
__INFO__  
The `git checkout` command allows you to decide _what to pick out of the local
Git repository and copy in the working directory_, whether it is a branch, a
single file, or another valid reference, such as a commit. This allows you to
retrieve a specific snapshot of the project in your working copy, thus going
"back in time" to the moment when that snapshot was saved. However, the command
turned out to be so complicated and a source of confusion for so many users that
Git developers finally (as of Git 2.23) split it into two separate and more
focused commands to better clarify the two different uses of `git checkout`:
- `git switch`, to change branches, as `git checkout <branch_name>` does (see
    next section);
- `git restore`, to reset files to certain revisions, as
    `git checkout -- <file_name>` does.
    {{< /hint >}}

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

- Restore an older version of `<file_name>` (back to commit `<commit_hash>`).
    ```bash
    # The old version of `<file_name>` will be available from your working tree
    # and the index as well (changes are already staged).  
    git checkout HEAD~<NUM> <file_name>
    git checkout <commit_hash> <file_name>
    
    # The old version of `<file_name>` will be available from your working tree
    # but nothing is added to the index.
    git restore -s HEAD~<NUM> <file_name>      # --source=
    git restore -s <commit_hash> <file_name>   # --source=
    ```

- Restore an entire old commit.
    ```bash
    # By 'detached HEAD' state (no branch checked out). Exit the 'detached HEAD'
    # state by checking out any branch (e.g., `git checkout main`)  
    git checkout HEAD~<NUM>
    git checkout <commit_hash>

    # or, avoiding detaching the HEAD,
    git restore -s HEAD~<NUM> .                # --source=
    git restore -s <commit_hash> .             # --source=
    ```

- Remove the last commit __from the local Git repository__.
    ```bash
    git reset --hard HEAD^
    ```
    Remove `--hard` to uncommit but keep the changes around for reworking.
    ```bash
    git reset HEAD^
    ```

- Remove from the local Git repo multiple commits __from the top__.
    ```bash
    git reset --hard HEAD~<NUM>
    git reset --hard <last_good_hash>

    # E.g.:
        git reset --hard HEAD~3     # removes the last three commits
        git reset --hard HEAD~1     # is equivalent to HEAD^
    ```
    Remove `--hard` to uncommit but keep the changes around for reworking.
    ```bash
    git reset HEAD~<NUM>
    ```

- Fix the last commit __in the local Git repository__. The `--amend` option will
    update and replace the most recent commit with a new commit that combines
    any staged changes with the contents of the previous commit. The `--no-edit`
    option amends the commit without changing its commit message.
    ```bash
    # Make your change
    git add .
    git commit --amend --no-edit
    ```
    With nothing currently staged, `--amend` can be used to __just rewrite the
    previous commit message__.
    ```bash
    git commit --amend -m "<new_message>"
    ```

- Revert individual pushed commits (i.e., _public changes_) with effect on the
    __remote repo__.
    ```bash
    git revert <commit_hash>      # or by using the HEAD~<NUM> syntax
    git push
    ```
    {{< hint info >}}
__INFO__  
Actually, this will create a new _inverse_ commit (needing to be pushed), which
reverts the changes of `<commit_hash>`. Since you don't rewrite any history,
`git revert` is a safe and easy way to rollback to a previous state.
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
    usually you want to revert up to the `HEAD` of the current branch, using the
    the `--no-commit` flag to revert all the commits at once (otherwise you'll
    be prompted for a message for each commit in the range, littering your
    history with unnecessary new commits):
    ```bash
    git revert --no-commit <oldest_commit_hash>..HEAD
    git commit -m "<global_revert_message>"   # ...not sure about the difference
                                              # with `git revert --continue`
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
`git restore` can be used to produce quite similar (sometimes even identical)
results:
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
> - [Stack Overflow (1)](https://stackoverflow.com/questions/63661460/difference-between-git-restore-and-git-revert)
> - [Stack Overflow (2)](https://stackoverflow.com/questions/4114095/how-do-i-revert-a-git-repository-to-a-previous-commit)
> - [GitHub Blog](https://github.blog/open-source/git/how-to-undo-almost-anything-with-git/)

## Manage Branches
1. Create a new branch `<new_branch>` __locally__.
    ```bash
    git branch <new_branch>
    ```

1. List branches.
    ```bash
    git branch -l  # [--list]    list local branches (current one marked with *)
    git branch -r  # [--remotes] list remote-tracking branches
    git branch -a  # [--all]     list all branches
    ```

1. Switch to a different branch `<new_branch>`, __if the working tree is clean__
    (i.e., nothing to stage or commit).
    ```bash
    git checkout <new_branch>
    # or
    git switch <new_branch>
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

1. Push the new branch to the remote repository for the first time by using the
    option `--set-upstream` (`-u`) (as explained in the _Make a New Repository_
    section).
    ```bash
    git push --set-upstream origin <new_branch>
    # or
    git push -u origin <new_branch>
    ```

1. Go back to main.
    ```bash
    git checkout main
    # or
    git switch main
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
    git checkout main     # or 'git switch main', as usual... 
    git merge <new_branch>
    # ...manually resolve possible conflicts...
    git push
    ```
    {{< hint info >}}
__NOTE__  
`git merge` merges the specified branch into the currently active branch. So you
need to be on the branch that you are merging into (i.e., usually the `main`).
    {{< /hint >}}
    {{< hint warning >}}
__WARNING__  
GitHub usually deletes a branch after merging of a _pull request_, but this
action will only affect the branch in the remote. To also remove all the
`remotes/origin/*` _tracking branches_ (i.e., to clean up your local references
to the remote branches), do this:
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
    git stash push
    # or simply
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
While [here](https://github.com/orgs/community/discussions/16925) you can see
how they are displayed on GitHub.
