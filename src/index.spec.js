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
    test('throws an error when implmentation does not conform to contract', () => {
      expect(() => Database.impl({
        create: message => message,
        read: () => undefined,
        delete: id => id
      })).toThrow('Expected function: update has not been implemented.');
    });

    test('does not throw an error when implmentation conforms to contract', () => {
      expect(() => databaseUnderTest).not.toThrow(Error);
    });
  });

  describe('validate implementation function arguments against contract', () => {
    test('throws an error when function is not called with enough arguments', () => {
      expect(() => databaseUnderTest.create()).toThrow('Expected: 1 argument/s but received: 0');
    });

    test('throws an error when function is called with too many arguments', () => {
      expect(() => databaseUnderTest.create('Hello, world!', 2)).toThrow('Expected: 1 argument/s but received: 2');
    });

    test('does not throw an error when function is called with correct number of arguments', () => {
      expect(() => databaseUnderTest.create('Hello, world!')).not.toThrow(Error);
    });
  });

  describe('when implementation conforms to contract', () => {
    test('calls implementation functions with given arguments (identity)', () => {
      expect(databaseUnderTest.create('Hello, world!')).toEqual('Hello, world!');
      expect(databaseUnderTest.read()).toEqual(undefined);
      expect(databaseUnderTest.update(1, 'Hello, world!')).toEqual({ id: 1, message: 'Hello, world!' });
      expect(databaseUnderTest.delete(1)).toEqual(1);
    });
  });

  describe('when implementation has extra properties', () => {
    const identity = id => id;
    const implementationWithExtra = Database.impl({
      create: message => message,
      read: () => undefined,
      update: (id, message) => ({ id, message }),
      delete: id => id,
      identity,
      nonFn: 'hello'
    });

    test('non function properties are not removed or turned into functions', () => {
      expect(implementationWithExtra.nonFn).toEqual('hello');
    });

    test('extra functions are not removed', () => {
      expect(typeof implementationWithExtra.identity === 'function').toBe(true);
    });

    test('extra functions do not throw errors when invoked with any number of arguements', () => {
      expect(implementationWithExtra.identity(1)).toEqual(1);
      expect(implementationWithExtra.identity(1, 2)).toEqual(1);
    });
  });
});
