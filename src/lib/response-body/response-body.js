
//#region : describe UserActivityResponse interface
/**
 * @typedef {object} UserActivityResponse
 * @property {object} err
 * @property {boolean} err.isEmitted
 * @property {string} err.info
 * @property {string?} message
 * @property {*?} data
 */
//#endregion : describe UserActivityResponse interface


class ResponseBody {
  /**
   * @description compose component response body
   * @static
   * @param {Error?} err 
   * @param {string?} message 
   * @param {*?} data 
   * @returns {UserActivityResponse}
   */
  static composeResponse(err, message, data) {
    return {
      err: {
        isEmitted: err ? true : false,
        info: err ? err.message : null
      },
      message: message ?? null,
      data: data ?? null
    }
  }
}


module.exports = ResponseBody;