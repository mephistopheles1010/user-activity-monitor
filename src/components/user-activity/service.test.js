const chai = require('chai');
const spies = require('chai-spies');

const UserActivityService = require('./service');


chai.use(spies);
const { expect } = chai;

const dataAccessMocked = {
  addTrackPair: async (id, ip) => { },
  addTrackId: async (id) => { },
  addTrackIp: async (ip) => { },
  getStat: async (date) => { }
};
const userActivityService = new UserActivityService(dataAccessMocked);


describe('UserActivityService', () => {
  describe('track', () => {
    it('if id and ip specified call data access layer method "addTrackPair" with appropriate id and ip', async () => {
      const addTrackPairSpy = chai.spy.on(dataAccessMocked, 'addTrackPair');
      const id = 'testId';
      const ip = 'testIp';
      await userActivityService.track(id, ip);
      expect(addTrackPairSpy).to.have.been.called.with(id, ip);
    });

    it('if only id specified call data access layer method "addTrackId" with appropriate id', async () => {
      const addTrackIdSpy = chai.spy.on(dataAccessMocked, 'addTrackId');
      const id = 'testId';
      await userActivityService.track(id);
      expect(addTrackIdSpy).to.have.been.called.with(id);
    });

    it('if only ip specified call data access layer method "addTrackIp" with appropriate ip', async () => {
      const addTrackIpSpy = chai.spy.on(dataAccessMocked, 'addTrackIp');
      const ip = 'testIp';
      await userActivityService.track(undefined, ip);
      expect(addTrackIpSpy).to.have.been.called.with(ip);
    });

    it('if no id and ip specified return false', async () => {
      const isTracked = await userActivityService.track();
      expect(isTracked).to.be.equal(false);
    });

  });

  describe('getStat', () => {
    it(`if startDate and endDate specified in a correct way 
        call data access layer method "getStat" appropriate times
        with appropriate dates`, async () => {
      const getStatSpy = chai.spy.on(dataAccessMocked, 'getStat');
      const dates = [
        '2020-08-12',
        '2020-08-13',
        '2020-08-14',
      ];
      await userActivityService.getStat(dates[0], dates[2]);
      chai.spy.restore(dataAccessMocked);
      expect(getStatSpy).to.have.been.first.called.with(dates[0]);
      expect(getStatSpy).to.have.been.second.called.with(dates[1]);
      expect(getStatSpy).to.have.been.third.called.with(dates[2]);
      expect(getStatSpy).to.have.been.called.exactly(3);
    });

    it('if no startDate date specified call data access layer method "getStat" with endDate', async () => {
      const getStatSpy = chai.spy.on(dataAccessMocked, 'getStat');
      const dates = [
        undefined,
        '2020-08-13',
        '2020-08-14',
      ];
      await userActivityService.getStat(dates[0], dates[2]);
      chai.spy.restore(dataAccessMocked);
      expect(getStatSpy).to.have.been.first.called.with(dates[2]);
      expect(getStatSpy).to.have.been.called.exactly(1);
    });

    it('if startDate incorrect call data access layer method "getStat" with endDate', async () => {
      const getStatSpy = chai.spy.on(dataAccessMocked, 'getStat');
      const dates = [
        '2020-08-124',
        '2020-08-13',
        '2020-08-14',
      ];
      await userActivityService.getStat(dates[0], dates[2]);
      chai.spy.restore(dataAccessMocked);
      expect(getStatSpy).to.have.been.first.called.with(dates[2]);
      expect(getStatSpy).to.have.been.called.exactly(1);
    });

    it('if no endDate specified call data access layer method "getStat" with startDate', async () => {
      const getStatSpy = chai.spy.on(dataAccessMocked, 'getStat');
      const dates = [
        '2020-08-12',
        '2020-08-13',
        undefined,
      ];
      await userActivityService.getStat(dates[0], dates[2]);
      chai.spy.restore(dataAccessMocked);
      expect(getStatSpy).to.have.been.first.called.with(dates[0]);
      expect(getStatSpy).to.have.been.called.exactly(1);
    });

    it('if endDate incorrect call data access layer method "getStat" with startDate', async () => {
      const getStatSpy = chai.spy.on(dataAccessMocked, 'getStat');
      const dates = [
        '2020-08-12',
        '2020-08-13',
        '2020-08-146',
      ];
      await userActivityService.getStat(dates[0], dates[2]);
      chai.spy.restore(dataAccessMocked);
      expect(getStatSpy).to.have.been.first.called.with(dates[0]);
      expect(getStatSpy).to.have.been.called.exactly(1);
    });

    it('if startDate and endDate are not specified call data access layer method "getStat" with today\'s date', async () => {
      const getStatSpy = chai.spy.on(dataAccessMocked, 'getStat');
      const dates = [
        undefined,
        '2020-08-13',
        undefined,
      ];
      await userActivityService.getStat(dates[0], dates[2]);
      chai.spy.restore(dataAccessMocked);
      const currentISODate = (new Date).toISOString().split('T')[0];
      expect(getStatSpy).to.have.been.first.called.with(currentISODate);
      expect(getStatSpy).to.have.been.called.exactly(1);
    });

    it('if startDate and endDate are incorrect call data access layer method "getStat" with today\'s date', async () => {
      const getStatSpy = chai.spy.on(dataAccessMocked, 'getStat');
      const dates = [
        '2020-08-125',
        '2020-08-13',
        '2020-08-146',
      ];
      await userActivityService.getStat(dates[0], dates[2]);
      chai.spy.restore(dataAccessMocked);
      const currentISODate = (new Date).toISOString().split('T')[0];
      expect(getStatSpy).to.have.been.first.called.with(currentISODate);
      expect(getStatSpy).to.have.been.called.exactly(1);
    });

    it('if date order is incorrect call data access layer method "getStat" with today\'s date', async () => {
      const getStatSpy = chai.spy.on(dataAccessMocked, 'getStat');
      const dates = [
        '2020-08-14',
        '2020-08-13',
        '2020-08-12',
      ];
      await userActivityService.getStat(dates[0], dates[2]);
      chai.spy.restore(dataAccessMocked);
      const currentISODate = (new Date).toISOString().split('T')[0];
      expect(getStatSpy).to.have.been.first.called.with(currentISODate);
      expect(getStatSpy).to.have.been.called.exactly(1);
    });

  });
});