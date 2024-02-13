export const ytdlInfoPath = 'ytdl/info'

export const ytdlInfoMethods = ['find']

export const ytdlInfoClient = (client) => {
  const connection = client.get('connection')

  client.use(ytdlInfoPath, connection.service(ytdlInfoPath), {
    methods: ytdlInfoMethods
  })
}
