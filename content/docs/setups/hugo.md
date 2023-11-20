+++
title = 'Hugo'
date = 2023-11-17T23:54:39+01:00
draft = false
+++

# Hugo

__Hugo__ is a fast and easy-to-use static website generator written in __Go__
that renders a complete HTML website (just like _The log_Space_ you are browsing
right now) starting from content and templates written in __Markdown__
(such as [the source of this page](https://github.com/Feat-FeAR/logSpace/blob/main/content/docs/setups/hugo.md?plain=1)).

This is a concise guide on how to make a website via __Hugo__ working in a pure
Windows environment. To this purpose, all of the following commands are intended
to be run from `PowerShell` (tested on _PowerShell v7.3.9_) and NOT from
`Windows PowerShell`, which is a different application (😱). Nevertheless, most
of them also apply without modification to a pure Linux/Bash environment, the
only exceptions being those few overtly Win-specific commands such as `winget`
(the Microsoft’s official package manager for Windows) or `Set-Location` (to
change drive letter).

In any case, when running __Hugo__ in a Windows environment, I recommend using
__PS__ as CLI instead of __WSL__, since with my _ManjaroWSL2_ the change
detector for site real-time rendering never worked well.

Throughout this tutorial, the working directory `.` will represent the _site
root directory_.

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
Finally add the SSH key to your account on __GitHub__ web site: _Settings_ >
_SSH and GPG keys_ > _New SSH key_ > add a title (usually, the device you will
use that key from) > select _Authentication Key_ as key type > paste your key
into the _Key_ field (including the `-C` comment) > _Add SSH key_.

### Hugo
Install __Hugo__.
```sh
# Install Hugo extended edition (v0.112.0 or later)
winget install Hugo.Hugo.Extended
```


## Create a Hugo site
Run these commands to create a new Hugo web site and run it on `localhost:1313`.
Official guide [here](https://gohugo.io/getting-started/quick-start/).
```sh
# Move to the directory that will contain the site directory
Set-Location <drive:>
cd <path_to_parent_folder>

# Create a new Hugo web site and enter the site root directory
hugo new site <site_name>
cd <site_name>

# Make it a Git (local) repository
git init
 
# Add a theme (e.g., 'Ananke') as a Git submodule and set it in the config file
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
echo "theme = 'ananke'" >> hugo.toml

# Test the site by local hosting (localhost:1313)
hugo server
```


## Host on GitHub Pages
Deploy Hugo as a _GitHub Pages_ site and automate the whole building process
with _GitHub Actions_. Full guide [here](https://gohugo.io/hosting-and-deployment/hosting-on-github/).
* Go to __GitHub__ and create a GitHub repository using the same name of your
Hugo site (better to add no _README file_, no `.gitignore`, and no license in
this step, but do it later).
* Push your local repository to GitHub.
```sh
# Push your local repository to GitHub
git remote add origin <SSH_repo_reference_as_provided_by_GitHub>
git branch -M main
git push -u origin main
```
* From the main menu of the GitHub repository, choose _Settings_ > _Pages_. In
_Build and deployment_ section, change the _Source_ to `GitHub Actions` (the
change is immediate; you do not have to press a "Save" button).
* `mkdir .github/workflows` in your local repository and copy [this](https://github.com/Feat-FeAR/logSpace/blob/main/.github/workflows/hugo.yaml)
YAML file there.
* Stage, commit (e.g., `-m "Add workflow"`), and push your local repository to
__GitHub__.
* When __GitHub__ has finished building and deploying your site, the color of
the status indicator in GitHub’s _Actions_ menu will change to green.
* Clicking on the commit message and under the _deploy_ step, you will see a
link to your live site.

__In the future, whenever you push a change from your local repository, GitHub
will automatically rebuild your site and deploy the changes__.


## Add content
### Pages
__Markdown__ is the standard content format supported by __Hugo__. You can put
any file type into your `./content/*` directories, but __Hugo__ uses the markup
front matter value (if set) or the file extension to determine if the file needs
to be processed. As an alternative you can use the following command to get a
new blank page already provided with a suitable front matter.
```sh
# Add a new page to your site
hugo new content <section_name>/<filename>.md
```

### Markdown
To add __Markdown__ text to existing pages:
* Open the `.md` file with your editor (notice that the `draft` value in the
front matter could be _true_).
* Add some markdown to the body of the post.
* Save the file, then start Hugo’s development server to build the site. 
```sh
# You can run either of the following commands to include draft content
hugo server --buildDrafts
hugo server -D
```
* View your site locally at the URL displayed in your terminal
(`localhost:1313`). __Keep the development server running as you continue to add
and change content. All the saved changes will be reflected on the site in real
time, without the need to refresh your browser each time!__.

### HTML
Beyond __Markdown__, you can insert __HTML__ directly inside Markdown files in
`./content`. However, from version 0.6, __Hugo__ uses _Goldmark_ for Markdown
that--for security reasons--wipes HTML code by default. If you use HTML
frequently in your site, you can add to your `hugo.toml`
```toml
# Allow HTML in md files
[markup.goldmark.renderer]
  unsafe = true
```
By doing so, the HTML code in your `.md` files will be rendered without
modification (but your indented code will follow Markdown formatting as usual).
You could also save your content files as `.html`, but then you’ll have to write
everything in HTML.

### JavaScript
__JavaScript__ code can be inserted _inline_ simply using the HTML `<script>`
tag.
```html
<!-- Example of inline JS script to display a simple popup message --> 
<button onclick="showPopup_fromHere()">Click me</button>
<script>
    function showPopup_fromHere() {
        alert("Hello! This inline JS insert works fine.");
    }
</script>
```
The previous example results in this interactive button:
<!-- Example of inline JS script to display a simple popup message --> 
<button onclick="showPopup_fromHere()">Click me</button>
<script>
    function showPopup_fromHere() {
        alert("Hello! This inline JS insert works fine.");
    }
</script>
However, as you can test here below, you can also import any `.js` script from
the `./static` subfolder in this way:
```html
<!-- Example of imported JS script to display a simple popup message --> 
<script src="/js/popUp_test.js"></script>
<button onclick="showPopup_fromThere()">Click me</button>
```
<script src="/js/popUp_test.js"></script>
<button onclick="showPopup_fromThere()">Click me</button>


---
`TO BE REVIEWED`
Finally, if you want to flexibly embed a JavaScript app in markdown syntax you
better build a Hugo _shortcode_ to reference your script anywhere in the code.
* Save your __JS__ scripts as `.js` files and put them in the `./static/js`
subfolder (e.g., `./static/js/popUp_test.js`).
* Now you need to find a file that is included in every page of your final HTML.
Typical choices are `header.html`, `footer.html`, or something similar, but in
any case their exact location depends on the particular theme you are using.
* Once located, copy this file to _your_ `./layouts/partials` folder, in order
to override the content of the original.
```sh
# For instance (if using the 'hugo-book' theme)
cd <project_root>
New-Item -Type dir ./layouts/partials/docs
cp `
	./themes/hugo-book/layouts/partials/docs/header.html `
	./layouts/partials/docs/header.html
```
* Add the following line to the bottom of that file, where the location of the
__JS__ script is the path relative to `./static/` (see documentation about
[`relURL`](https://gohugo.io/functions/urls/relurl/)
and [`urlize`](https://gohugo.io/functions/urls/urlize/)).
```html
<script defer language="javascript" type="text/javascript" src="{{ "/js/myscripts.js" | urlize | relURL }}"></script>
``` 

### Latex
`TO BE DONE`

## Themes
### Install a new theme
* Choose a theme from [the _Hugo Themes_ section](https://themes.gohugo.io/).
* Since your site is already a git repository, you can add it as a _git
submodule_.
```sh
# For instance, under the root directory of your Hugo site
git submodule add -f https://github.com/JingWangTW/dark-theme-editor.git themes/dark-theme-editor
```
* Edit the site configuration file `hugo.toml` (in the root of your project)
setting the `theme` property to the theme name (`dark-theme-editor` in this
example).

### Configuration 
Most of the themes provide some custom fields for you to configure as needed.
Please refer to the `README.md` and _config file_ (e.g., `hugo.toml`,
`config.yaml`) you will find in the theme sub-directory to see all available
options. You can override these values by adding them to your own `hugo.toml`
file.

### Remove a theme
As [GitHub Gist-ed](https://gist.github.com/myusuf3/7f645819ded92bda6677)
by Mahdi Yusuf ([myusuf3](https://github.com/myusuf3)), to effectively remove a
Git submodule you need to:
* Delete the relevant section from the `.gitmodules` file.
* Stage the changes `git add .gitmodules`.
* Delete the relevant section from `.git/config`.
* Run `git rm --cached <path_to_submodule>` (no trailing slash).
* Run `rm -rf .git/modules/<path_to_submodule>` (no trailing slash).
* Commit `git commit -m "Removed submodule <name>"`.
* Delete the now untracked submodule files `rm -rf <path_to_submodule>`.


## Release
If _GitHub Actions_ have been properly set, __GitHub will automatically rebuild
your site and deploy the changes without the need for further steps beyond the
push of the new commit__.

Otherwise, you have to remember that to _publish_ the site is not to _deploy_
it. In this step you will do just the first thing, for which Hugo creates the
entire static site in the `./public` subdirectory in the root of your project.
This includes the HTML files, and assets such as images, CSS files, and
JavaScript files. Here's how to proceed.
* Since your `./public` directory may contain extraneous files from a previous
build, a common practice is to manually clear the contents of `./public` before
each new build in order to remove draft, expired, and future content.
* Change the `draft` field from `true` to `false` on all the pages you want to
publish.
* Publish your site by simply typing:
```sh
hugo
```
Now you will find the site inside the `./public` folder, ready to be deployed.
