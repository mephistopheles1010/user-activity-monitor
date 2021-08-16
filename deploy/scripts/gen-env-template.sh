#!/bin/bash

kernel="2.6.39";
distro="xyz";

cat > ./.env << EOL
#base
NODE_ENV = 'development'

#redis
REDIS_HOST = 'localhost'
REDIS_PORT = '6379'
#REDIS_DB = '{REDIS_DB}'
#REDIS_USER = '{REDIS_USER}'
#REDIS_PASSWORD = '{REDIS_PASSWORD}'

#server
SERVER_PORT = 8877

#logger
LOGGER_HOST_NAME = '127.0.0.1'
LOGGER_SERVICE_NAME = 'user-activity-monitor'

#set Ukraine time zone
TZ='Europe/Kiev'

EOL
