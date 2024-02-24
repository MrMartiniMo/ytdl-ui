export const ytdlImdbPath = 'ytdl/imdb'

export const ytdlImdbMethods = ['find']

export const ytdlImdbClient = (client) => {
  const connection = client.get('connection')

  client.use(ytdlImdbPath, connection.service(ytdlImdbPath), {
    methods: ytdlImdbMethods
  })
}
