/**
 * @description service level for user activity component
 * @class
 */
class UserActivityService {

    /**
     * @public
     * @static
     * @param {UserActivityDataAccess} userActivityDataAccess
     */
    static instantiate(userActivityDataAccess) {
        return new UserActivityService(userActivityDataAccess);
    }

    #userActivityDataAccess;

    /**
     * @public
     * @constructor
     * @param {UserActivityDataAccess} userActivityDataAccess
     */
    constructor (userActivityDataAccess) {
        this.#userActivityDataAccess = userActivityDataAccess;
    }

    /**
     * @description if user has been successfully tracked will return true in another cases returns false
     * @param {string} id 
     * @param {string} ip 
     * @returns {boolean}
     */
    track(id, ip) {
        //FIXME: implement
    }


    /**
     * @typedef {Object.<string, number>} UserActivityStats
     */

    /**
     * @description return user activity stats
     * @returns {UserActivityStats}
     */
    getStat() {
        //FIXME: implement
    }
}

module.exports = UserActivityService;