export const jobPath = 'jobs'

export const jobMethods = ['find', 'get', 'create', 'patch', 'remove']

export const jobClient = (client) => {
  const connection = client.get('connection')

  client.use(jobPath, connection.service(jobPath), {
    methods: jobMethods
  })
}
