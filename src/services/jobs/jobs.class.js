import { KnexService } from '@feathersjs/knex'

import { logger } from '../../logger.js'

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class JobService extends KnexService {
  async setup(app) {
    this.app = app
    this.ytdl = app.get('ytdl')

    await this.restoreDownloadJobs()
  }

  async restoreDownloadJobs() {
    try {
      const jobsResponse = await this.app.service('jobs')._find({
        query: {
          $or: [{ status: 'starting' }, { status: 'downloading' }]
        }
      })

      for (const job of jobsResponse.data) {
        this.ytdl.createDownloadJob(this, job)
      }
    } catch (error) {
      logger.error('Error restoring download jobs', error)
    }
  }

  async patch(id, data, params) {
    const job = await super.patch(id, data, params)

    if (job.status === 'starting') {
      logger.info(`Starting job ${id}`)

      // Reset progress
      this.emit('ytdl:progress', { id, progress: null })

      await this.app.service('jobs')._patch(job.id, { status: 'downloading' })
      job.status = 'downloading'
      this.ytdl.createDownloadJob(this, job)
    } else if (job.status === 'stopped') {
      logger.info(`Stopping job ${id}`)
      this.ytdl.abortDownloadJob(job)
    } else if (job.status === 'remove') {
      logger.info(`Removing job ${id}`)
      this.ytdl.abortDownloadJob(job)
      this.app.service('jobs')._remove(id)
    }

    return job
  }

  async remove(id, params) {
    const job = await super.remove(id, params)

    this.ytdl.abortDownloadJob(job)

    return job
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'jobs',
    multi: ['remove']
  }
}
