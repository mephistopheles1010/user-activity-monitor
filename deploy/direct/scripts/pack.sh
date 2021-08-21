#!/bin/bash

# clean up production dir
rm -rf ./deploy/direct/distr/user-activity-monitor.zip

# create temp dir
mkdir ./deploy/direct/distr/user-activity-monitor

# copy needed dir to temp dir
#cp ./deploy/install.sh ./production 
cp -R ./src ./deploy/direct/distr/user-activity-monitor
cp -R ./config ./deploy/direct/distr/user-activity-monitor

# copy needed files to temp dir
cp ./index.js ./deploy/direct/distr/user-activity-monitor
cp ./package.json ./deploy/direct/distr/user-activity-monitor
cp ./startup.pm2.json ./deploy/direct/distr/user-activity-monitor

# create logs dir in temp dir
mkdir ./deploy/direct/distr/user-activity-monitor/logs

# create zip archive
cd ./deploy/direct/distr/
zip -r ./user-activity-monitor.zip ./user-activity-monitor

#remove temp dir
rm -rf ./user-activity-monitor