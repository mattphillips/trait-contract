import { expect } from 'chai';

import Trait from './';

describe('Trait', () => {
  const Database = Trait({
    create: ['message'],
    read: [],
    update: ['id', 'message'],
    delete: ['id']
  });

  describe('validate implementation against contract', () => {
    it('throws an error when implmentation does not conform to contract', () => {
      expect(() => Database.impl({
        create: message => message,
        read: () => undefined,
        delete: id => id
      })).to.throw('Expected function: update has not been implemented.');
    });

    it('does not throw an error when implmentation conforms to contract', () => {
      expect(() => Database.impl({
        create: message => message,
        read: () => undefined,
        update: (id, message) => ({ id, message }),
        delete: id => id
      })).to.not.throw(Error);
    });
  });

  describe('validate implementation function arguments against contract', () => {
    it('throws an error when function is not called with enough arguments', () => {
      const actual = Database.impl({
        create: (message) => ({}),
        read: () => undefined,
        update: (id, message) => ({}),
        delete: (id) => ({})
      });
      expect(() => actual.create()).to.throw('Expected: 1 argument/s but received: 0');
    });

    it('throws an error when function is called with too many arguments', () => {
      const actual = Database.impl({
        create: message => message,
        read: () => undefined,
        update: (id, message) => ({ id, message }),
        delete: id => id
      });
      expect(() => actual.create('Hello, world!', 2)).to.throw('Expected: 1 argument/s but received: 2');
    });

    it('does not throw an error when function is called with correct number of arguments', () => {
      const actual = Database.impl({
        create: message => message,
        read: () => undefined,
        update: (id, message) => ({ id, message }),
        delete: id => id
      });
      expect(() => actual.create('Hello, world!')).to.not.throw(Error);
    });
  });
});
