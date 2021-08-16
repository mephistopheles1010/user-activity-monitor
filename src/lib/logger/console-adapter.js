//#region : describe Logger interface
/**
 * @description
 * @callback LogFunction
 * @param {string} msg
 * @returns {void}
 */

/**
 *
 * @typedef {object} Logger
 * @property {LogFunction} debug
 * @property {LogFunction} info
 * @property {LogFunction} warn
 * @property {LogFunction} error
 */
//#endregion : describe Logger interface


//#region : describe Logger config interface
/**
 *
 * @typedef {object} ConsoleAdapterConfig
 * @property {string} hostName
 * @property {string} serviceName
 */
//#endregion : describe Logger config interface

/**
 * @description console implimentation of logger interface
 */
class ConsoleAdapter {
  /**
   * @public
   * @static
   * @param {Console} console
   * @param {ConsoleAdapterConfig} config
   */
  static instantiate(console, config) {
    return new ConsoleAdapter(console, config);
  }

  #console;
  #config;

  /**
   * @public
   * @constructor
   * @param {Console} console
   * @param {ConsoleAdapterConfig} config
   */
  constructor(console, config) {
    this.#console = console;
    this.#config = config;
  }


  /**
   * @description debug level log
   * @public
   * @param {string} msg
   * @returns {void}
   */
  debug(msg) {
    return this.#console.log(this.#composeMessage('debug', msg));
  }

  /**
   * @description info level log
   * @public
   * @param {string} msg
   * @returns {void}
   */
  info(msg) {
    return this.#console.log(this.#composeMessage('info', msg));
  }

  /**
   * @description warn level log
   * @public
   * @param {string} msg
   * @returns {void}
   */
  warn(msg) {
    return this.#console.log(this.#composeMessage('warn', msg));
  }

  /**
   * @description error level log
   * @public
   * @param {string} msg
   * @returns {void}
   */
  error(msg) {
    return this.#console.log(this.#composeMessage('error', msg));
  }

  /**
   * @private
   * @param {string} level 
   * @param {string} msg 
   * @returns  {string}
   */
  #composeMessage(level, msg) {
    const date = new Date();
    return `${date.toISOString()}: ${level}: ${this.#config.hostName}: ${this.#config.serviceName}: ${msg}`
  }

}

module.exports = ConsoleAdapter;

