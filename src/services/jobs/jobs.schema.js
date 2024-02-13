// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../validators.js'
import { userSchema } from '../users/users.schema.js'

// Main data model schema
export const jobSchema = Type.Object(
  {
    id: Type.Number(),
    url: Type.String(),
    params: Type.Optional(Type.String()),
    filename: Type.Optional(Type.String()),
    status: Type.Optional(Type.String()),
    userId: Type.Number(),
    user: Type.Ref(userSchema),
    createdAt: Type.Optional(Type.String({ format: 'date-time' }))
  },
  { $id: 'Job', additionalProperties: false }
)
export const jobValidator = getValidator(jobSchema, dataValidator)
export const jobResolver = resolve({
  user: virtual(async (job, context) => {
    if (job.userId) {
      return await context.app.service('users').get(job.userId)
    }
  })
})

export const jobExternalResolver = resolve({})

// Schema for creating new entries
export const jobDataSchema = Type.Pick(jobSchema, ['url', 'params', 'filename', 'status'], {
  $id: 'JobData'
})
export const jobDataValidator = getValidator(jobDataSchema, dataValidator)
export const jobDataResolver = resolve({
  userId: async (_value, _message, context) => {
    return context.params.user.id
  },
  createdAt: async () => {
    return Date.now()
  }
})

// Schema for updating existing entries
export const jobPatchSchema = Type.Partial(jobSchema, {
  $id: 'JobPatch'
})
export const jobPatchValidator = getValidator(jobPatchSchema, dataValidator)
export const jobPatchResolver = resolve({})

// Schema for allowed query properties
export const jobQueryProperties = Type.Pick(jobSchema, [
  'id',
  'url',
  'params',
  'filename',
  'status',
  'createdAt',
  'userId'
])
export const jobQuerySchema = Type.Intersect(
  [
    querySyntax(jobQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export const jobQueryValidator = getValidator(jobQuerySchema, queryValidator)
export const jobQueryResolver = resolve({
  userId: async (value, _user, context) => {
    if (context.params.user) {
      return context.params.user.id
    }
    return value
  }
})
