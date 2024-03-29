/* global io, feathers, moment */
// Establish a Socket.io connection
const socket = io()
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers()

client.configure(feathers.socketio(socket))
// Use localStorage to store our login token
client.configure(feathers.authentication())

export default {
  install: (app, options) => {
    app.config.globalProperties.$feathers = client
  }
}
