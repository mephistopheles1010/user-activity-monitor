#!/bin/bash

pm2 delete user-activity-monitor
rm -rf user-activity-monitor
unzip user-activity-monitor.zip 
rm user-activity-monitor.zip
chmod -R 777 user-activity-monitor/
cd user-activity-monitor/
npm install
