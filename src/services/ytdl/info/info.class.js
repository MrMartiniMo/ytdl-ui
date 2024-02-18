import { logger } from '../../../logger.js'
import prettyBytes from 'pretty-bytes'

export class YtdlInfoService {
  constructor(options) {
    this.options = options
  }

  async setup(app) {
    this.app = app
    this.ytdl = app.get('ytdl')
  }

  async find(params) {
    try {
      const videoInfo = await this.ytdl.getVideoInfo(params.query.url)

      const formats = []
      if (videoInfo.formats) {
        for (const format of videoInfo.formats) {
          if (!(format.acodec === 'none' && format.vcodec === 'none')) {
            const formatInfo = {
              id: format.format_id,
              ext: format.ext,
              resolution: format.resolution ?? 'unknown',
              vcodec:
                format.vcodec === 'none' && format.acodec !== 'none'
                  ? 'audio only'
                  : format.vcodec ?? 'unknown',
              acodec:
                format.acodec === 'none' && format.vcodec !== 'none'
                  ? 'video only'
                  : format.acodec ?? 'unknown',
              note: format.format_note
            }

            if (format.filesize) {
              formatInfo.size = format.filesize
              formatInfo.formatted_size = prettyBytes(format.filesize)
            } else if (format.filesize_approx) {
              formatInfo.size = format.filesize_approx
              formatInfo.formatted_size = `~ ${prettyBytes(format.filesize_approx)}`
            } else {
              formatInfo.size = 'unknown'
              formatInfo.formatted_size = 'unknown'
            }

            formats.push(formatInfo)
          }
        }
      }

      return formats
    } catch (error) {
      logger.error('Unable to get video informaton:', error)
      return { error: error.message }
    }
  }
}

export const getOptions = (app) => {
  return { app }
}
