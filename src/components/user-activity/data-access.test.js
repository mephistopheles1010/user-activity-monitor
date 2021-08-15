const chai = require('chai');
const spies = require('chai-spies');

const UserActivityDataAccess = require('./data-access');


chai.use(spies);
const { expect } = chai;

const userActivityStorage = {
  addToSet: async (setName, value) => { },
  removeFromSet: async (setName, value) => { },
  isInSet: async (setName, value) => { return false },
  getSetCardinality: async (setName) => { return 0 }
};
const userActivityDataAccess = new UserActivityDataAccess(userActivityStorage);


describe('UserActivityDataAccess', () => {
  describe('addTrackId', () => {
    it('if setId or id or both are not specified return false', async () => {
      const paramsList = [
        {},
        { id: 'testId' },
        { setId: 'testSetId', },
      ];
      paramsList.forEach(async (params) => {
        const isTracked = await userActivityService.addTrackId(params.setId, params.id);
        expect(isTracked).to.be.equal(false);
      });
    });

    it(`if setId and id are specified return true 
        and call data access layer method "addToSet" with appropriate params`, async () => {
      const addToSetSpy = chai.spy.on(userActivityStorage, 'addToSet');
      const id = 'testId';
      const currentISODate = (new Date).toISOString().split('T')[0];
      const isTracked = await userActivityDataAccess.addTrackId(currentISODate, id);
      chai.spy.restore(userActivityStorage);
      expect(isTracked).to.be.equal(true);
      expect(addToSetSpy).to.have.been.called.with(`${currentISODate}_id`, id);
    });

  });

  describe('addTrackPair', () => {
    it('if setId or id or ip or all are not specified return false', async () => {
      const paramsList = [
        {},
        { ip: 'testIp' },
        { id: 'testId' },
        { setId: 'testSetId' },
        { setId: 'testSetId', ip: 'testIp' },
        { setId: 'testSetId', id: 'testId' },
        { ip: 'testIp', id: 'testId' },
      ];
      paramsList.forEach(async (params) => {
        const isTracked = await userActivityService.addTrackPair(params.setId, params.id, params.ip);
        expect(isTracked).to.be.equal(false);
      });
    });

    it(`if setId and id and ip are specified return true 
    and call appropriate data access layer methods with appropriate params`, async () => {
      const addToSetSpy = chai.spy.on(userActivityStorage, 'addToSet');
      const removeFromSetSpy = chai.spy.on(userActivityStorage, 'removeFromSet');
      const id = 'testId';
      const ip = 'testIp';
      const currentISODate = (new Date).toISOString().split('T')[0];
      const isTracked = await userActivityDataAccess.addTrackPair(currentISODate, id, ip);
      chai.spy.restore(userActivityStorage);
      expect(isTracked).to.be.equal(true);
      expect(addToSetSpy).to.have.been.called.with(`${currentISODate}_id`, id);
      expect(addToSetSpy).to.have.been.called.with(`${currentISODate}_ip`, ip);
      expect(removeFromSetSpy).to.have.been.called.with(`${currentISODate}_ip_without_id`, ip);
    });

  });

  describe('addTrackIp', () => {
    it('if setId or ip or both are not specified return false', async () => {
      const paramsList = [
        {},
        { ip: 'testIp' },
        { setId: 'testSetId', },
      ];
      paramsList.forEach(async (params) => {
        const isTracked = await userActivityService.addTrackIp(params.setId, params.ip);
        expect(isTracked).to.be.equal(false);
      });
    });

    it(`if setId and ip are specified return true 
        and call data access layer methods "addToSet" and "isInSet" with appropriate params`, async () => {
      userActivityStorage.isInSet = async (setName, value) => { return true };
      const isInSetSpy = chai.spy.on(userActivityStorage, 'isInSet');
      const addToSetSpy = chai.spy.on(userActivityStorage, 'addToSet');
      const ip = 'testIp';
      const currentISODate = (new Date).toISOString().split('T')[0];
      const isTracked = await userActivityDataAccess.addTrackIp(currentISODate, ip);
      chai.spy.restore(userActivityStorage);
      expect(isTracked).to.be.equal(true);
      expect(addToSetSpy).to.have.been.called.with(`${currentISODate}_ip_without_id`, ip);
      expect(isInSetSpy).to.have.been.called.with(`${currentISODate}_ip`, ip);
    });

    it(`if ip already tracked in pair with id call data access layer methods "removeFromSet" with appropriate params`, async () => {
      userActivityStorage.originals = {
        isInSet: userActivityStorage.isInSet
      }
      userActivityStorage.isInSet = async (setName, value) => { return true };
      const removeFromSetSpy = chai.spy.on(userActivityStorage, 'removeFromSet');
      const ip = 'testIp';
      const currentISODate = (new Date).toISOString().split('T')[0];
      const isTracked = await userActivityDataAccess.addTrackIp(currentISODate, ip);
      chai.spy.restore(userActivityStorage);
      userActivityStorage.isInSet = userActivityStorage.originals.isInSet;
      expect(isTracked).to.be.equal(true);
      expect(removeFromSetSpy).to.have.been.called.with(`${currentISODate}_ip_without_id`, ip);
    });

  });

  describe('getStat', () => {
    it('if setId are not specified return 0', async () => {
      const stat = await userActivityDataAccess.getStat();
      expect(stat).to.be.equal(0);
    });

    it(`call data access layer methods "getSetCardinality" for id set and ip(without id) set
        and return sum of their results`, async () => {
      const currentISODate = (new Date).toISOString().split('T')[0];
      const idSet = {
        name: `${currentISODate}_id`,
        cardinality: 1
      };
      const ipWithoutIdSet = {
        name: `${currentISODate}_ip_without_id`,
        cardinality: 2
      };
      userActivityStorage.originals = {
        getSetCardinality: userActivityStorage.getSetCardinality
      }
      userActivityStorage.getSetCardinality = async (setName) => {
        if (setName === idSet.name) {
          return idSet.cardinality;
        }
        if (setName === ipWithoutIdSet.name) {
          return ipWithoutIdSet.cardinality;
        }
        return 0;
      };
      const getSetCardinalitySpy = chai.spy.on(userActivityStorage, 'getSetCardinality');
      const stat = await userActivityDataAccess.getStat(currentISODate);
      chai.spy.restore(userActivityStorage);
      userActivityStorage.getSetCardinality = userActivityStorage.originals.getSetCardinality;
      expect(getSetCardinalitySpy).to.have.been.called.with(idSet.name);
      expect(getSetCardinalitySpy).to.have.been.called.with(ipWithoutIdSet.name);
      expect(stat).to.be.equal(idSet.cardinality + ipWithoutIdSet.cardinality);
    });

  });
});