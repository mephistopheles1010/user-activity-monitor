//#region : external imports
const http = require('http');
const express = require('express');
const redis = require("redis");
//#endregion : external imports

//#region : internal imports
const config = require('./config');
const Logger = require('./src/lib/logger');
const RedisAdapter = require('./src/lib/redis-adapter');
const ResponseBody = require('./src/lib/response-body');
const { UserActivityDataAccess, UserActivityService, UserActivityRouter } = require('./src/components/user-activity');
//#endregion : internal imports

//#region : set infrastructure and domain interaction
const expressApp = express();
const expressRouter = express.Router();
const logger = Logger.instantiate(console, config.logger);
const redisClient = redis.createClient(config.redis);
redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});
redisClient.on('error', (err) => {
  logger.error(`Redis error: ${err}`);
  if(err.code === "ECONNREFUSED"){
    process.exit(1);
  }
});
const redisAdapter = RedisAdapter.instantiate(redisClient);



const userActivityDataAccess = UserActivityDataAccess.instantiate(redisAdapter);
const userActivityService = UserActivityService.instantiate(userActivityDataAccess);
const userActivityRouter = UserActivityRouter.instantiate(userActivityService, ResponseBody.composeResponse);

userActivityRouter.mount(expressRouter);
expressApp.use('/api', expressRouter);
//#endregion : set infrastructure and domain interaction

//#region : handle unknown routes
expressApp.use((req, res, next) => {
  const err = new Error(`Cannot ${req.method} ${req.path}`);
  res.status(404).end(ResponseBody.composeResponse(err, 'Unknown rout!'));
  return next(err);
});
//#endregion : handle unknown routes

//#region : handle app errors
expressApp.use((err) => {
  logger.warn(`${err}`);
});
//#endregion : handle app errors


//#region : start http server
const server = http.createServer(expressApp);
server.on('listening', () => {
  logger.info(`Http server listening on port: ${config.server.port}`);
});
server.on('error', (error) => {
  logger.error(`Http server listening error: ${error}`);
  process.exit(1);
});
server.listen(config.server.port);
//#endregion : start http server


//#region: handle unhandled exceptions
process
  .on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
  })
  .on('uncaughtException', (err, origin) => {
    logger.error(`Uncaught Exception: ${err}, origin: ${origin}`);
    process.exit(1);
  });
//#endregion: set global error handlers
