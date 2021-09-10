# `Promise.any` Polyfill

A polyfill for the `Promise.any` function.

### [Find promise-any-polyfill on NPM.](https://www.npmjs.com/package/promise-any-polyfill)

## Table of Contents

 - [Installation](#installation)
 - [Basic Usage](#basic-usage)
 - [Documentation](#documentation)
 - [License](#license)

## Installation

Install from NPM with

```
$ npm install --save promise-any-polyfill
```

## Basic Usage

This package implements the upcoming `Promise.any(...)` functionality, and it can be used as follows:

```typescript
Promise.any([
    timedResolvingPromise(50, "what's up?"),
    timedResolvingPromise(25, "I'm quick!"),
    timedResolvingPromise(75, "I'm late!")
]).then((result: string): void => console.log(result)); //=> "I'm quick!"
```

As you can see from the above example, `Promise.any` will resolve to the value of the first resolving Promise that was
passed to the function`.

If all promises reject, `Promise.any` will reject with an array of each of the rejection values from the Promises passed
to the function.

```typescript
Promise.any([
    timedRejectingPromise(50, "...somewhere down the middle..."),
    timedRejectingPromise(25, "I failed first!"),
    timedRejectingPromise(75, "...at least I failed last!")
]).catch((error: string): void => console.error(error)); //=> ["I failed first!", "...somewhere down the middle...", "...at least I failed last!"]
```

`Promise.any` will ignore any rejecting Promises so long as at least one of the Promises passed to the function
resolves.

```typescript
Promise.any([
	timedRejectingPromise(25, "I'm first, but I'm failing!"),
	timedResolvingPromise(50, "I'm the only one resolving!"),
    timedRejectingPromise(75, "I'm last AND failing!")
]).then((result: string): void => console.log(result)); //=> "I'm the only one resolving!"
```

## Documentation

See the [wiki](https://github.com/T99/promise-any-polyfill/wiki) for full documentation.

## License

promise-any-polyfill is made available under the GNU General Public License v3.

Copyright (C) 2021 Trevor Sears
