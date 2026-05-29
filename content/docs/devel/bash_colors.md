---
title: "Bash Colors"
weight: 40
draft: false
# bookFlatSection: false
# bookToc: true
# bookHidden: false
# bookCollapseSection: false
# bookComments: false
# bookSearchExclude: false
---

# Color Text in Bash

## Escape sequences
Color information is typically introduced by the ANSI escape sequence `\033` or `\e`---representing the ASCII `ESC` character 27---followed by the _Control Sequence Introducer_ (CSI) `[`.
Text-formatting parameters can then be inserted (see tables below), in any  case ending with command `m`, which is the ANSI command letter to apply text styling/color settings.

So, here’s what every color tag will look like:
```text
\033[<n>m
```
or
```text
\e[<n>m
```
where `<n>` is a placeholder for the actual color code.
As an example, the following line can be used to print a red text line:
```sh
echo -e "\e[31mHello\e[0m"
```

## Text color codes
Here below, __F__ is for "Foreground" and __B__ is for "Background".

| Color   | F Standard | F Bright (+60) | B Standard (+10) | B Bright (+10 +60) |
|:-------:|:----------:|:--------------:|:----------------:|:------------------:|
| Black   | `30`       | `90`           | `40`             | `100`              |
| Red     | `31`       | `91`           | `41`             | `101`              |
| Green   | `32`       | `92`           | `42`             | `102`              |
| Yellow  | `33`       | `93`           | `43`             | `103`              |
| Blue    | `34`       | `94`           | `44`             | `104`              |
| Magenta | `35`       | `95`           | `45`             | `105`              |
| Cyan    | `36`       | `96`           | `46`             | `106`              |
| White   | `37`       | `97`           | `47`             | `107`              |

When both Foreground and Background colors are set, color codes need to be separated by a semicolon `;`.
Example:
```sh
echo -e "\e[30;43mBlack on yellow\e[0m"
```

## Text attributes codes
You can also specify an attribute for the text.
This attribute must be added _before_ the color number, separated by a semicolon `;`.

| Code | Effect |
|------|--------|
| `0`  | Reset to normal<sup>1</sup> |
| `1`  | __Bold__ |
| `2`  | Dim |
| `3`  | _Italic_ |
| `4`  | Underline |
| `5`  | Blink |
| `7`  | Reverse video<sup>2</sup> |
| `8`  | Hidden |
| `9`  | Strikethrough |

<sup>1</sup> This is why all colored text should be terminated with the tag `\e[0m`.

<sup>2</sup> This inverts the foreground and background colors.

Example:
```sh
echo -e "\e[1;4;31mBold Underlined Red\e[0m"
```

{{< hint warning >}}
__WARNING__  
Keep in mind that text with these attributes could look different in different terminal emulators.
For instance, _blinking text_ (attribute 5) does not work in most terminal emulators.
{{< /hint >}}

## 256 colors
Modern terminals support extended palettes through the tag pattern:
```text
\e[38;5;<n>m
```
Background color uses `48` instead of `38`.

Example:
```sh
echo -e "\e[38;5;31mBright Teal Text\e[0m"
```
Show all:
```sh
for (( i = 0; i < 256; i++ )); do
  echo -e "\e[38;5;${i}mAll work and no play makes Jack a dull boy.\e[0m"
done
```

## Truecolor (24-bit RGB)
Modern terminals also support full RGB color through the tag pattern:
```text
\e[38;2;R;G;Bm
```
Background color uses `48` instead of `38`.

Example:
```bash
echo -e "\e[38;2;255;120;0mTruecolor orange\e[0m"
```
