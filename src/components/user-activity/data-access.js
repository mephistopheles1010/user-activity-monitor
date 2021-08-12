
//#region : describe UserActivityStorage interface
/**
 * @description
 * @callback SetCheckFunction
 * @param {string} setName
 * @param {string} value
 * @returns {boolean}
 */

/**
 * @description
 * @callback SetActionFunction
 * @param {string} setName
 * @param {string} value
 * @returns {void}
 */

/**
 *
 * @typedef {object} UserActivityStorage
 * @property {SetActionFunction} addToSet
 * @property {SetActionFunction} removeFromSet
 * @property {SetCheckFunction} isInSet
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
    constructor (storage) {
        this.#storage = storage;
    }

    //FIXME: prototype methods

}

module.exports = UserActivityDataAccess;