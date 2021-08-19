FROM node:alpine

ARG BUILD_PATH

WORKDIR /app

COPY node_modules ./node_modules
COPY $BUILD_PATH .

ENTRYPOINT [ "node", "main.js" ]
