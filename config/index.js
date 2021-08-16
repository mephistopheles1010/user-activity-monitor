const env = process.env;

const config = {};

config.server = {
  port: env.SERVER_PORT,
};

config.redis = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
};

if(env.REDIS_DB){
  config.redis.db = env.REDIS_DB
}

if (env.REDIS_USER && env.REDIS_PASSWORD) {
  config.redis.user = env.REDIS_USER,
    config.redis.password = env.REDIS_PASSWORD
}

config.logger = {
  hostName: env.LOGGER_HOST_NAME,
  serviceName: env.LOGGER_SERVICE_NAME,
};

module.exports = config;