import fs from 'fs'
import path from 'path'
import os from 'os'

import { logger } from './logger.js'
import yargsParser from 'yargs-parser'
import sanitizeFilename from 'sanitize-filename'
import prettyBytes from 'pretty-bytes'

import YTDlpWrapD from 'yt-dlp-wrap'
const YTDlpWrap = YTDlpWrapD.default

class YTDL {
  static async init(config) {
    const ytdl = new YTDL(config)

    ytdl.client = await ytdl.#getClient(true)

    return ytdl
  }

  constructor(config) {
    this.config = {
      executableDir: './.bin',
      executablePath: `./.bin/yt-dlp`,
      downloads: './downloads',
      ...config
    }

    this.client = null

    this.#createFolderIfNotExists(this.config.executableDir)
    this.#createFolderIfNotExists(this.config.downloads)

    this.#createFolderIfNotExists(`${this.config.downloads}/processing`)
    this.#createFolderIfNotExists(`${this.config.downloads}/completed`)

    this.processes = {}
  }

  #createFolderIfNotExists(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
  }

  async #getClient(update = false) {
    if (!fs.existsSync(this.config.executablePath)) {
      logger.info(`Downloading latest yt-dlp for ${os.platform()} ...`)
      await YTDlpWrap.downloadFromGithub(this.config.executablePath)
    }

    const ytdl = new YTDlpWrap(this.config.executablePath)
    const currentVersion = (await ytdl.getVersion()).trim()
    logger.info(`Current ytdl version: ${currentVersion}`)

    if (update) {
      logger.info('Checking for yt-dlp updates...')

      let latestReleasesData = await YTDlpWrap.getGithubReleases(1, 5)
      if (latestReleasesData.length > 0) {
        const latestVersion = latestReleasesData[0].tag_name.trim()
        logger.info(`Latest ytdl version: ${latestVersion}`)

        if (currentVersion !== latestVersion) {
          logger.info(`Updating yt-dlp from ${currentVersion} to ${latestVersion}...`)
          await YTDlpWrap.downloadFromGithub(this.config.executablePath)
          logger.info('yt-dlp updated')
        }
      }
    }

    return ytdl
  }

  #parseParams(paramsString) {
    const params = yargsParser(paramsString)

    return Object.keys(params).reduce((acc, key) => {
      if (key !== '_') {
        if (key.length == 1) {
          acc.push(`-${key}`)
        } else {
          acc.push(`--${key}`)
        }
        if (typeof params[key] !== 'boolean') {
          acc.push(params[key])
        }
      }
      return acc
    }, [])
  }

  #parseBytesFromString(value) {
    const units = ['B', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

    const regex = /(\d+\.?\d*)([KMG]?)(i?)B?/i
    const match = regex.exec(value)

    if (match) {
      let bytes = parseFloat(match[1])

      if (match[2]) {
        const binary = match[3] === 'i'
        const exponent = units.findIndex((unit) => unit === match[2].toUpperCase())

        if (exponent > -1) {
          bytes *= (binary ? 1024 : 1000) ** exponent
        }
      }

      return Math.trunc(bytes)
    }
    return 0
  }

  async getVideoInfo(url) {
    try {
      return JSON.parse(
        await this.client.execPromise([url, '--compat-options', 'manifest-filesize-approx', '--dump-json'])
      )
    } catch (error) {
      throw new Error('Unable to get video informaton')
    }
  }

  createDownloadJob(jobService, job) {
    const params = this.#parseParams(job.params)

    // modify the output filename in the params
    const outputIndex = params.indexOf('-o')
    if (outputIndex > -1) {
      params[outputIndex + 1] =
        `${this.config.downloads}/processing/${job.id}/${sanitizeFilename(params[outputIndex + 1])}`
    } else {
      params.push(
        '-o',
        `${this.config.downloads}/processing/${job.id}/${sanitizeFilename('%(title)s.%(ext)s')}`
      )
    }

    const process = {
      job
    }

    process.controller = new AbortController()
    process.eventEmitter = this.client.exec(
      [job.url, ...params],
      { shell: false, detached: true },
      process.controller.signal
    )

    process.eventEmitter
      .on('ytDlpEvent', (eventType, eventData) => {
        if (eventType === 'download' && job.status === 'downloading') {
          const progressRegex = /([^ ]*)% *of *~? *([^ ]*)(:? *at *([^ ]*))?(:? *ETA *([^ ]*))?/
          const progressMatch = progressRegex.exec(eventData.trim())

          if (progressMatch) {
            const progress = parseFloat(progressMatch[1])
            const totalBytes = this.#parseBytesFromString(progressMatch[2])
            const total = Number.isFinite(totalBytes) ? prettyBytes(totalBytes) : progressMatch[2]
            const speed = progressMatch[4]
            const eta = progressMatch[6]

            jobService.emit('ytdl:progress', {
              id: job.id,
              progress,
              total,
              speed,
              eta
            })
          } else {
            const progress = null
            const total = 'unknown'
            const speed = 'unknown'
            const eta = 'unknown'
            jobService.emit('ytdl:progress', { id: job.id, progress, total, speed, eta })
          }
        }
      })
      .on('error', () => {
        jobService.app.service('jobs').patch(job.id, { status: 'failed' })
        job.status = 'failed'
        logger.info(`Download job error ${job.id}`)
      })
      .on('close', () => {
        if (job.status === 'downloading') {
          jobService.app.service('jobs').patch(job.id, { status: 'done' })

          // get files in the download folder
          const files = fs.readdirSync(`${this.config.downloads}/processing/${job.id}`)
          files.forEach((file) => {
            const originalFileExt = path.extname(file)
            const originalFileName = path.basename(file, originalFileExt)

            let i = 0
            let newFileName = originalFileName
            while (fs.existsSync(`${this.config.downloads}/completed/${newFileName}${originalFileExt}`)) {
              i++
              newFileName = `${originalFileName} (${i})`
            }

            fs.renameSync(
              `${this.config.downloads}/processing/${job.id}/${file}`,
              `${this.config.downloads}/completed/${newFileName}${originalFileExt}`
            )
          })
        }
        delete this.processes[job.id]
        logger.info(`Download job closed ${job.id}`)
      })

    this.processes[job.id] = process
  }

  abortDownloadJob(job) {
    if (this.processes[job.id]) {
      this.processes[job.id].controller.abort()

      setTimeout(() => {
        fs.rmSync(`${this.config.downloads}/${job.id}`, { recursive: true, force: true })
      }, 1000)
    }
  }
}

export default YTDL
