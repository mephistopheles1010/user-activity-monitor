//#region : describe UserActivityService interface
/**
 * @typedef {Object.<string, number>} UserActivityStats
 */

/**
 * @description
 * @async
 * @callback GetRangeInfoFunction
 * @param {string} startRange
 * @param {string} endRange
 * @returns {Promise<UserActivityStats>}
 */

/**
 * @description
 * @async
 * @callback TrackUserActivityFunction
 * @param {string} firstTrackParam
 * @param {string} secondTrackParam
 * @returns {Promise<boolean>}
 */


/**
 *
 * @typedef {object} UserActivityService
 * @property {TrackUserActivityFunction} track
 * @property {GetRangeInfoFunction} getStat
 */
//#endregion : describe UserActivityService interface

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

//#region : describe ResponseComposer interface
/**
 * @description
 * @callback ResponseComposer
 * @param {Error?} err 
 * @param {string?} message 
 * @param {*?} data 
 * @returns {object}
 */
//#endregion : describe ResponseComposer interface


/**
 * @description router level for user activity component
 * @class
 */
class UserActivityRouter {

  /**
   * @public
   * @static
   * @param {UserActivityService} userActivityService 
   * @param {ResponseComposer} responseComposer
   */
  static instantiate(userActivityService, responseComposer) {
    return new UserActivityRouter(userActivityService, responseComposer);
  }

  #userActivityService;
  #composeResponse;

  /**
   * @public
   * @constructor
   * @param {UserActivityService} userActivityService 
   * @param {ResponseComposer} responseComposer
   */
  constructor(userActivityService, responseComposer) {
    this.#userActivityService = userActivityService;
    this.#composeResponse = responseComposer;
  }

  /**
   * @public
   * @description mount component routes to global router
   * @param {Router} router 
   */
  mount(router) {
    router.get('/user-activity/track', this.#track.bind(this));
    router.get('/user-activity/stat', this.#getStat.bind(this));
  }


  /**
   * @description handle /user-activity/track route
   * @private
   * @param {IncomingMessage} req @see Express.Request
   * @param {OutgoingMessage} res @see Express.Response
   * @param {NextHandlerCallback} next @see Express.NextFunction
   * @returns 
   */
  async #track(req, res, next) {
    try {
      const isTracked = await this.#userActivityService.track(req.query.id, this.#retrieveIp(req));
      if (!isTracked) {
        return res.status(400).send(this.#composeResponse(new Error('Invalid input info'), 'User not tracked!'));
      }
      return res.status(200).send(this.#composeResponse(null, 'User succesfully tracked!'));
    } catch (err) {
      res.status(500).send(this.#composeResponse(err, 'An error has occurred while tracking user!'));
      return next(err);
    }
  }

  /**
   * @description handle /user-activity/stat route
   * @private
   * @param {IncomingMessage} req @see Express.Request
   * @param {OutgoingMessage} res @see Express.Response
   * @param {NextHandlerCallback} next @see Express.NextFunction
   * @returns 
   */
  async #getStat(req, res, next) {
    try {
      const stat = await this.#userActivityService.getStat(req.query.startDate, req.query.endDate);
      return res.status(200).send(this.#composeResponse(null, 'Stats has been successfully retrieved!', stat));
    } catch (err) {
      res.status(500).send(this.#composeResponse(err, 'An error has occurred while retrieving stats!'));
      return next(err);
    }
  }


  /**
   * @description retrieve client ip from request data
   * @private
   * @param {IncomingMessage} req 
   * @returns 
   */
  #retrieveIp(req) {
    //First try get ip from cloudflare headers
    //then from nginx headers(nginx.conf: proxy_set_header  X-Real-IP  $remote_addr;)
    //then from native nodejs http headers
    return req.headers?.['cf-connecting-ip'] ?? req.headers?.['x-real-ip'] ?? req.socket?.remoteAddress;
  }

}

module.exports = UserActivityRouter;