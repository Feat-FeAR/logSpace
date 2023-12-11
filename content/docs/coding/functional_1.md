+++
title = 'Functional'
date = 2023-11-17T23:54:16+01:00
draft = false
+++

# Functional Programming

If you approached coding with an imperative object-oriented language such as
__C++__ or __Java__, the functional programming paradigm may look like something
perverse to you. If, on the other hand, you have affinity for calculus,
programming in terms of functions will sound more natural and familiar. Finally,
if like me you have a Physics master's degree AND started programming with
__C++__, well, it may be time for you to come to terms with your mind. Let me
give it a try...


## Create a function
In __JavaScript__ you can create functions in 2 ways:
* by Function Declaration
* as Function Expressions

### Function Declarations
C-style syntax function declarations are used to create _named functions_.
These functions can be called using their declared name.
```js
// JS Function Declaration
function twoFold(num) {
	return 2 * num;
}
```
A similar syntax is also used, for instance, in __Python__
```py
# Python Function Declaration
def twoFold(num):
	return 2 * num
```
or in __MATLAB__, except that, in this case, the returned value must also be
indicated to the left of the `=` symbol in function declaration (the `return`
keyword has a different usage here).
```matlab
% MATLAB Function Declaration
function doubledNum = twoFold(num)
	doubledNum = 2 * num;
end
```

### Function Expressions
Function expressions create functions inside an expression instead of through a
function declaration. These functions are usually __anonymous functions__ that
do not have a name property, but can be (optionally) assigned to a variable in
order to refer to it (i.e., we can invoke it with the variable name we assigned
it to).
```js
// JS Function Expressions - traditional syntax
const twoFold = function(num) {
	return 2 * num;
}

// JS Arrow Function - concise syntax (starting from ES6)
const y = x => 2*x;
```
Notably, this is also the standard way of defining functions in __R__,
```r
# R Function Definition - traditional syntax
twoFold <- function(num) {
	return(2 * num)
}

# R Shorthand notation (starting from R 4.1.0)
y <- \(x) 2*x
```
or the _lambda functions_ in __Python__,
```py
# Python lambda function notation
y = lambda x: 2*x
```
or the _anonymous functions_ in __MATLAB__.
```matlab
% MATLAB anonymous function notation
y = @(x) 2*x;
```

## Functions as first-class objects
In functional programming, functions are treated as _first-class citizens_,
meaning that they can be bound to names (including local identifiers), passed as
arguments, and returned from other functions, just as any other data type can.
You can do with a function whatever you can do with any other object.

In __JS__, functions are special objects because they can be _invoked_.
Nevertheless, they have properties (such as `.length` and `.name`) and methods
(such as `.toString()`) like any other object, and we can still treat them as
such.

Function expressions seem to reflect this aspect more than function declarations
and for this reason they have been gradually taking over, although both ways can
be used within a __JS__ functional paradigm context. 

Functions that return and/or take functions as arguments are called _higher-order
functions_, being analogous to the mathematical concept of _operator_. Functions
that get passed in as parameters to another (higher-order) function are known as
_callback functions_. Callback functions get invoked during the execution of the
higher-order function.
```js
const log2 = x => Math.log2(x);         // Callback function 1
const plus1 = x => x+1;                 // Callback function 2
const compose = (g,f,x) => f(g(f(x)));  // Higher-order function

console.log(
	compose(plus1, log2, 8)
); // returns 2
```
In a functional programming context, it is common practice to define callback
functions on the fly (_in-place_) as anonymous functions.
```js
console.log(
	compose(x => x+1, x => Math.sqrt(x), 9)
); // returns 2
```
that is the __JS__-equivalent of the following __R__ code:
```r
compose <- function(g,f,x) {
  return(f(g(f(x))))
}

compose(\(x)x+1, sqrt, 9) # returns 2
```
Everything can be made even more abstract if we use the `compose` higher-order
function to take __and return__ a pure function instead of a numeric value
(just like a real mathematical operator).
```js
// JS operator definition (last round brackets are not even needed...)
const compose = (g,f) => (x => f(g(f(x))));         // Higher-order Function

// Ordinary functions can then be created specifying the operator's arguments
// and assigned to an identifier to be invoked...
const h = compose(x => x+1, x => Math.log2(x));     // Ordinary Function
console.log(h(8)); // returns 2                     // Evaluated Function

// ...or not
console.log(
  compose(x => x+1, x => Math.sqrt(x))(9)
); // returns 2
```
This can be translated in __R__ as
```r
# R operator definition
compose <- function(g,f) {
  return(function(x) {
    return(f(g(f(x))))
  })
}

# or more concisely (last round brackets are not even needed...)
compose <- \(g,f)(\(x)f(g(f(x))))

compose(\(x)x+1, sqrt)(9) # returns 2
```

## Iterators
Instead of using loops, pure functional programming languages use _iterators_
to achieve the same result. Iterators are higher-order functions that take in
both data and (possibly anonymous) callback functions, and apply the latter to
the former. These iterators are often called `Map`, `Filter`, `Reduce`...

In __JS__ iterators are implemented in the form of _array methods_ that can be
called on array objects to manipulate elements and return values. There are many
iteration methods:
* The `.forEach()` method executes a callback function on each element in the
	array in order. Its return value is discarded.
* The `.map()` method creates a new array populated with the results of calling
	a provided callback function on every element in the calling array.
* The `.filter()` method creates a _shallow copy_ of a portion of a given array,
	filtered down to just the elements that pass the test implemented by the
	provided function.
* The `.reduce()` method executes a user-supplied _reducer_ callback function on
	each element of the array, in order, passing in the return value from the
	calculation on the preceding element, until a single value is produced.
	Specifically, the callback function has two parameters, `accumulator` and
	`currentValue`. The value of `accumulator` starts off as the value of the
	first element in the array and the `currentValue` starts as the second
	element. As `.reduce()` iterates through the array, the return value of the
	callback function becomes the `accumulator` value for the next iteration,
	while `currentValue` takes on the value of the current element in the looping
	process.

Other frequently used iteration methods are `.findIndex()`, `.every()`, and
`.some()`. See the complete list of the built-in array methods and the related
documentation on the
[Mozilla Developer Network (MDN) Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
page.
```js
// Application of JS main iterators
data = [0.5, 1, 2, 8];
const compose = (g,f) => (x => f(g(f(x))));

data.forEach(x => console.log(x)); // It just prints the elements of the array.
// The `.forEach` method has `undefined` return
// The callback function has no return

console.log(
	data.map(compose(x => x+1, x => Math.log2(x)))
); // returns [ -Infinity, 0, 1, 2 ]

console.log(
	data.filter(x => x >= 1)
); // returns [ 1, 2, 8 ]

const sum = data.reduce((accumulator, currentValue) => {
  console.log('The value of accumulator : ', accumulator );
  console.log('The value of currentValue: ', currentValue);
  return accumulator + currentValue;
});
console.log(sum); // returns 11.5
```
__R__ comes with the `*apply()` family of functions (which are implementations
of `Map`), as well as `Map()`, `Filter()`, and `Reduce()` for functional
programming. As an alternative, the `{purrr}` package from the _Tidyverse_
provides a more complete and consistent set of tools for functional programming,
including the `map()`, `reduce()`, and `keep()` functions.
```r
data <- c(0.5, 1, 2, 8)
compose <- \(g,f)(\(x)f(g(f(x))))

sapply(data, print) # prints the elements of the array and returns it as a vector
# or, alternatively,
Map(print, data) # prints the elements of the array and returns it as a list

sapply(data, compose(\(x)x+1, log2)) # returns: -Inf 0 1 2 (as a vector)
# or, alternatively,
Map(compose(\(x)x+1, log2), data) # returns -Inf 0 1 2 (as a list)

Filter(\(x){x >= 1}, data) # returns: 1 2 8
Reduce('+', data) # returns: 11.5
```

## Pipes
Within the functional paradigm, it is generally preferred to _compose_ functions
through __pipe operators__ rather than to nest them. This greatly improves the
readability (and maintainability) of code, as shown in the following __R__
example (see also
[New features in R 4.1.0](https://www.jumpingrivers.com/blog/new-features-r410-pipe-anonymous-functions/)
).
```r
data <- c(0.5, 1, 2, 8)
compose <- \(g,f)(\(x)f(g(f(x))))

# Compare the clarity of the following pipe...
Filter(\(x){x >= 1}, data) |> sapply(compose(\(x)x+1, log2)) |> sum()

# ...with the equivalent nested form
sum(sapply(Filter(\(x){x >= 1}, data), compose(\(x)x+1, log2)))  # both return 3
```
Notice that both nesting and pipes are suitable to limit the use of unnecessary
variables, but pipes, in addition, maintain the natural sequence of
function-calls in the written code.

{{< hint warning >}}
__R native pipe__  
Notice that the __R__ native pipe operator `|>` (starting from _R 4.1.0_)
inserts the left-hand side object as the _first argument_ in the right-hand side
function. However, _R 4.2.0_ added a `_` placeholder to the base pipe, with one
additional restriction: the argument has to be named. For example,
`x |> f(1, y = _)` is equivalent to `f(1, y = x)`. As an alternative, you can
always define your own custom anonymous function directly _in-pipe_.
```r
# Anonymous functions can be used as early as they are defined (just enclose
# them in round or curly brackets)
(\(x){x*x})(3) # Returns 9
c(1,2,3) |> {\(x)x^2+1}() |> sum() # Returns 17

animals <- c("dog", "sheep", "frog", "pig")
# Unary operator (no problem)
animals |> toupper()
# Binary operator that need to be piped in first position (standard behavior)
animals |> sapply(nchar)
# Binary operator that need to be piped in second position -> Doesn't work!
animals |> grepl(".*og$")
# Pipe placeholder used as a named argument -> OK
animals |> grepl(".*og$", x=_)
# Anonymous function in-pipe definition -> OK
animals |> {\(x)grepl(".*og$",x)}()
```
On top of that, Tidyverse _magrittr_ package pipe operaror `%>%` still offers
[some more advanced features](https://www.tidyverse.org/blog/2023/04/base-vs-magrittr-pipe/).
{{< /hint >}}

As for __JavaScript__, it does not have a native pipe operator like some other
languages. However, you can achieve a similar effect using _method chaining_.
```js
data = [0.5, 1, 2, 8];
const compose = (g,f) => (x => f(g(f(x))));

console.log(
	data
	.filter(x => x >= 1)
	.map(compose(x => x+1, x => Math.log2(x)))
	.reduce((x,y) => x+y)
); // returns 3
```

## Further readings on Functional Programming in R

* [Lecture Notes: R as a Functional Programming Language](https://www.stat.umn.edu/geyer/8054/notes/functional.html)
* [R-bloggers: Functional programming in R](https://www.r-bloggers.com/2014/04/functional-programming-in-r/)
* [Advanced R: Functional programming](http://adv-r.had.co.nz/Functional-programming.html)
* [Advanced R: Functionals](http://adv-r.had.co.nz/Functionals.html)
* [Advanced R: Function operators](http://adv-r.had.co.nz/Function-operators.html)
* [Modern R with the tidyverse: Functional programming](https://modern-rstats.eu/functional-programming.html)
