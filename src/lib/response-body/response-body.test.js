const chai = require('chai');
const spies = require('chai-spies');

const ResponseBody = require('./response-body');

chai.use(spies);
const { expect } = chai;


describe('ResponseBody', () => {
  describe('composeResponse', () => {
    it(`if an argument err is passed response.err.isEmitted === true and response.err.info === err.message`, async () => {
      const err = {
        message: 'testErrorMesssage'
      };
      const response = ResponseBody.composeResponse(err);
      expect(response.err.isEmitted).to.be.equal(true);
      expect(response.err.info).to.be.equal(err.message);
    });

    it(`if an argument message is passed response.message === message`, async () => {
      const message = 'testMessage';
      const response = ResponseBody.composeResponse(null, message);
      expect(response.message).to.be.equal(message);
    });

    it(`if an argument message is passed response.message === data`, async () => {
      const data = 'testData';
      const response = ResponseBody.composeResponse(null, null, data);
      expect(response.data).to.be.equal(data);
    });

  });
});