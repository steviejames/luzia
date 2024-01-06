FROM node:lts-alpine3.18 as builder



RUN apk add wget && \
    apk add --no-cache git

WORKDIR /home/node

WORKDIR /home/node/app

RUN apt-get update && \
    sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

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
