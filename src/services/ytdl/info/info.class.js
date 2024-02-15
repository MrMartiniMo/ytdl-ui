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
              resolution: format.resolution,
              vcodec: format.vcodec === 'none' && format.acodec !== 'none' ? 'audio only' : format.vcodec,
              acodec: format.acodec === 'none' && format.vcodec !== 'none' ? 'video only' : format.acodec,
              note: format.format_note
            }

            if (format.filesize) {
              formatInfo.size = prettyBytes(format.filesize)
            }
            if (format.filesize_approx) {
              formatInfo.size_approx = prettyBytes(format.filesize_approx)
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
