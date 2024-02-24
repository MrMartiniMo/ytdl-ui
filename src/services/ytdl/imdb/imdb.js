// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { YtdlImdbService, getOptions } from './imdb.class.js'
import { ytdlImdbPath, ytdlImdbMethods } from './imdb.shared.js'

export * from './imdb.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const ytdlImdb = (app) => {
  // Register our service on the Feathers application
  app.use(ytdlImdbPath, new YtdlImdbService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ytdlImdbMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(ytdlImdbPath).hooks({
    around: {
      all: [authenticate('jwt')]
    },
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      patch: [],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
