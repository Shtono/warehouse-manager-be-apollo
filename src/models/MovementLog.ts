import { MovementLog } from '@prisma/client'
import { builder } from '../builder'
import { prisma } from '../db'

builder.prismaObject('MovementLog', {
  fields: (t) => ({
    id: t.exposeID('id'),
    description: t.exposeString('description'),
    quantity: t.exposeInt('quantity'),
    movement_type: t.exposeString('movement_type'),
    warehouse_current_capacity: t.exposeInt('warehouse_current_capacity'),
    container_id: t.exposeID('container_id'),
    container: t.relation('container'),
    warehouse_id: t.exposeInt('warehouse_id'),
    warehouse: t.relation('warehouse'),
    customer_id: t.exposeInt('customer_id'),
    customer: t.relation('customer'),
    created_at: t.expose('created_at', { type: 'Date' }),
  }),
})

builder.queryField('movementLog', (t) =>
  t.prismaField({
    type: 'MovementLog',
    args: {
      id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_query, _root, args): Promise<MovementLog> => {
      const movementLog = await prisma.movementLog.findFirst({
        where: { id: args.id },
      })
      return movementLog as MovementLog
    },
  }),
)

builder.queryField('movementLogs', (t) =>
  t.prismaField({
    type: ['MovementLog'],
    resolve: async (query, _root, _args, _ctx, _info) => {
      return prisma.movementLog.findMany({ ...query })
    },
  }),
)
