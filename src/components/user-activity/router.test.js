const chai = require('chai');
const spies = require('chai-spies');

const UserActivityRouter = require('./router');

chai.use(spies);
const { expect } = chai;

const serviceMocked = {
  track: async (id, ip) => { return true },
  getStat: async (startDate, endDate) => { return {} }
};
const composedResponseSample = 'composedResponseSample';
const mocks = {
  composeResponse: (err, message, data) => {
    console.log(`composeResponse call => err: ${err} | data: ${message} | data: ${data}`);
    return composedResponseSample
  }
};

const userActivityRouter = new UserActivityRouter(serviceMocked, (err, message, data) => {
  return mocks.composeResponse(err, message, data);
});

const generalRouterMocked = {
  routesMap: {},
  get: (path, handler) => {
    generalRouterMocked.routesMap[path] = handler;
  }
};

describe('UserActivityRouter', () => {
  describe('after routes has been mounted to the general router', () => {
    before(() => {
      userActivityRouter.mount(generalRouterMocked);
    });

    describe('request on /user-activity/track route', () => {

      it('call service method "track" with approptiate params', async () => {
        const trackSpy = chai.spy.on(serviceMocked, 'track');
        const req = {
          query: {
            id: 'testId'
          }
        };
        const res = {
          status: (code) => {
            return res;
          },
          send: (data) => {
            return res;
          }
        };
        const next = (err) => { };

        const requestAdditionalParams = [
          {
            params: {
              headers: {
                'cf-connecting-ip': 'testCfConnectingIp',
                'x-real-ip': 'testXRealIp'
              },
              socket: {
                remoteAddress: 'testRemoteAddress'
              }
            },
            expect: 'testCfConnectingIp'
          },
          {
            params: {
              headers: {
                'x-real-ip': 'testXRealIp'
              },
              socket: {
                remoteAddress: 'testRemoteAddress'
              }
            },
            expect: 'testXRealIp'
          },
          {
            params: {
              socket: {
                remoteAddress: 'testRemoteAddress'
              }
            },
            expect: 'testRemoteAddress'
          }
        ];

        for (const requestAdditionalParam of requestAdditionalParams) {
          await generalRouterMocked.routesMap['/user-activity/track']({ ...req, ...requestAdditionalParam.params }, res, next);
          expect(trackSpy).to.have.been.called.with(req.query.id, requestAdditionalParam.expect);
        }
        chai.spy.restore(serviceMocked);
      });

      it('if user succesfully tracked send back status 200 and appropriate message', async () => {
        const req = {
          query: {
            id: 'testId'
          },
          socket: {
            remoteAddress: 'testRemoteAddress'
          }
        };
        const res = {
          status: (code) => {
            return res;
          },
          send: (data) => {
            return res;
          }
        };
        const next = (err) => { };
        const respStatusSpy = chai.spy.on(res, 'status');
        const respSendSpy = chai.spy.on(res, 'send');
        const composeResponseSpy = chai.spy.on(mocks, 'composeResponse');

        await generalRouterMocked.routesMap['/user-activity/track'](req, res, next);
        chai.spy.restore(res);
        chai.spy.restore(mocks);

        expect(respStatusSpy).to.have.been.called.with(200);
        expect(composeResponseSpy).to.have.been.called.with('User succesfully tracked!');//FIXME: check calling without Error instance
        expect(respSendSpy).to.have.been.called.with(composedResponseSample);

      });

      it('if user not tracked send back status 400 and appropriate message', async () => {
        const req = {
          query: {
            id: 'testId'
          },
          socket: {
            remoteAddress: 'testRemoteAddress'
          }
        };
        const res = {
          status: (code) => {
            return res;
          },
          send: (data) => {
            return res;
          }
        };
        const next = (err) => { };
        const respStatusSpy = chai.spy.on(res, 'status');
        const respSendSpy = chai.spy.on(res, 'send');
        const composeResponseSpy = chai.spy.on(mocks, 'composeResponse');
        serviceMocked.originals = {
          track: serviceMocked.track
        }
        serviceMocked.track = () => { return false };

        await generalRouterMocked.routesMap['/user-activity/track'](req, res, next);
        chai.spy.restore(res);
        chai.spy.restore(mocks);
        serviceMocked.track = serviceMocked.originals.track;

        expect(respStatusSpy).to.have.been.called.with(400);
        expect(composeResponseSpy).to.have.been.called.with('User not tracked!');//FIXME: check calling with Error instance
        expect(respSendSpy).to.have.been.called.with(composedResponseSample);

      });

      it('if exception is catched send back status 500 with appropriate message and call next handler', async () => {
        const req = {
          query: {
            id: 'testId'
          },
          socket: {
            remoteAddress: 'testRemoteAddress'
          }
        };
        const res = {
          status: (code) => {
            return res;
          },
          send: (data) => {
            return res;
          }
        };
        const next = (err) => { };
        const respStatusSpy = chai.spy.on(res, 'status');
        const respSendSpy = chai.spy.on(res, 'send');
        const nextSpy = chai.spy.on(next);
        const composeResponseSpy = chai.spy.on(mocks, 'composeResponse');
        serviceMocked.originals = {
          track: serviceMocked.track
        }
        const trackException = new Error('track exception');
        serviceMocked.track = () => { throw trackException };

        await generalRouterMocked.routesMap['/user-activity/track'](req, res, nextSpy);
        chai.spy.restore(res);
        chai.spy.restore(mocks);
        serviceMocked.track = serviceMocked.originals.track;

        expect(respStatusSpy).to.have.been.called.with(500);
        expect(composeResponseSpy).to.have.been.called.with('An error has occurred while tracking user!');//FIXME: check calling with Error instance
        expect(respSendSpy).to.have.been.called.with(composedResponseSample);
        expect(nextSpy).to.have.been.called();//FIXME: check calling with Error instance

      });

    });

    describe('request on /user-activity/stat route', () => {

      it('call service method "track" with approptiate params', async () => {
        const getStatSpy = chai.spy.on(serviceMocked, 'getStat');
        const req = {
          query: {
            startDate: 'testStartDate',
            endDate: 'testEndDate'
          }
        };
        const res = {
          status: (code) => {
            return res;
          },
          send: (data) => {
            return res;
          }
        };
        const next = (err) => { };

        await generalRouterMocked.routesMap['/user-activity/stat'](req, res, next);
        chai.spy.restore(serviceMocked);
        expect(getStatSpy).to.have.been.called.with(req.query.startDate, req.query.endDate);
      });

      it('if user succesfully tracked send back status 200 and appropriate message', async () => {
        const req = {
          query: {
            startDate: 'testStartDate',
            endDate: 'testEndDate'
          }
        };
        const res = {
          status: (code) => {
            return res;
          },
          send: (data) => {
            return res;
          }
        };
        const next = (err) => { };
        const respStatusSpy = chai.spy.on(res, 'status');
        const respSendSpy = chai.spy.on(res, 'send');
        const composeResponseSpy = chai.spy.on(mocks, 'composeResponse');
        serviceMocked.originals = {
          getStat: serviceMocked.getStat
        }
        const stat = 'stat';
        serviceMocked.getStat = (startDate, endDate) => { return stat };

        await generalRouterMocked.routesMap['/user-activity/stat'](req, res, next);
        chai.spy.restore(res);
        chai.spy.restore(mocks);
        serviceMocked.getStat = serviceMocked.originals.getStat;

        expect(respStatusSpy).to.have.been.called.with(200);
        expect(composeResponseSpy).to.have.been.called.with('Stats has been successfully retrieved!', stat);//FIXME: check calling without Error instance
        expect(respSendSpy).to.have.been.called.with(composedResponseSample);

      });

      it('if exception is catched send back status 500 with appropriate message and call next handler', async () => {
        const req = {
          query: {
            startDate: 'testStartDate',
            endDate: 'testEndDate'
          }
        };
        const res = {
          status: (code) => {
            return res;
          },
          send: (data) => {
            return res;
          }
        };
        const next = (err) => { };
        const respStatusSpy = chai.spy.on(res, 'status');
        const respSendSpy = chai.spy.on(res, 'send');
        const nextSpy = chai.spy.on(next);
        const composeResponseSpy = chai.spy.on(mocks, 'composeResponse');
        serviceMocked.originals = {
          getStat: serviceMocked.getStat
        }
        const statException = new Error('stat exception');
        serviceMocked.getStat = () => { throw statException };

        await generalRouterMocked.routesMap['/user-activity/stat'](req, res, nextSpy);
        chai.spy.restore(res);
        chai.spy.restore(mocks);
        serviceMocked.getStat = serviceMocked.originals.getStat;

        expect(respStatusSpy).to.have.been.called.with(500);
        expect(composeResponseSpy).to.have.been.called.with('An error has occurred while retrieving stats!');//FIXME: check calling with Error instance
        expect(respSendSpy).to.have.been.called.with(composedResponseSample);
        expect(nextSpy).to.have.been.called();//FIXME: check calling with Error instance

      });
    });

  });
});