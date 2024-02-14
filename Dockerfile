FROM node:lts-alpine

RUN apk add --update --no-cache python3

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:client

# WORKDIR /usr/src/app
# COPY . .
# RUN npm install

# WORKDIR /usr/src/app/public
# RUN npm install
# RUN npm run build

# WORKDIR /usr/src/app
# COPY . .
EXPOSE 3030

CMD ["npm", "run", "start"]
