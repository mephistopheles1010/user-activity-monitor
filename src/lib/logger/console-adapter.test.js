const chai = require('chai');
const spies = require('chai-spies');
const sinon = require('sinon');

const ConsoleAdapter = require('./console-adapter');


chai.use(spies);
const { expect } = chai;

const consoleMocked = {
  log: (msg) => { },

};
const config = {
  hostName: 'testHostName',
  serviceName: 'testServiceName',
}

const now = new Date();
let clock;

const consoleAdapter = new ConsoleAdapter(consoleMocked, config);


describe('ConsoleAdapter', () => {
  
  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  describe('debug', () => {
    it(`call console.log with appropriate msg`, () => {
      const logSpy = chai.spy.on(consoleMocked, 'log');
      const msg = 'testMsg';
      consoleAdapter.debug(msg);
      chai.spy.restore(consoleMocked);
      expect(logSpy).to.have.been.called.with(`${(new Date).toISOString()}: debug: ${config.hostName}: ${config.serviceName}]: ${msg}`);
    });

  });

  describe('info', () => {
    it(`call console.log with appropriate msg`, () => {
      const logSpy = chai.spy.on(consoleMocked, 'log');
      const msg = 'testMsg';
      consoleAdapter.info(msg);
      chai.spy.restore(consoleMocked);
      expect(logSpy).to.have.been.called.with(`${(new Date).toISOString()}: info: ${config.hostName}: ${config.serviceName}]: ${msg}`);
    });
  });

  describe('warn', () => {
    it(`call console.log with appropriate msg`, () => {
      const logSpy = chai.spy.on(consoleMocked, 'log');
      const msg = 'testMsg';
      consoleAdapter.warn(msg);
      chai.spy.restore(consoleMocked);
      expect(logSpy).to.have.been.called.with(`${(new Date).toISOString()}: warn: ${config.hostName}: ${config.serviceName}]: ${msg}`);
    });
  });

  describe('error', () => {
    it(`call console.log with appropriate msg`, () => {
      const logSpy = chai.spy.on(consoleMocked, 'log');
      const msg = 'testMsg';
      consoleAdapter.error(msg);
      chai.spy.restore(consoleMocked);
      expect(logSpy).to.have.been.called.with(`${(new Date).toISOString()}: error: ${config.hostName}: ${config.serviceName}]: ${msg}`);
    });
  });
});