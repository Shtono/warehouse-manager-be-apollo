import { builder } from '../builder';
import { prisma } from '../db';
builder.prismaObject('MovementLog', {
    fields: (t) => ({
        id: t.exposeID('id'),
        description: t.exposeString('description'),
        quantity: t.exposeInt('quantity'),
        movement_type: t.exposeString('movement_type'),
        container_id: t.exposeID('container_id'),
        container: t.relation('container'),
        warehouse_id: t.exposeInt('warehouse_id'),
        warehouse: t.relation('warehouse'),
        created_at: t.expose('created_at', { type: 'Date' }),
    }),
});
builder.queryField('movementLog', (t) => t.prismaField({
    type: ['MovementLog'],
    resolve: async (query, _root, _args, _ctx, _info) => {
        return prisma.movementLog.findMany({ ...query });
    },
}));
