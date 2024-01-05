FROM node:lts-alpine3.18 as builder



RUN apk add wget && \
    apk add --no-cache git

WORKDIR /home/node

WORKDIR /home/node/app

COPY ./index.js /home/node/app/
COPY ./config.ts /home/node/app/
COPY ./package.json /home/node/app/
COPY ./package-lock.json /home/node/app/

RUN yarn install

FROM node:lts-alpine3.18
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
WORKDIR /home/node/app
RUN apk add chromium
COPY --from=builder /home/node/app/ .
EXPOSE 8080
