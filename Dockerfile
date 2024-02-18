FROM node:lts-alpine

RUN apk add --update --no-cache curl python3 ffmpeg

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:client

EXPOSE 3030
ENV HEALTHCHECK_URL=http://localhost:3030/health

ENTRYPOINT [ "npm", "start" ]

HEALTHCHECK --interval=30s --timeout=10s --retries=5 CMD curl -f "${HEALTHCHECK_URL}" || exit 1
