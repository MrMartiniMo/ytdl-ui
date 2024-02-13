// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'
import { YtdlInfoService, getOptions } from './info.class.js'
import { ytdlInfoPath, ytdlInfoMethods } from './info.shared.js'

export * from './info.class.js'

// A configure function that registers the service and its hooks via `app.configure`
export const ytdlInfo = (app) => {
  // Register our service on the Feathers application
  app.use(ytdlInfoPath, new YtdlInfoService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ytdlInfoMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(ytdlInfoPath).hooks({
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
