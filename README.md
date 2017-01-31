# Trait Contract

[![Greenkeeper badge](https://badges.greenkeeper.io/mattphillips/trait-contract.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/mattphillips/trait-contract.svg?branch=master)](https://travis-ci.org/mattphillips/trait-contract)
[![Coverage Status](https://coveralls.io/repos/github/mattphillips/trait-contract/badge.svg?branch=master)](https://coveralls.io/github/mattphillips/trait-contract?branch=master)

Utility to build a Trait (Interface) for a given Type. The Trait's contract is used to validate against the implementation, throwing an `Error` if the implementation is missing a property of the Trait.

If an implementation conforms to it's Trait then the given functions are validated for the number of arguments they are invoked with, throwing an `Error` if called with too few or too many arguments.

## Example

``` js
const Database = Trait({
  create: ['x'],
  read: [],
  update: ['id', 'x'],
  delete: ['id']
});

const InMemoryDatabase = {
  create: (x) => { ... },
  read: () => { ... },
  update: (id, x) => { ... },
  delete: (id) => { ... }
};

const PersistentDatabase = {
  create: (x) => { ... },
  read: () => { ... },
  update: (id, x) => { ... }
};

const app = (dbImpl) => {

  const db = Database.impl(dbImpl);

  // Calling create function with one argument conforms to Database Trait's
  // contract and runs the implementation of create function with 'Hello, world!'.
  db.create('Hello, world!');

  // Calling create function with two arguments does not conform to the Database
  // Trait's contract so an Error is thrown because create function expects to
  // receive one argument.
  db.create('Hello,', 'world!');
}

// InMemoryDatabase conforms to Database Trait's contract used by app so no Error is thrown.
app(InMemoryDatabase);

// PersistentDatabase does not conform to Database Trait's contract used by app
// so an Error is thrown because the delete function is missing from the implementation.
app(PersistentDatabase);
```
