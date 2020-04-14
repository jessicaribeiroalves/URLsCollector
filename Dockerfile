FROM node:lts

WORKDIR /usr/src/app

COPY __tests__/* __tests__/
COPY src/* src/
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN ["npm", "install"]

RUN ["npm", "test"]