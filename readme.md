# YTDL-UI

> 

## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

## Docker

    ```
    cd path/to/ytdl-ui
    docker build -t ytdl-ui .
    docker run -v/your/dl/dest:/usr/src/app/downloads -p 3030:3030 ytdl-ui
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