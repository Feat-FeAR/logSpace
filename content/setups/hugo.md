+++
title = 'Hugo PowerShell'
date = 2023-11-17T23:54:39+01:00
draft = true
+++

#

This is a concise guide on how to make a website via __Hugo__ in a Windows
environment. To this purpose, all of the following commands must be run from
`PowerShell` (tested on PowerShell 7.3.9) and not from `Windows PowerShell`,
which is a different application (😱😱😱).

I recommend using __PS__ to work in a Windows environment instead of __WSL__
since with my ManjaroWSL2 I experienced malfunctions in page refresh.
Nevertheless, 90% of the following commands also apply in a Linux/Bash environment.
Except for Winget is Microsoft’s official free and open-source package manager for Windows. This will install the extended edition of Hugo:

Change detected, rebuilding site.
realt time rendering 

## Prerequisites

### Git / GitHub
Install and configure __Git__ and __GitHub__.
```sh
# Install Git
winget install --id Git.Git -e --source winget

# Configure Git
git config --global user.email "your_mail_here"
git config --global user.name "Name Surname"

# Create a SSH key through ssh-keygen (if none exists)
ssh-keygen -t ed25519 -C "your_mail_here"
# Copy the SSH public key to your clipboard from here
cat $HOME/.ssh/id_ed25519.pub
```
Finally add the SSH key to your account on __GitHub__ web site: _Settings_ `>`
_SSH and GPG keys_ `>` _New SSH key_ `>` add a title (usually, the device you’ll
use that key from) and select _Authentication Key_ as key type `>` paste your
key into the _Key_ field (including the `-C` comment) `>` _Add SSH key_

### Hugo
Install __Hugo__.
```sh
# Install Hugo extended edition (v0.112.0 or later)
winget install Hugo.Hugo.Extended
```


## Create a Hugo site
Run these commands to create a Hugo web site with the _Ananke_ theme (default),
make it a Git (local) repository, and test it by local hosting (at
`localhost:1313`).
```sh
Set-Location <drive:>
cd <path_to_parent_folder>

hugo new site <site_name>
cd <site_name>
git init
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
echo "theme = 'ananke'" >> hugo.toml
hugo server
```
Full guide [here](https://gohugo.io/getting-started/quick-start/).

## Host on GitHub Pages
Deploy Hugo as a _GitHub Pages_ site and automate the whole process with _GitHub
Actions_ (full guide [here](https://gohugo.io/hosting-and-deployment/hosting-on-github/)).
* Go to GitHub and create a GitHub repository using the same name of your Hugo
site (better to add no `README file`, no `.gitignore`, and no license in this
step).
* Push your local repository to GitHub.
```sh
# Push your local repository to GitHub
git remote add origin <SSH_reference_as_provided_by_GitHub>
git branch -M main
git push -u origin main
```
* From the main menu of the GitHub repository, choose _Settings_ `>` _Pages_. In
_Build and deployment_ section, change the _Source_ to `GitHub Actions` (the
change is immediate; you do not have to press a "Save" button).
* `mkdir .github/workflows` in your local repository and copy [this](https://github.com/Feat-FeAR/logSpace/blob/main/.github/workflows/hugo.yaml)
YAML file there.
* Stage, commit (e.g., `-m "Add workflow"`), and push your local repository to
GitHub.
* When GitHub has finished building and deploying your site, the color of the
status indicator in GitHub’s _Actions_ menu will change to green.
* Click on the commit message and under the _deploy_ step, you will see a link
to your live site.

__In the future, whenever you push a change from your local repository, GitHub
will rebuild your site and deploy the changes__.


## Add Content
Hugo pages are markdown...
```sh
# Add a new page to your site
hugo new content <section_name>\<filename>.md
```
* Open the file with your editor (notice the `draft` value in the front matter
is _true_).
* Add some markdown to the body of the post, but do not change the `draft` value.
* Save the file, then start Hugo’s development server to view the site. 
```sh
# You can run either of the following commands to include draft content
hugo server --buildDrafts
hugo server -D
```
* View your site at the URL displayed in your terminal (`localhost:1313`).
__Keep the development server running as you continue to add and change
content.__ All changes made locally will be reflected on the site, without the
need to refresh your browser each time.

In addition, you can add/modify the `README file`, `.gitignore`, and the license
now.


## Themes
### Install a new theme
* Install a theme from https://themes.gohugo.io/. Since your site is already a
git repository, you can add the theme as a _submodule_.
```sh
# For instance, under the root directory of your Hugo site
git submodule add -f https://github.com/JingWangTW/dark-theme-editor.git themes/dark-theme-editor
```
* Edit the site configuration file `hugo.toml` (in the root of your project)
setting the `theme` property to the theme name.

### Configuration 
Additionally, the theme provides many custom fields for you to configure as needed. Please refer to the config.toml file in the theme to find all available options. You can override these values by adding them to your own config.toml file or by directly modifying the file in the theme directory.

### Remove a theme
To effectively remove a Git submodule you need to:
* Delete the relevant section from the `.gitmodules` file.
* Stage the changes `git add .gitmodules`
* Delete the relevant section from `.git/config`.
* Run `git rm --cached <path_to_submodule>` (no trailing slash).
* Run `rm -rf .git/modules/<path_to_submodule>` (no trailing slash).
* Commit `git commit -m "Removed submodule <name>"`.
* Delete the now untracked submodule files `rm -rf <path_to_submodule>`.

Contributed as a [GitHub Gist](https://gist.github.com/myusuf3/7f645819ded92bda6677)
by Mahdi Yusuf ([myusuf3](https://github.com/myusuf3)).


## Release
When you publish your site, Hugo creates the entire static site in the public directory in the root of your project. This includes the HTML files, and assets such as images, CSS files, and JavaScript files.
```sh
hugo
```
In this step you will publish your site, but you will not deploy it. However, if
GitHub Actions were  properly cofigured, GitHub will automatically rebuild your
site and deploy the changes upon the next commit.

