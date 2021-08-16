/**
 * @description redis implimentation of UserActivityStorage interface
 */
class RedisAdapter {

  /**
   * @public
   * @static
   * @param {RedisClient} redisClient
   */
  static instatntiate(redisClient) {
    return new RedisAdapter(redisClient);
  }

  #redisClient;

  /**
   * @public
   * @constructor
   * @param {RedisClient} redisClient
   */
  constructor(redisClient) {
    this.#redisClient = redisClient;
  }

  /**
   * @description add value to set
   * @public
   * @async
   * @param {string} setName
   * @param {string} value
   * @returns {Promise<void>}
   */
  addToSet(setName, value) {
    return new Promise((resolve, reject) => {
      this.#redisClient.sadd(setName, value, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  /**
   * @description remove value from set
   * @public
   * @async
   * @param {string} setName
   * @param {string} value
   * @returns {Promise<void>}
   */
  removeFromSet(setName, value) {
    return new Promise((resolve, reject) => {
      this.#redisClient.srem(setName, value, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }

  /**
   * @description check is value in set
   * @public
   * @async
   * @param {string} setName
   * @param {string} value
   * @returns {Promise<boolean>}
   */
  isInSet(setName, value) {
    return new Promise((resolve, reject) => {
      this.#redisClient.sismember(setName, value, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result === 1);
      });
    });
  }

  /**
   * @description get set cardinality
   * @public
   * @async
   * @param {string} setName
   * @returns {Promise<number>}
   */
  getSetCardinality(setName) {
    return new Promise((resolve, reject) => {
      this.#redisClient.scard(setName, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

}

module.exports = RedisAdapter;