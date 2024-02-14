FROM node:lts-alpine

RUN apk add --update --no-cache python3

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:client

EXPOSE 3030

CMD ["npm", "run", "start"]
