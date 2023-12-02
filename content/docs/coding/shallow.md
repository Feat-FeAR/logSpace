+++
title = 'Shallow vs deep'
date = 2023-11-17T23:20:42+01:00
draft = true
+++

# Shallow copies vs deep copies

Pay fucking attention to this

```js
a = 5
b = a;
console.log(a);
console.log(b);

a = 7;
console.log(a);
console.log(b);

a = [1, 2, 3, 5];
b = a;
console.log(a);
console.log(b);

a[1] = 200;
console.log(a);
console.log(b);

a = a.map(a => a*10);
console.log(a);
console.log(b);

a = 'string'
console.log(a);
console.log(b);
```

per gli array const si riferisce alla struttura piuttosto che al valore degli elementi

stessa cosa per gli oggetti (e in effetti gli array sono oggetti particolari)
 Objects are mutable meaning we can update them after we create them!
It’s important to know that although we can’t reassign an object declared with const, we can still mutate it, meaning we can add new properties and change the properties that are there.

---

Mutation means change, and in programming that usually means evolved through multiple iterations over the same data structure. When we change the value of an element in an array, add to or delete a value from the array, we mutate that array. It’s still an array, but the contents have been altered.
Obviously any change to anything could be called mutation. For our purposes, if it is not an array or object, it is a set event, rather than a mutation. We are changing a state. Mutation means a data structure has changed.

Objects are passed by reference. This means when we pass a variable assigned to an object into a function as an argument, the computer interprets the parameter name as pointing to the space in memory holding that object. As a result, functions which change object properties actually mutate the object permanently (even when the object is assigned to a const variable).

https://stackoverflow.com/questions/2612802/how-do-i-clone-a-list-so-that-it-doesnt-change-unexpectedly-after-assignment

https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy



