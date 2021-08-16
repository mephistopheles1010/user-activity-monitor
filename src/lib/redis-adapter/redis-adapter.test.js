const chai = require('chai');
const spies = require('chai-spies');

const RedisAdapter = require('./redis-adapter');


chai.use(spies);
const { expect } = chai;

const redisClientMocked = {
  sadd: (setName, value, callback) => {
    return callback(null, 1);
  },
  srem: (setName, value, callback) => {
    return callback(null, 1);
  },
  sismember: (setName, value, callback) => {
    return callback(null, 0);
  },
  scard: (setName, callback) => {
    return callback(null, 0);
  }
};

const redisAdapter = new RedisAdapter(redisClientMocked);


describe('RedisAdapter', () => {

  describe('addToSet', () => {
    it(`call redisClient sadd method with appropriate params`, async () => {
      const saddSpy = chai.spy.on(redisClientMocked, 'sadd');
      const setName = 'testSetName';
      const value = 'testValue';
      await redisAdapter.addToSet(setName, value);
      chai.spy.restore(redisClientMocked);
      expect(saddSpy).to.have.been.called.with(setName, value);
    });

    it(`if call redisClient sadd return an error, an exception will be thrown`, async () => {
      redisClientMocked.originals = {
        sadd: redisClientMocked.sadd
      }
      const error = 'testError';
      let thrownError = null;
      redisClientMocked.sadd = (setName, value, callback) => {
        callback(error);
      }
      const setName = 'testSetName';
      const value = 'testValue';
      try {
        await redisAdapter.addToSet(setName, value);
      } catch (err) {
        thrownError = err;
      }
      expect(thrownError).to.be.equal(error);
      redisClientMocked.sadd = redisClientMocked.originals.sadd;
    });

  });

  describe('removeFromSet', () => {
    it(`call redisClient srem method with appropriate params`, async () => {
      const sremSpy = chai.spy.on(redisClientMocked, 'srem');
      const setName = 'testSetName';
      const value = 'testValue';
      await redisAdapter.removeFromSet(setName, value);
      chai.spy.restore(redisClientMocked);
      expect(sremSpy).to.have.been.called.with(setName, value);
    });

    it(`if call redisClient srem return an error, an exception will be thrown`, async () => {
      redisClientMocked.originals = {
        srem: redisClientMocked.srem
      }
      const error = 'testError';
      let thrownError = null;
      redisClientMocked.srem = (setName, value, callback) => {
        callback(error);
      }
      const setName = 'testSetName';
      const value = 'testValue';
      try {
        await redisAdapter.removeFromSet(setName, value);
      } catch (err) {
        thrownError = err;
      }
      expect(thrownError).to.be.equal(error);
      redisClientMocked.srem = redisClientMocked.originals.srem;
    });

  });

  describe('isInSet', () => {
    it(`call redisClient sismember method with appropriate params`, async () => {
      const sismemberSpy = chai.spy.on(redisClientMocked, 'sismember');
      const setName = 'testSetName';
      const value = 'testValue';
      await redisAdapter.isInSet(setName, value);
      chai.spy.restore(redisClientMocked);
      expect(sismemberSpy).to.have.been.called.with(setName, value);
    });

    it(`if call redisClient sismember return an error, an exception will be thrown`, async () => {
      redisClientMocked.originals = {
        sismember: redisClientMocked.sismember
      }
      const error = 'testError';
      let thrownError = null;
      redisClientMocked.sismember = (setName, value, callback) => {
        callback(error);
      }
      const setName = 'testSetName';
      const value = 'testValue';
      try {
        await redisAdapter.isInSet(setName, value);
      } catch (err) {
        thrownError = err;
      }
      expect(thrownError).to.be.equal(error);
      redisClientMocked.sismember = redisClientMocked.originals.sismember;
    });

    it(`if call redisClient sismember return 1, isInSet return true`, async () => {
      redisClientMocked.originals = {
        sismember: redisClientMocked.sismember
      }
      redisClientMocked.sismember = (setName, value, callback) => {
        callback(null, 1);
      }
      const setName = 'testSetName';
      const value = 'testValue';
      const isInSet = await redisAdapter.isInSet(setName, value);
      expect(isInSet).to.be.equal(true);
      redisClientMocked.sismember = redisClientMocked.originals.sismember;
    });

    it(`if call redisClient sismember return 0, isInSet return false`, async () => {
      redisClientMocked.originals = {
        sismember: redisClientMocked.sismember
      }
      redisClientMocked.sismember = (setName, value, callback) => {
        callback(null, 0);
      }
      const setName = 'testSetName';
      const value = 'testValue';
      const isInSet = await redisAdapter.isInSet(setName, value);
      expect(isInSet).to.be.equal(false);
      redisClientMocked.sismember = redisClientMocked.originals.sismember;
    });

  });

  describe('getSetCardinality', () => {
    it(`call redisClient scard method with appropriate params`, async () => {
      const scardSpy = chai.spy.on(redisClientMocked, 'scard');
      const setName = 'testSetName';
      await redisAdapter.getSetCardinality(setName);
      chai.spy.restore(redisClientMocked);
      expect(scardSpy).to.have.been.called.with(setName);
    });

    it(`if call redisClient scard return an error, an exception will be thrown`, async () => {
      redisClientMocked.originals = {
        scard: redisClientMocked.scard
      }
      const error = 'testError';
      let thrownError = null;
      redisClientMocked.scard = (setName, callback) => {
        callback(error);
      }
      const setName = 'testSetName';
      try {
        await redisAdapter.getSetCardinality(setName);
      } catch (err) {
        thrownError = err;
      }
      expect(thrownError).to.be.equal(error);
      redisClientMocked.scard = redisClientMocked.originals.scard;
    });

    it(`getSetCardinality return the same number as redisClient scard`, async () => {
      const expectedSetCardinality = 10;
      redisClientMocked.originals = {
        scard: redisClientMocked.scard
      }
      redisClientMocked.scard = (setName, callback) => {
        callback(null, expectedSetCardinality);
      }
      const setName = 'testSetName';
      const setCardinality = await redisAdapter.getSetCardinality(setName);
      expect(setCardinality).to.be.equal(expectedSetCardinality);
      redisClientMocked.scard = redisClientMocked.originals.scard;
    });

  });
});