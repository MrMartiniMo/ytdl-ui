import nameToImdb from 'name-to-imdb'
import sanitizeFilename from 'sanitize-filename'

export class YtdlImdbService {
  constructor(options) {
    this.options = options
  }

  async find(params) {
    console.log('YtdlImdbService:params', params.query)

    const query = {}

    if (typeof params.query.name === 'string' && params.query.name.trim().length > 0) {
      query.name = params.query.name.trim()
    } else {
      throw new Error('Invalid name')
    }
    if (['all', 'movie', 'series'].includes(params.query.type)) {
      if (params.query.type !== 'all') {
        query.type = params.query.type
      }
    } else {
      throw new Error('Invalid type')
    }

    return new Promise((resolve, reject) =>
      nameToImdb(query, (err, res, inf) => {
        if (err) {
          reject(err)
        } else {
          if (res) {
            const imdbResult = {
              imdbid: res,
              meta: [
                {
                  key: 'IMDb ID',
                  value: res
                }
              ],
              image: inf?.meta?.image,
              url: `https://www.imdb.com/title/${res}/`,
              raw: inf
            }

            let suggestedFilename = query.name
            if (inf?.meta?.name) {
              imdbResult.meta.push({ key: 'Title', value: inf.meta.name })
              suggestedFilename = inf.meta.name
            }
            if (inf?.meta?.year) {
              imdbResult.meta.push({ key: 'Year', value: inf.meta.year })
              suggestedFilename += ` (${inf.meta.year})`
            }
            if (inf?.meta?.yearRange) {
              imdbResult.meta.push({ key: 'Range', value: inf.meta.yearRange })
            }
            if (inf?.meta?.starring) {
              imdbResult.meta.push({ key: 'Starring', value: inf.meta.starring })
            }

            suggestedFilename += ` [imdbid-${res}]`

            imdbResult.suggestedFilename = sanitizeFilename(suggestedFilename, {
              replacement: function (a, b) {
                if (a === ':') {
                  return ' - '
                }

                return ''
              }
            }).replace(/ {2}/g, ' ')

            resolve(imdbResult)
          } else {
            resolve({ error: 'No results found' })
          }
        }
      })
    )

    return []
  }
}

export const getOptions = (app) => {
  return { app }
}
