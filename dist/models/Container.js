import { builder } from '../builder';
import { prisma } from '../db';
builder.prismaObject('Container', {
    fields: (t) => ({
        id: t.exposeID('id'),
        quantity: t.exposeInt('quantity'),
        size: t.exposeInt('size'),
        product_id: t.exposeInt('product_id'),
        product: t.relation('product'),
        warehouse_id: t.exposeInt('warehouse_id'),
        warehouse: t.relation('warehouse'),
        movement_logs: t.relation('movement_logs'),
        created_at: t.expose('created_at', { type: 'Date' }),
        updated_at: t.expose('created_at', { type: 'Date' }),
    }),
});
builder.queryField('containers', (t) => t.prismaField({
    type: ['Container'],
    resolve: async (query, _root, _args, _ctx, _info) => {
        return prisma.container.findMany({ ...query });
    },
}));
builder.mutationField('addStockToWarehouse', (t) => t.prismaField({
    type: 'Warehouse',
    args: {
        name: t.arg({ type: 'String', required: true }),
        location: t.arg({ type: 'String', required: true }),
        capacity: t.arg({ type: 'Int', required: true }),
        current_capacity: t.arg({ type: 'Int', required: true }),
        hazardous: t.arg({ type: 'Boolean', required: true }),
        customer_id: t.arg({ type: 'Int', required: true }),
    },
    resolve: async (_one, _two, args) => {
        const data = { ...args, updated_at: new Date() };
        const newWarehouse = await prisma.warehouse.create({
            data,
        });
        return newWarehouse;
    },
}));
