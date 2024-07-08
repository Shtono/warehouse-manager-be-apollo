import { Product, Warehouse } from '@prisma/client'
import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('Product', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    price: t.exposeFloat('price'),
    size: t.exposeFloat('size'),
    hazardous: t.exposeBoolean('hazardous'),
    containers: t.relation('containers'),
    customer_id: t.exposeInt('customer_id'),
    customer: t.relation('customer'),
    created_at: t.expose('created_at', { type: 'Date' }),
    updated_at: t.expose('updated_at', { type: 'Date' }),
  }),
})

// Queries
// GET one
builder.queryField('product', (t) =>
  t.prismaField({
    type: 'Product',
    args: {
      id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_query, _root, args): Promise<Product> => {
      const product = await prisma.product.findFirst({
        where: { id: args.id },
      })
      return product as Product
    },
  }),
)

// GET many
builder.queryField('products', (t) =>
  t.prismaField({
    type: ['Product'],
    args: { customer_id: t.arg({ type: 'Int', required: true }) },
    resolve: async (query, _root, { customer_id }, _ctx, _info) => {
      return prisma.product.findMany({ ...query, where: { customer_id } })
    },
  }),
)

// Mutations
// create
builder.mutationField('createProduct', (t) =>
  t.prismaField({
    type: 'Product',
    description: 'Create a new product',
    args: {
      name: t.arg({ type: 'String', required: true }),
      description: t.arg({ type: 'String', required: true }),
      price: t.arg({ type: 'Float', required: true }),
      size: t.arg({ type: 'Float', required: true }),
      hazardous: t.arg({ type: 'Boolean', required: true }),
      customer_id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_one, _two, args): Promise<Product> => {
      const data = { ...args, updated_at: new Date() }
      const newProduct = await prisma.product.create({
        data,
      })
      return newProduct
    },
  }),
)

// update
builder.mutationField('updateProduct', (t) =>
  t.prismaField({
    type: 'Product',
    description: 'Update a product',
    args: {
      id: t.arg({ type: 'Int', required: true }),
      name: t.arg({ type: 'String', required: false }),
      description: t.arg({ type: 'String', required: false }),
      price: t.arg({ type: 'Float', required: false }),
      size: t.arg({ type: 'Float', required: false }),
      hazardous: t.arg({ type: 'Boolean', required: false }),
    },
    resolve: async (_one, _two, args): Promise<Product> => {
      const { id, ...data } = args as Warehouse
      const product = await prisma.product.findUnique({ where: { id } })
      if (
        product &&
        (('hazardous' in data && data.hazardous !== product.hazardous) ||
          ('size' in data && data.size !== product?.size))
      ) {
        const containersThatContainProduct = await prisma.container.findMany({
          where: { product_id: id, state: 'ACTIVE' },
        })
        if (containersThatContainProduct.length) {
          // Here we throw an error:
          // "Cannot change field 'hazardous' of product 'product.name, because it is being used'"
          // "Cannot change field 'size' of product 'product.name, because it is being used'"
          throw new Error(
            'Cannot update field hazardous of product because it is being used',
          )
        }
      }
      const updatedProduct = await prisma.product.update({
        where: { id },
        data,
      })
      return updatedProduct
    },
  }),
)

// delete
builder.mutationField('deleteProduct', (t) =>
  t.prismaField({
    type: 'Product',
    description: 'Delete a product',
    args: {
      id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_one, _two, args): Promise<Product> => {
      try {
        const deletedProduct = await prisma.product.delete({
          where: { id: args.id },
        })
        return deletedProduct
      } catch (err) {
        throw new Error('Could not delete product')
      }
    },
  }),
)
