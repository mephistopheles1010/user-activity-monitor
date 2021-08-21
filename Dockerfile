#Specify a base image
FROM node:alpine

#Specify a working directory
WORKDIR /usr/app

#Copy remaining files
COPY ./src ./src
COPY ./config ./config
COPY ./index.js ./
COPY ./package.json ./
COPY ./startup.pm2.json ./

#Install dependencies
RUN npm install pm2 -g
RUN npm install 

#Create log directory specified in startup.pm2.json
RUN mkdir ./logs

#Default command
CMD ["pm2-runtime","startup.pm2.json"]
#CMD ["npm","start"]