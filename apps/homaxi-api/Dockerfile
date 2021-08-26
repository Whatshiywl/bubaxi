FROM node:alpine

RUN apk add unzip

WORKDIR /app

COPY node_modules.zip ./node_modules.zip

RUN unzip -q node_modules.zip && unlink node_modules.zip

ARG BUILD_PATH
COPY $BUILD_PATH .

ENTRYPOINT [ "node", "main.js" ]
