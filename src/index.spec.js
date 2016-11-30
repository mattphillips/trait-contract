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
    it('throws error when implmentation does not conform to contract', () => {
      expect(() => Database.impl({
        create: message => message,
        read: () => ({}),
        delete: id => id
      })).to.throw('Expected function: update has not been implemented.');
    });

    it('does not throw error when implmentation conforms to contract', () => {
      expect(() => Database.impl({
        create: message => message,
        read: () => ({}),
        update: (id, message) => ({ id, message }),
        delete: id => id
      })).to.not.throw(Error);
    });
  });
});
