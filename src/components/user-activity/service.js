//#region : describe UserActivityDataAccess interface
/**
 * @description
 * @async
 * @callback AddPairInfoFunction
 * @param {string} setId
 * @param {string} firstValue
 * @param {string} secondValue
 * @returns {Promise<boolean>}
 */

/**
 * @description
 * @async
 * @callback AddInfoFunction
 * @param {string} setId
 * @param {string} value
 * @returns {Promise<boolean>}
 */

/**
 * @description
 * @async
 * @callback GetDateInfoFunction
 * @param {string} setId
 * @returns {Promise<number>}
 */


/**
 *
 * @typedef {object} UserActivityStorage
 * @property {AddPairInfoFunction} addTrackPair
 * @property {AddInfoFunction} addTrackId
 * @property {AddInfoFunction} addTrackIp
 * @property {GetDateInfoFunction} getStat
 */
//#endregion : describe UserActivityDataAccess interface

/**
 * @description service level for user activity component
 * @class
 */
class UserActivityService {

  /**
   * @public
   * @static
   * @param {UserActivityDataAccess} dataAccess
   */
  static instantiate(dataAccess) {
    return new UserActivityService(dataAccess);
  }

  #dataAccess;

  /**
   * @public
   * @constructor
   * @param {UserActivityDataAccess} dataAccess
   */
  constructor(dataAccess) {
    this.#dataAccess = dataAccess;
  }

  /**
   * @description if user has been successfully tracked will return true in another cases returns false
   * @param {string} id 
   * @param {string} ip 
   * @returns {boolean}
   */
  async track(id, ip) {
    const date = this.#retrieveISODate(new Date());
    if (id && ip) {
      return await this.#dataAccess.addTrackPair(date, id, ip);
    } else if (id) {
      return await this.#dataAccess.addTrackId(date, id);
    } else if (ip) {
      return await this.#dataAccess.addTrackIp(date, ip);
    }
    return false;
  }


  /**
   * @typedef {Object.<string, number>} UserActivityStats
   */

  /**
   * @description return user activity stats,composed by days, between startDate and endDate range.
   * If no startDate date specified or incorrect returns stats for endDate.
   * If no endDate specified or incorrect returns stats for startDate.
   * If both are not specified or incorrect returns stats for today.
   * If date order is incorrect returns stats for today.
   * @param {string} startDate date(without time) string in ISO format
   * @param {string} endDate date(without time) string in ISO format
   * @returns {UserActivityStats}
   */
  async getStat(startDate, endDate) {
    const stat = {};
    const dateRange = this.#composeDateRange(startDate, endDate);
    for (const date of dateRange) {
      stat[date] = await this.#dataAccess.getStat(date);
    }
    return stat;
  }

  /**
   * @description return range of date between startDate and endDate inclusive
   * If no startDate date specified or incorrect returns endDate.
   * If no endDate specified or incorrect returns startDate.
   * If both are not specified or incorrect returns today's date.
   * If date order is incorrect returns today's date.
   * @param {string} startDate date(without time) string in ISO format
   * @param {string} endDate date(without time) string in ISO format
   * @returns {Array<string>}
   */
  #composeDateRange(startDateISO, endDateISO) {
    const dateRange = [];
    const { startDate, endDate } = this.#parseRange(startDateISO, endDateISO)
    while (startDate <= endDate) {
      dateRange.push(this.#retrieveISODate(startDate));
      startDate.setDate(startDate.getDate() + 1)
    }
    return dateRange;
  }


  /**
   * @typedef {object} ParsedRange
   * @property {number} startDate parsed timestamp
   * @property {number} endDate parsed timestamp
   */
  /**
   * 
   * @param {string} startDateISO 
   * @param {string} endDateISO 
   * @returns {ParsedRange}
   */
  #parseRange(startDateISO, endDateISO) {
    let startDateTimestamp = Date.parse(startDateISO);
    let endDateTimestamp = Date.parse(endDateISO);

    if (startDateTimestamp && endDateTimestamp) {
      if (endDateTimestamp < startDateTimestamp) {
        startDateTimestamp = Date.now();
        endDateTimestamp = Date.now();
      }
    } else if (startDateTimestamp) {
      endDateTimestamp = startDateTimestamp;
    } else if (endDateTimestamp) {
      startDateTimestamp = endDateTimestamp;
    } else {
      startDateTimestamp = Date.now();
      endDateTimestamp = Date.now();
    }

    return {
      startDate: new Date(startDateTimestamp),
      endDate: new Date(endDateTimestamp)
    }
  }

  /**
   * @description retrieve only date(without time) string in ISO format from Date instance
   * @param {Date} date 
   * @returns {string} date(without time) string in ISO format
   */
  #retrieveISODate(date) {
    return date.toISOString().split('T')[0];
  }

}

module.exports = UserActivityService;