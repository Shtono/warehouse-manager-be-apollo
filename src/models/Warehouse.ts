import { Warehouse } from '@prisma/client'
import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('Warehouse', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    location: t.exposeString('location'),
    capacity: t.exposeFloat('capacity'),
    current_capacity: t.exposeFloat('current_capacity'),
    hazardous: t.exposeBoolean('hazardous'),
    customer_id: t.exposeInt('customer_id'),
    customer: t.relation('customer'),
    movement_logs: t.relation('movement_logs'),
    containers: t.relation('containers'),
    created_at: t.expose('created_at', { type: 'Date' }),
    updated_at: t.expose('updated_at', { type: 'Date' }),
  }),
})

// Queries
builder.queryField('warehouse', (t) =>
  t.prismaField({
    type: 'Warehouse',
    args: {
      id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_query, _root, args): Promise<Warehouse> => {
      const warehouse = await prisma.warehouse.findFirst({
        where: { id: args.id },
      })
      return warehouse as Warehouse
    },
  }),
)

builder.queryField('warehouses', (t) =>
  t.prismaField({
    type: ['Warehouse'],
    args: { customer_id: t.arg({ type: 'Int', required: true }) },
    resolve: async (query, _root, args, _ctx, _info) => {
      const { customer_id } = args
      return prisma.warehouse.findMany({ ...query, where: { customer_id } })
    },
  }),
)

// Input types
builder.inputType('WarehouseInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    location: t.string({ required: true }),
    capacity: t.int({ required: true }),
    current_capacity: t.int({ required: true }),
    hazardous: t.boolean({ required: true }),
    customer_id: t.int({ required: true }),
    updated_at: t.field({ type: 'Date', required: false }), // Make sure this field is handled appropriately
  }),
})

// Mutations
// create
builder.mutationField('createWarehouse', (t) =>
  t.prismaField({
    type: 'Warehouse',
    description: 'Create a new warehouse',
    args: {
      name: t.arg({ type: 'String', required: true }),
      location: t.arg({ type: 'String', required: true }),
      capacity: t.arg({ type: 'Float', required: true }),
      // current_capacity: t.arg({ type: 'Float', required: true }),
      hazardous: t.arg({ type: 'Boolean', required: true }),
      customer_id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_one, _two, args): Promise<Warehouse> => {
      const data = { ...args, updated_at: new Date() }
      const newWarehouse = await prisma.warehouse.create({
        data,
      })
      return newWarehouse
    },
  }),
)

// update
builder.mutationField('updateWarehouse', (t) =>
  t.prismaField({
    type: 'Warehouse',
    description: 'Update a warehouse',
    errors: {
      types: [Error],
    },
    args: {
      id: t.arg({ type: 'Int', required: true }),
      name: t.arg({ type: 'String', required: false }),
      location: t.arg({ type: 'String', required: false }),
      capacity: t.arg({ type: 'Float', required: false }),
      // current_capacity: t.arg({ type: 'Float', required: false }),
      hazardous: t.arg({ type: 'Boolean', required: false }),
    },
    resolve: async (_one, _two, args): Promise<Warehouse> => {
      const { id, ...data } = args as Warehouse
      const warehouse = await prisma.warehouse.findUnique({ where: { id } })
      if (
        warehouse &&
        'hazardous' in data &&
        data.hazardous !== warehouse.hazardous &&
        warehouse.current_capacity > 0
      ) {
        throw new Error(
          'Cannot change hazardous status of a warehouse with stock',
        )
      }
      const updatedWarehouse = await prisma.warehouse.update({
        where: { id },
        data,
      })
      return updatedWarehouse
    },
  }),
)

// delete
builder.mutationField('deleteWarehouse', (t) =>
  t.prismaField({
    type: 'Warehouse',
    description: 'Delete a warehouse',
    args: {
      id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_one, _two, args): Promise<Warehouse> => {
      const deletedWarehouse = await prisma.warehouse.delete({
        where: { id: args.id },
      })
      return deletedWarehouse
    },
  }),
)
