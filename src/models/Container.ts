import { Container, Warehouse } from '@prisma/client'
import { builder } from '../builder'
import { prisma } from '../db'
import { checkCapacity, updateWarehouseCapacity } from '../helper/callRestApi'

builder.prismaObject('Container', {
  fields: (t) => ({
    id: t.exposeID('id'),
    quantity: t.exposeInt('quantity'),
    size: t.exposeFloat('size'),
    state: t.exposeString('state', { description: 'ACTIVE | ARCHIVED' }),
    product_id: t.exposeInt('product_id'),
    product: t.relation('product'),
    warehouse_id: t.exposeInt('warehouse_id'),
    warehouse: t.relation('warehouse'),
    movement_logs: t.relation('movement_logs'),
    created_at: t.expose('created_at', { type: 'Date' }),
    updated_at: t.expose('created_at', { type: 'Date' }),
  }),
})

builder.queryField('container', (t) =>
  t.prismaField({
    type: 'Container',
    args: {
      id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_query, _root, args): Promise<Container> => {
      const container = await prisma.container.findFirst({
        where: { id: args.id },
      })
      return container as Container
    },
  }),
)

builder.queryField('containers', (t) =>
  t.prismaField({
    type: ['Container'],
    args: {
      warehouse_id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (query, _root, { warehouse_id }, _ctx, _info) => {
      return prisma.container.findMany({ ...query, where: { warehouse_id } })
    },
  }),
)

builder.mutationField('addStockToWarehouse', (t) =>
  t.prismaField({
    type: 'Warehouse',
    description: 'Add stock to a warehouse. Returns the updated warehouse.',
    errors: {
      types: [Error],
    },
    extensions: {
      errors: {
        types: ['Error'],
      },
    },
    args: {
      warehouse_id: t.arg({ type: 'Int', required: true }),
      product_id: t.arg({ type: 'Int', required: true }),
      quantity: t.arg({ type: 'Int', required: true }),
      description: t.arg({ type: 'String', required: false }),
    },
    resolve: async (_one, _two, args): Promise<Warehouse> => {
      const { warehouse_id, product_id, quantity, description } = args

      // Find the warehouse
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouse_id },
      })

      // Find the product
      const product = await prisma.product.findUnique({
        where: { id: product_id },
      })

      // @ts-ignore I could not find a way to throw an error using Pothos at this point in time
      if (!warehouse || !product) throw new Error('Could not find resources') // Here we return an error: Warehouse or Product not found

      // Check if product and warehouse are compatible
      if (warehouse.hazardous !== product.hazardous) {
        // Here we return an error: Product and warehouse are incompatible
        throw new Error(
          'Cannot add hazardous product to non hazardous warehouse and vice versa',
        )
      }

      // type Res = {
      //   isAvailableCapacity: boolean
      //   containerSize: number
      //   updatedCurrentCapacity: number
      // }
      //
      // const checkCapacity = async ({
      //   quantity,
      //   productSize,
      //   warehouseCurrentCapacity,
      //   warehouseMaxCapacity,
      // }): Promise<Res> => {
      //   try {
      //     const { data } = await axios.post<Res>(
      //       `${REST_BE_URL}/add-stock-to-warehouse`,
      //       {
      //         quantity,
      //         product_size: productSize,
      //         warehouse_current_capacity: warehouseCurrentCapacity,
      //         warehouse_max_capacity: warehouseMaxCapacity,
      //       },
      //       { headers: 'Content-Type: application/json' },
      //     )
      //     return data
      //   } catch (err) {
      //     throw new Error(err.error ?? 'Could not check capacity')
      //   }
      // }

      // Check id there is available capacity in the warehouse to fit the product
      // Here we make a request to REST API -> send quantity, product.size, warehouse.current_capacity and warehouse.capacity
      const { isAvailableCapacity, containerSize, updatedCurrentCapacity } =
        await checkCapacity({
          quantity,
          productSize: product.size,
          warehouseCurrentCapacity: warehouse.current_capacity,
          warehouseMaxCapacity: warehouse.capacity,
        })

      if (!isAvailableCapacity)
        throw new Error('Not enough capacity in warehouse') // Here we return an error: Not enough capacity

      // Create a new container
      const container = await prisma.container.create({
        data: { quantity, size: containerSize, product_id, warehouse_id },
      })

      // Create a movementLog
      await prisma.movementLog.create({
        data: {
          description: description ?? '',
          quantity,
          container_id: container?.id,
          warehouse_id,
          customer_id: warehouse.customer_id,
          warehouse_current_capacity: updatedCurrentCapacity,
        },
      })

      // Update the current_capacity of the warehouse
      const updatedWarehouse = prisma.warehouse.update({
        where: { id: warehouse_id },
        data: { current_capacity: updatedCurrentCapacity },
      })
      return updatedWarehouse
    },
  }),
)

// remove stock from warehouse
builder.mutationField('removeStockFromWarehouse', (t) =>
  t.prismaField({
    type: 'Warehouse',
    description:
      'Remove stock from a warehouse. Returns the updated warehouse.',
    errors: {
      types: [Error],
    },
    args: {
      warehouse_id: t.arg({ type: 'Int', required: true }),
      container_id: t.arg({ type: 'Int', required: true }),
      description: t.arg({ type: 'String', required: false }),
    },
    resolve: async (_one, _two, args): Promise<Warehouse> => {
      const { warehouse_id, container_id, description } = args

      // Get the warehouse by id
      const warehouse = await prisma.warehouse.findUnique({
        where: { id: warehouse_id },
      })

      // Get the container by id
      const container = await prisma.container.findUnique({
        where: { id: container_id },
      })

      // Check if warehouse and container exist
      if (!warehouse || !container) {
        throw new Error('Could not remove product from warehouse')
      }

      // Call the REST API to return the updated current capacity of the warehouse
      // Send (warehouse.current_capacity, container.size)
      const { updated_current_capacity } = await updateWarehouseCapacity({
        currentCapacity: warehouse.current_capacity,
        containerSize: container.size,
      })

      // Update the warehouse field current_capacity
      const updatedWarehouse = await prisma.warehouse.update({
        where: { id: warehouse_id },
        data: { current_capacity: updated_current_capacity },
      })

      // Update the container fields {state: ARCHIVED}
      await prisma.container.update({
        where: { id: container_id },
        data: { state: 'ARCHIVED' },
      })

      // Create new MovementLod for the container
      await prisma.movementLog.create({
        data: {
          description:
            description ??
            `Container (ID: ${container_id}) removed from warehouse (ID: ${warehouse.id})`,
          quantity: container.quantity,
          movement_type: 'OUT',
          container_id: container.id,
          warehouse_id: warehouse.id,
          customer_id: warehouse.customer_id,
        },
      })

      return updatedWarehouse
    },
  }),
)
