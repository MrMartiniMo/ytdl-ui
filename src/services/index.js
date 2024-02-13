import { ytdlInfo } from './ytdl/info/info.js'

import { job } from './jobs/jobs.js'

import { user } from './users/users.js'

export const services = (app) => {
  app.configure(ytdlInfo)

  app.configure(job)

  app.configure(user)

  // All services will be registered here
}
