# user-activity-monitor
service for tracking user activity  

## Setup
first setup and startup redis server  
create .env file in the root of a project(can simple gen a template with ./deploy/scripts/gen-env-template.sh)  
configure .env file according to your environment  
if you intend to start service with pm2 configure log directory path in startup.pm2.json  
npm install

## Tests

npm install  
npm test

## Start
simple start: npm start  
or as a daemon: pm2 start startup.pm2.json  

## Dependencies

mocha  
chai  
chai-spies  
sinon  
dotenv  
express  
redis  

## Versioning

1.0.0  





