---
title: "Hugo"
weight: 20
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Hugo
__Hugo__ is a fast and easy-to-use static website generator written in __Go__
that renders a complete HTML website (just like _The log_Space_ you are browsing
right now) starting from content and templates written in __Markdown__
(such as [the source of this page](https://github.com/Feat-FeAR/logSpace/blob/main/content/docs/devel/hugo.md?plain=1)). Since Hugo generates static HTML files, it
is a great choice if you need a lightweight, high-performance website without 
the complexity of CMS, database, and related server-side processing.

This is a concise tutorial on how to make a website via __Hugo__, working in a
pure Windows environment. To this purpose, all of the following commands are
intended to be issued from `PowerShell` (tested on _PowerShell v7.3.9_ and
above) and __NOT__ from `Windows PowerShell`, which is a different application
(😱). Nevertheless, most of these commands also apply without any modifications
to a pure Linux/Bash environment, the only exceptions being those few overtly
Win-specific commands such as `winget` (the Microsoft’s official package manager
for Windows) or `Set-Location` (to change drive letter).

In any case, when running __Hugo__ in a Windows environment, my advice is to use
__PS__ as the CLI instead of __WSL__, since, with my _ManjaroWSL2_, the change
detector for the real-time rendering of the site never worked that well.

{{< hint warning >}}
__Working Directory__  
Throughout this tutorial, the working directory `.` will always represent the
_site root directory_.
{{< /hint >}}

---
---
## Prerequisites
### PowerShell
Install `PowerShell` from `Command Prompt` or `Windows PowerShell`.
```sh
# Install PowerShell
winget install --id Microsoft.Powershell --source winget
```

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
Finally add the SSH key to your account from the __GitHub__ web site:
_Settings_ > _SSH and GPG keys_ > _New SSH key_ > add a title (usually, the
device you will use that key from) > select _Authentication Key_ as key type >
paste your key into the _Key_ field (including the `-C` comment) > _Add SSH key_.

### Hugo
Install __Hugo__ (_extended edition_).
```sh
# Install Hugo extended edition (v0.112.0 or later)
winget install Hugo.Hugo.Extended
```

---
---
## Create a Hugo site
Run these commands to create a new Hugo web site and run it on `localhost:1313`.
See the official quick-start guide
[here](https://gohugo.io/getting-started/quick-start/).
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

---
---
## Host on GitHub Pages
Deploy Hugo as a _GitHub Pages_ site and automate the whole building process
with _GitHub Actions_. Full guide [here](https://gohugo.io/hosting-and-deployment/hosting-on-github/).
1. Go to __GitHub__ and create a GitHub repository using the same name of your
Hugo site (better to add no _README file_, no `.gitignore`, and no license in
this step, but do it later).
1. Push your local repository to GitHub.
    ```sh
    # Push your local repository to GitHub
    git remote add origin <SSH_repo_reference_as_provided_by_GitHub>
    git branch -M main
    git push -u origin main
    ```
1. From the main menu of the GitHub repository, choose _Settings_ > _Pages_. In
_Build and deployment_ section, change the _Source_ to `GitHub Actions` (the
change is immediate; you do not have to press a "Save" button).
1. `mkdir .github/workflows` in your local repository and copy [this](https://github.com/Feat-FeAR/logSpace/blob/main/.github/workflows/hugo.yaml)
YAML file there.
1. Stage, commit (e.g., `-m "Add workflow"`), and push your local repository to
__GitHub__.
1. When __GitHub__ has finished building and deploying your site, the color of
the status indicator in GitHub’s _Actions_ menu will change to green.
1. Clicking on the commit message and under the _deploy_ step, you will see a
link to your live site.
1. Also, use that link to update the `baseURL` field in your `hugo.toml`
configuration file.

__In the future, whenever you push a change from your local repository, GitHub
will automatically rebuild your site and deploy the changes__.

---
---
## Add content
### Blank pages
__Markdown__ is the standard content format supported by __Hugo__. You can put
any file type into your `./content/*` directories, but __Hugo__ uses the markup
front matter value (if set) or the file extension to determine if the file needs
to be processed. As an alternative you can use the following command to get a
new blank page already provided with a suitable front matter.
```sh
# Add a new page to your site
hugo new content <section_name>/<filename>.md
```
Front matter metadata can be written in any of the serialization formats JSON,
TOML, or YAML, and must be placed at the top of each content file. The full list
of the available front matter variables can be found
[here](https://gohugo.io/content-management/front-matter/#front-matter-variables).
Just keep in mind that, by default, Hugo sorts page collections by:
1. Page `weight`
1. Page `date` (descending)
1. Page `linkTitle`, falling back to page `title`
1. Page file path if the page is backed by a file

In particular, page `weight` controls the position of a page within a collection
that is sorted by weight. Assign weights using non-zero integers. Lighter items
float to the top, while heavier items sink to the bottom. Unweighted or
zero-weighted elements are placed at the end of the collection. Both the `date`
and `weight` fields are optional.

---
### Markdown
To add __Markdown__ text to existing pages:
1. Open the `.md` file with your editor (notice that the `draft` value in the
front matter could be _true_).
1. Add some Markdown to the body of the post.
1. Save the file, then start Hugo’s development server to build the site. 
    ```sh
    # You can run either of the following commands to include draft content
    hugo server --buildDrafts
    hugo server -D
    ```
1. View your site locally at the URL displayed in your terminal
(`localhost:1313`). __Keep the development server running as you continue to add
and change content. All the saved changes will be reflected on the site in real
time, without the need to refresh your browser each time!__.

---
### HTML
Beyond __Markdown__, you can insert __HTML__ directly inside Markdown files in
`./content`. However, from version 0.6, __Hugo__ uses _Goldmark_ for Markdown
that--for security reasons--wipes HTML code by default. So, if you use HTML
frequently in your site, you can add this to your `hugo.toml`:
```toml
# Allow HTML in md files
[markup.goldmark.renderer]
  unsafe = true
```
By doing so, the HTML code in your `.md` files will be rendered without
modification (but your indented code will follow Markdown formatting as usual).
You could also save your content files as `.html`, but then you’ll have to write
everything in HTML.

---
### JavaScript
__JavaScript__ code can be inserted _inline_ into the Markdown simply using the
HTML `<script>` tag.
```html
<!-- Example of inline JS script that displays a simple popup message --> 
<button onclick="showPopup_fromHere()">Click me</button>
<script>
    function showPopup_fromHere() {
        alert("Hello! This inline JS insert works fine.");
    }
</script>
```
The previous example results in this interactive button:

<button onclick="showPopup_fromHere()">Click me</button>
<script>
    function showPopup_fromHere() {
        alert("Hello! This inline JS insert works fine.");
    }
</script>

However you can also source any `.js` script previously saved in the `./static`
subfolder in two different ways, depending on whether you want to load it from
every page of the site or only as needed.

#### Global import
If you plan to use the script extensively it is best to have every page on the
site import it.
1. Save your __JS__ scripts as `.js` files and put them in the `./static/js`
subfolder (e.g., `./static/js/popUp_test.js`).
1. Now you need a file that is going to be included in each page of the final
HTML. Typical choices are `header.html`, `footer.html`, or similar _partial
templates_ you can find in `./themes/<theme_name>/layouts/partials` subfolder
(even if their exact location may depend on the particular theme you are using).
1. Once located, copy this file to _your_ `./layouts/partials` folder, in order
to override the content of the original.
    ```sh
    # For instance (if using the 'hugo-book' theme)
    cd <project_root>
    New-Item -Type dir ./layouts/partials/docs
    cp ./themes/hugo-book/layouts/partials/docs/header.html ./layouts/partials/docs/header.html
    ```
1. Add the following line to the bottom of the file.
    ```html
    <script defer
            language="javascript"
            type="text/javascript"
            src='{{ "js/popUp_test.js" | urlize | relURL }}'>
    </script>
    ```
    Here, the location of the __JS__ script must be the path relative to
`./static/`, since all the files therein will be copied with no modification,
_as-is_, to the `./public` directory when building the site.

    {{< hint warning >}}
__Mind the slashes!__  
Never include a leading slash to locate the source file when using the `relURL`
function, otherwise the resulting URL will be incorrect when the `baseURL`
includes a subdirectory (such as those you are assigned to by default when
deploying through __GitHub Pages__!)! See documentation about
[`relURL`](https://gohugo.io/functions/urls/relurl/)
and [`urlize`](https://gohugo.io/functions/urls/urlize/).
    {{< /hint >}}

1. Now you can use the __JS__ functions from within any page of the site as shown
here below.
    ```html
    <!-- Example of imported JS script that displays a simple popup message -->
    <button onclick="showPopup_fromThere()">Click me</button>
    ```

#### Local import
Alternatively, you can build a cool Hugo _shortcode_ in order to flexibly embed
the script in Markdown syntax only on pages where it is actually needed.
1. Write a short HTML that sources the JS script (and possibly add some other
useful HTML elements).
    ```html
    <!-- Example of JS script to import via shortcode -->
    <script defer
            language="javascript"
            type="text/javascript"
            src='{{ "js/popUp_test.js" | urlize | relURL }}'>
    </script>
    <button onclick="showPopup_fromThere()">
        Click me
    </button>
    ```
1. Save it into the `./layouts/shortcodes` subfolder
(e.g., `./layouts/shortcodes/js_test.html`).
1. Now, you can reference this HTML chunk anywhere just by its name, using:
    ```go
    {{</* js_test */>}}
    ```
In both cases, the final result will be an interactive button like this:

{{< js_test >}}

{{< hint info >}}
__js.Build__  
For more advanced purposes, the latest __Hugo__ releases provide the `./assets`
subdirectory (in place of `./static`) and the
[`js.Build`](https://gohugo.io/hugo-pipes/js/) function as an advanced tool for
managing JavaScript resources.
{{< /hint >}}
{{< hint info >}}
__Mind the cache!__  
Whichever way you chose to insert JS code into the Hugo web page, remember that,
to see the effects of a change to the script, you may need to use the key
combination `Ctrl+F5` or `Ctrl+Shift+R`to force page refresh ignoring the cache.
{{< /hint >}}
{{< hint info >}}
__CSS Shortcode__  
Using the same procedure described in the _Local Import_ subsection, you can
also include portions of HTML code containing only `<style>` tags via shortcode,
in order to apply alternative CSS locally (i.e., on individual web pages).
Nevertheless, best practices provide for a different strategy, as outlined in
one of the next paragraphs.
{{< /hint >}}

---
### JSON / YAML
It’s often a good idea to outsource the data in their own files. To access
`JSON`, `YAML`, `TOML`, or `XML` files from a JavaScript follow these points.
1. Put the data file(s) into the `./data` folder.
1. Save an HTML shortcode to `./layouts/shortcodes` to
    * access that data by the `.Site.Data` variable,
    * source the JS script from `./static/js/myScript.js`,
    * possibly add some other useful HTML elements.
    ```html
    <!-- Example of a JSON data-object (`./data/myData.json` file) made
    available to a JS script (`./static/js/myScript.js`) via shortcode -->
    <script>
        const myObject = {{ $.Site.Data.myData }};
    </script>
    <script defer
            language="javascript"
            type="text/javascript"
            src='{{ "js/myScript.js" | urlize | relURL }}'>
    </script>
    ```
1. Write and save the referenced JS to the usual `./static/js` folder.
1. Reference this HTML shortcode anywhere in the Markdown by its name:
    ```go
    {{</* shortcode_name */>}}
    ```

---
### Images
In theory, embedding images to a Hugo page is very straightforward. Just put
your images somewhere into the `./static` directory
(e.g., `./static/images/fig1.png`), then choose one of these three methods
1. embedding via Markdown (very basic syntax, does not provide further options)
    ```markdown
    ![Alternative Text](images/fig1.png "Mouseover Title")
    ```
1. embedding via HTML `<figure>` and `<img>` tags (with all their attributes)
    ```html
    <img src="images/fig1.png" alt="Alternative Text" class="img-responsive">
    ```
1. via Hugo’s built-in `figure` shortcode (whose parameters can be found
[here](https://gohugo.io/content-management/shortcodes/#figure))
    ```go
    {{</* figure src="images/fig1.png" title="Mouseover Title" */>}}
    ```
Here, the location of the image file must be the path relative to `./static`,
since all the files therein will be copied with no modification, _as-is_, to the
`./public` directory when building the site.

{{< hint warning >}}
__Mind your baseURL__  
However, in practice, __none of these options will work when the base URL
includes a subdirectory__ (such as those you are assigned to by default when
deploying through __GitHub Pages__!). In these cases, you have to use a custom
figure shortcode, as the one proposed by
[Kaushal Modi](https://github.com/kaushalmodi)
available from
[here](https://gitlab.com/kaushalmodi/hugo-theme-refined/blob/master/layouts/shortcodes/figure.html)
or [here](https://github.com/Feat-FeAR/logSpace/blob/main/layouts/shortcodes/figure.html).
Just download it and put it into the `./layouts/shortcodes/` folder in order to
override the default one. This shortcode manually prefixes the site baseURL
wherever needed, also allowing for location different from `./static`
(see e.g., [this issue](https://github.com/gohugoio/hugo/issues/4562)).
{{< /hint >}}

---
### Fonts
#### Local fonts
To add custom fonts to a Hugo website, just put your TTF, (or WOFF, or WOFF2)
file into the `./static/fonts` directory, then, when using `@font-face` in your
CSS, you can refer to the font simply as `fonts/my_custom_font_name.ttf`. Just
like with the images, the location of the font file must be the path relative
to `./static`, since all the files therein are directly copied to the `./public`
directory when building the site.
```css
/* Load TTF font */
@font-face {
    font-family: 'MyCustomFont';
    src: url('fonts/my_custom_font_name.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

/* Apply the font to some text element */
.text_element {
    /* Fall back to system-ui if MyCustomFont fails to load */
    font-family: 'MyCustomFont', system-ui;
    font-size: 18px;
    font-weight: bold;
}
```
{{< hint info >}}
`font-family`  
To find the correct _font-family name_ (which could differ from filename), just
open the font file and look at the font name at the top of the window.
{{< /hint >}}

#### Google Fonts
The previous method works offline and doesn't rely on external services.
Alternatively, you can use [Google Fonts](https://fonts.google.com/) to load the
font from their servers. This way you won't need to host the TTF file yourself.
Just go to [Google Fonts](https://fonts.google.com/), select a font you like, choose `Get embed code` and copy either the `<link>` tag
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=MyCustomFont&display=swap" rel="stylesheet">
```
or the `@import` statement
```css
@import url('https://fonts.googleapis.com/css2?family=MyCustomFont&display=swap');
```
and apply it in your CSS as in the previous case.
```css
/* Apply the font to some text element */
.text_element {
    /* Fall back to system-ui if MyCustomFont fails to load */
    font-family: 'MyCustomFont', system-ui;
    font-size: 18px;
    font-weight: bold;
}
```
{{< hint info >}}
__Local Google Fonts__  
Google Fonts also provides a `Download all` option that allows the user to
download the font files locally for complete offline management. In this case,
refer to the previous subsection.
{{< /hint >}}

---
### LaTeX
__LaTeX__ math typesetting is not natively supported by __Hugo__, but it can be
enabled by including the JavaScript LaTeX renderer
[__KaTex__](https://katex.org/) in the pages generated by __Hugo__.
However, many Hugo themes--including the _Hugo Book_ theme used here--already
come with shortcodes for KaTeX support, letting you render math typesetting in
Markdown documents. In order to insert math LaTeX code in a _Hugo Book_ page you
can either use the shortcodes shown in the box below--always remembering that it
is likely to be a theme-specific syntax. Notably, if the `{{</* katex */>}}`
tags have been used at least once in the document, you can also opt for the more
compact bracket notation (which also produces results more consistent with the
final rendering) or even for the standard and more portable double-dollar key,
in the case of display-styled equations.
```tpl
{{</* katex */>}} ... {{</* /katex */>}}           # shortcodes for inline-style
{{</* katex display */>}} ... {{</* /katex */>}}   # shortcodes for display-style

\\( ... \\)                                # bracket for inline-style
\\[ ... \\]                                # bracket for display-style

$$ ... $$                                  # dollars for display-style
```
As an _inline-style_ example of KaTeX rendering, I could exhibit
{{< katex >}}\nabla\cdot\mathbf{B} = 0{{< /katex >}}
as a good argument against the existence of magnetic monopole, while a popular
definition of the fabulous Fourier transform can be seen here below in
_display-style_.
\\[
    \hat{f}\left(\xi\right) =
        \int_{-\infty}^{+\infty}f\left(x\right)\\,e^{-i\\,2\pi\xi x}\\,dx
        \qquad \forall\\,\xi\in\mathbb{R}
\\]

---
### Code blocks
Code blocks can be directly included inside any Markdown document just copying
the code into a properly backquoted section. However, if you want to keep the
source file separate from the Markdown---so that it is easier to maintain---you
can import the code text from the source file using a shortcode like
[this](https://github.com/Feat-FeAR/logSpace/blob/main/layouts/shortcodes/include.html).
Just download it and put it into the `./layouts/shortcodes/` folder. Then,
to get the content of, e.g., `/static/codes/some-script.xxx` properly rendered
in your page, call the following shortcode into a properly backquoted section.
```go
{{%/* include "/static/codes/some-script.xxx" */%}}
```
{{< hint info >}}
__Shortcode delimiters__  
Using the angle bracket styled shortcode delimiter, `❴❴< ... >❵❵`, tells __Hugo__
that the inner content is HTML/plain text and needs no further processing. By
using the percent styled delimiter `❴❴% ... %❵❵`, __Hugo__ will treat the
shortcode body as __Markdown__. Use the most convenient version as appropriate.
{{< /hint >}}

{{< hint warning >}}
__Script path__  
In this case it is correct to indicate the very path where the script is located
_during site development_, without needing to worry about where it will be
copied after the build. This is because the content of the script is embedded in
Markdown _before_ building. Although the location here proposed
(`./static/codes/`) is convenient, any location within the site domain is
acceptable.
{{< /hint >}}

---
### Specials
Depending on the chosen theme, there could be a number of available predefined
shortcodes that can be used to include special blocks--not natively supported
by __Hugo__--into the Markdown.
Beyond the already discussed KeTeX support for LaTeX typesetting, one of the
most useful shortcodes provided by the _Hugo Book_ theme are the _Hint_ boxes,
you can include by
```go
{{</* hint [info|warning|danger] */>}}
**Markdown content here**  
...
{{</* /hint */>}}
```
Hint blocks are available in three flavors--_info_, _warning_, and _danger_--as
shown here below (by the way, example hints are real!).

{{< hint info >}}
__Shortcodes from _Hugo Book_ theme__  
Other useful shortcodes provided by the _Hugo Book_ theme are
[Buttons](https://hugo-book-demo.netlify.app/docs/shortcodes/buttons/),
[Columns](https://hugo-book-demo.netlify.app/docs/shortcodes/columns/),
[Details](https://hugo-book-demo.netlify.app/docs/shortcodes/details/),
[Expand](https://hugo-book-demo.netlify.app/docs/shortcodes/expand/),
[Mermaid Chart](https://hugo-book-demo.netlify.app/docs/shortcodes/mermaid/),
[Section](https://hugo-book-demo.netlify.app/docs/shortcodes/section/), and
[Tabs](https://hugo-book-demo.netlify.app/docs/shortcodes/tabs/).
{{< /hint >}}

{{< hint warning >}}
__Goldmark settings__  
By default, Goldmark (the parser used by Hugo to render Markdown to HTML) trims
unsafe outputs which might prevent some shortcodes from rendering. It is thus
recommended to add the following lines to your `hugo.toml` setting file.
```toml
# Needed for Mermaid/KaTeX shortcodes
[markup.goldmark.renderer]
  unsafe = true
```
{{< /hint >}}

{{< hint danger >}}
__Danger hint__  
There is actually nothing really dangerous about all this...
{{< /hint >}}

---
---
## Themes
### Install a new theme
1. Choose a theme from [the _Hugo Themes_ section](https://themes.gohugo.io/).
1. Since your site is already a Git repository, you can add it as a _Git
Submodule_.
    ```sh
    # For instance, under the root directory of your Hugo site
    git submodule add -f https://github.com/JingWangTW/dark-theme-editor.git themes/dark-theme-editor
    ```
1. Edit the site configuration file `hugo.toml` (in the root of your project)
setting the `theme` property to the theme name (`dark-theme-editor` in this
example).

{{< hint warning >}}
__Cloning Git Submodules__  
A Git submodule is a kind of link within a host Git repository that points to a
specific commit in another external repository. Submodules only track specific
commits and are not automatically updated when the host repository is updated.
When you `git clone` a repository, its possible submodules are not downloaded by
default. To download a repository including submodules use instead
```sh
# Locally download the source of the current web site, including the theme(s) 
git clone --recurse-submodules -j8 git@github.com:Feat-FeAR/logSpace.git
```
where `-j8` is just an optional performance optimization to fetches up to 8
submodules at a time in parallel.
{{< /hint >}}

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
1. Delete the relevant section from the `.gitmodules` file.
1. Stage the changes `git add .gitmodules`.
1. Delete the relevant section from `.git/config`.
1. Run `git rm --cached <path_to_submodule>` (no trailing slash).
1. Run `rm -rf .git/modules/<path_to_submodule>` (no trailing slash).
1. Commit `git commit -m "Removed submodule <name>"`.
1. Delete the now untracked submodule files `rm -rf <path_to_submodule>`.

---
---
## Release
If _GitHub Actions_ have been properly set, __GitHub will automatically rebuild
your site and deploy the changes without the need for further steps beyond the
push of the new commit__.

Otherwise, you have to remember that to _publish_ the site is not to _deploy_
it. In this step you will do just the first thing, for which Hugo creates the
entire static site in the `./public` subdirectory in the root of your project.
This includes the HTML files, and assets such as images, CSS files, and
JavaScript files. Here's how to proceed.
1. Since your `./public` directory may contain extraneous files from a previous
build, a common practice is to manually clear the contents of `./public` before
each new build in order to remove draft, expired, and future content.
1. Change the `draft` field from `true` to `false` on all the pages you want to
publish.
1. Publish your site by simply typing:
```sh
hugo
```
Now you will find the site inside the `./public` folder, ready to be deployed.
