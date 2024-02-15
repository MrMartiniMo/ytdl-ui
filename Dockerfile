FROM node:lts-alpine

RUN apk add --update --no-cache python3 ffmpeg

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:client

EXPOSE 3030
ENV HEALTHCHECK_URL=http://localhost:3030/

ENTRYPOINT [ "npm", "start" ]

HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 CMD curl -Lk -fsS "${HEALTHCHECK_URL}" || exit 1
