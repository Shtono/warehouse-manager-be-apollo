import { Customer } from '@prisma/client'
import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('Customer', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    phone: t.exposeString('phone'),
    warehouses: t.relation('warehouses'),
    created_at: t.expose('created_at', { type: 'Date' }),
    updated_at: t.expose('updated_at', { type: 'Date' }),
  }),
})

// Queries
builder.queryField('customer', (t) =>
  t.prismaField({
    type: 'Customer',
    args: {
      id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_query, _root, args): Promise<Customer> => {
      const customer = await prisma.customer.findFirst({
        where: { id: args.id },
      })
      return customer as Customer
    },
  }),
)

builder.queryField('customers', (t) =>
  t.prismaField({
    type: ['Customer'],
    resolve: async (query, _root, _args, _ctx, _info) => {
      return prisma.customer.findMany({ ...query })
    },
  }),
)

// Mutations

// create
builder.mutationField('createCustomer', (t) =>
  t.prismaField({
    type: 'Customer',
    description: 'Create a new customer',
    args: {
      name: t.arg({ type: 'String', required: true }),
      email: t.arg({ type: 'String', required: true }),
      phone: t.arg({ type: 'String', required: true }),
    },
    resolve: async (_one, _two, args): Promise<Customer> => {
      const data = { ...args, updated_at: new Date() }
      const customer = await prisma.customer.create({
        data,
      })
      return customer
    },
  }),
)

// update
builder.mutationField('updateCustomer', (t) => {
  return t.prismaField({
    type: 'Customer',
    description: 'Update a customer',
    args: {
      id: t.arg({ type: 'Int', required: true }),
      name: t.arg({ type: 'String', required: false }),
      email: t.arg({ type: 'String', required: false }),
      phone: t.arg({ type: 'String', required: false }),
    },
    resolve: async (_one, _two, args): Promise<Customer> => {
      const { id, ...rest } = args
      const data = { ...rest, updated_at: new Date() } as Customer
      const customer = await prisma.customer.update({
        where: { id },
        data,
      })
      return customer
    },
  })
})

// delete
builder.mutationField('deleteCustomer', (t) =>
  t.prismaField({
    description: 'Delete a customer',
    type: 'Customer',
    args: {
      id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_one, _two, args): Promise<Customer> => {
      const customer = await prisma.customer.delete({ where: { id: args.id } })
      return customer as Customer
    },
  }),
)
