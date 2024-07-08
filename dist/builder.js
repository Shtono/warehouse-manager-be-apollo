import SchemaBuilder from '@pothos/core';
import { DateResolver } from 'graphql-scalars';
import PrismaPlugin from '@pothos/plugin-prisma';
import { prisma } from './db';
export const builder = new SchemaBuilder({
    plugins: [PrismaPlugin],
    prisma: {
        client: prisma,
        exposeDescriptions: true,
    },
});
builder.queryType({});
builder.mutationType({});
builder.addScalarType('Date', DateResolver, {});
