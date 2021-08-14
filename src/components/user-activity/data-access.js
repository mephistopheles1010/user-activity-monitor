
//#region : describe UserActivityStorage interface
/**
 * @description
 * @callback SetCheckFunction
 * @param {string} setName
 * @param {string} value
 * @returns {Promise<boolean>}
 */

/**
 * @description
 * @callback SetActionFunction
 * @param {string} setName
 * @param {string} value
 * @returns {Promise<void>}
 */

/**
 * @description
 * @callback GetInfoFunction
 * @param {string} setName
 * @returns {Promise<number>}
 */


/**
 *
 * @typedef {object} UserActivityStorage
 * @property {SetActionFunction} addToSet
 * @property {SetActionFunction} removeFromSet
 * @property {SetCheckFunction} isInSet
 * @property {GetInfoFunction} getSetCardinality
 */
//#endregion : describe UserActivityStorage interface


/**
 * @description data access level for user activity component
 * @class
 */
class UserActivityDataAccess {

  /**
   * @public
   * @static
   * @param {UserActivityStorage} storage 
   */
  static instantiate(storage) {
    return new UserActivityDataAccess(storage);
  }


  #storage;

  /**
   * @public
   * @constructor
   * @param {UserActivityStorage} storage 
   */
  constructor(storage) {
    this.#storage = storage;
  }

  /**
   * @description save tracked id
   * @public
   * @param {string} setId 
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async addTrackId(setId, id) {
    if (!setId || !id) {
      return false;
    }
    const idSetName = this.#composeSetName(setId, 'id');
    await this.#storage.addToSet(idSetName, id);
    return true;
  }

  /**
   * @description
   * @public
   * @param {string} setId 
   * @param {string} id 
   * @param {string} ip
   * @returns {Promise<boolean>}
   */
  async addTrackPair(setId, id, ip) {
    if (!setId || !id || !ip) {
      return false;
    }
    const idSetName = this.#composeSetName(setId, 'id');
    const ipSetName = this.#composeSetName(setId, 'ip');
    const ipWithoutIdSetName = this.#composeSetName(setId, 'ip_without_id');

    await this.#storage.addToSet(idSetName, id);
    await this.#storage.addToSet(ipSetName, ip);
    await this.#storage.removeFromSet(ipWithoutIdSetName, ip);
    return true;
  }

  /**
   * @description
   * @public
   * @param {string} setId 
   * @param {string} ip 
   * @returns {Promise<boolean>}
   */
  async addTrackIp(setId, ip) {
    if (!setId || !ip) {
      return false;
    }
    const ipWithoutIdSetName = this.#composeSetName(setId, 'ip_without_id');
    const ipSetName = this.#composeSetName(setId, 'ip');

    /**
     * active part of a code is little overheaded, but guarantees data consistency
     * more obvious code in comment below is simpler, but in one case doesn't guarantee data consistency
     * if(!this.#storage.isInSet(date_ip, ip)){
     *   this.#storage.addToSet(date_ip_without_id, ip);
     * } 
     */
    await this.#storage.addToSet(ipWithoutIdSetName, ip);
    if (await this.#storage.isInSet(ipSetName, ip)) {
      await this.#storage.removeFromSet(ipWithoutIdSetName, ip);
    }
    return true;
  }

  /**
   * @description
   * @public
   * @param {string} setId 
   * @returns {Promise<number>}
   */
  async getStat(setId) {
    if (!setId) {
      return 0;
    }
    const idSetName = this.#composeSetName(setId, 'id');
    const ipWithoutIdSetName = this.#composeSetName(setId, 'ip_without_id');
    return await this.#storage.getSetCardinality(idSetName) + await this.#storage.getSetCardinality(ipWithoutIdSetName);
  }

  /**
   * @private
   * @param  {...string} identifiers set identifiers in right order
   * @returns {string}
   */
  #composeSetName(...identifiers) {
    return identifiers.join('_');
  }

}

module.exports = UserActivityDataAccess;