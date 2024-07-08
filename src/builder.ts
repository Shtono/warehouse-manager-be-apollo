import SchemaBuilder from '@pothos/core'
import ErrorsPlugin from '@pothos/plugin-errors'
import { DateResolver } from 'graphql-scalars'
import PrismaPlugin from '@pothos/plugin-prisma'
import type PrismaTypes from '@pothos/plugin-prisma/generated'
import { prisma } from './db'

export const builder = new SchemaBuilder<{
  Scalars: {
    Date: { Input: Date; Output: Date }
  }
  PrismaTypes: PrismaTypes
}>({
  plugins: [ErrorsPlugin, PrismaPlugin],
  prisma: {
    client: prisma,
    exposeDescriptions: true,
  },
  errorOptions: {
    defaultTypes: [Error],
  },
})

builder.queryType({})
builder.mutationType({})
builder.addScalarType('Date', DateResolver, {})

builder.objectType(Error, {
  name: 'Error',
  fields: (t) => ({
    error: t.exposeString('message'),
  }),
})
