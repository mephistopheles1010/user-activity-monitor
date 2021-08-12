//#region : describe Router interface
/**
 * @description
 * @callback MountRoutFunction
 * @param {string} routePattern
 * @param {Function} requestHandler
 * @returns {void}
 */

/**
 *
 * @typedef {object} Router
 * @property {MountRoutFunction} get
 */
//#endregion : describe Router interface


/**
 * @description router level for user activity component
 * @class
 */
class UserActivityRouter {

    /**
     * @public
     * @static
     * @param {UserActivityService} userActivityService 
     */
    static instantiate(userActivityService) {
        return new UserActivityRouter(userActivityService);
    }

    #userActivityService;

    /**
     * @public
     * @constructor
     * @param {UserActivityService} userActivityService 
     */
    constructor (userActivityService) {
        this.#userActivityService = userActivityService;
    }

    /**
     * 
     * @param {Router} router 
     */
    mount(router) {
        //FIXME: implement
    }
}

module.exports = UserActivityRouter;