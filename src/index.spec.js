import { expect } from 'chai';

import Trait from './';

describe('Trait', () => {
  const Database = Trait({
    create: ['message'],
    read: [],
    update: ['id', 'message'],
    delete: ['id']
  });

  const databaseUnderTest = Database.impl({
    create: message => message,
    read: () => undefined,
    update: (id, message) => ({ id, message }),
    delete: id => id
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
      expect(() => databaseUnderTest).to.not.throw(Error);
    });
  });

  describe('validate implementation function arguments against contract', () => {
    it('throws an error when function is not called with enough arguments', () => {
      expect(() => databaseUnderTest.create()).to.throw('Expected: 1 argument/s but received: 0');
    });

    it('throws an error when function is called with too many arguments', () => {
      expect(() => databaseUnderTest.create('Hello, world!', 2)).to.throw('Expected: 1 argument/s but received: 2');
    });

    it('does not throw an error when function is called with correct number of arguments', () => {
      expect(() => databaseUnderTest.create('Hello, world!')).to.not.throw(Error);
    });
  });

  describe('when implementation conforms to contract', () => {
    it('calls implementation functions with given arguments (identity)', () => {
      expect(databaseUnderTest.create('Hello, world!')).to.equal('Hello, world!');
      expect(databaseUnderTest.read()).to.equal(undefined);
      expect(databaseUnderTest.update(1, 'Hello, world!')).to.deep.equal({ id: 1, message: 'Hello, world!' });
      expect(databaseUnderTest.delete(1)).to.equal(1);
    });
  });
});
