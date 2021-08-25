FROM node:alpine

WORKDIR /app

COPY node_modules ./node_modules

ARG BUILD_PATH
COPY $BUILD_PATH .

ENTRYPOINT [ "node", "main.js" ]
