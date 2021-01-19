FROM node:latest

EXPOSE 19000 19001

ENV REACT_NATIVE_PACKAGER_HOSTNAME="192.168.43.206"

ARG BUILD_DATE

WORKDIR /usr/apps/rush-scan-app

COPY ./package.json ./

RUN npm i --unsafe-perm -g expo-cli@latest

RUN npm install

COPY ./ ./

CMD ["npm", "start"]
