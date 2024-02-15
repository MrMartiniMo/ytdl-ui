# YTDL-UI

> 

## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

## Use prebuild Docker image

    ```
    docker run \
        -v/your/dl/dest:/usr/src/app/downloads \
        -v/your/db/dest:/usr/src/app/db \
        -v/your/bin/dest:/usr/src/app/.bin \
        -p 3030:3030 \
        mrmartinimo/ytdl-ui
    ```

## Build your own Docker image

    ```
    cd path/to/ytdl-ui
    docker build -t ytdl-ui . # use e.g. --platform linux/amd64 to build for another platform
    docker run \
        -v/your/dl/dest:/usr/src/app/downloads \
        -v/your/db/dest:/usr/src/app/db \
        -v/your/bin/dest:/usr/src/app/.bin \
        -p 3030:3030 \
        ytdl-ui
    ```

The server is now ready and running on port 3030. You can access it through your browser at http://localhost:3030.

## Development

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install dependencies

    ```
    cd path/to/ytdl-ui
    npm install
    ```

3. Start YTDL-UI

    ```
    npm run dev
    ```