import { builder } from '../builder';
import { prisma } from '../db';
builder.prismaObject('Warehouse', {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        location: t.exposeString('location'),
        capacity: t.exposeInt('capacity'),
        current_capacity: t.exposeInt('current_capacity'),
        hazardous: t.exposeBoolean('hazardous'),
        customer_id: t.exposeInt('customer_id'),
        customer: t.relation('customer'),
        movement_logs: t.relation('movement_logs'),
        containers: t.relation('containers'),
        created_at: t.expose('created_at', { type: 'Date' }),
        updated_at: t.expose('updated_at', { type: 'Date' }),
    }),
});
builder.queryField('warehouses', (t) => t.prismaField({
    type: ['Warehouse'],
    resolve: async (query, _root, _args, _ctx, _info) => {
        return prisma.warehouse.findMany({ ...query });
    },
}));
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
});
builder.mutationField('createWarehouse', (t) => t.prismaField({
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
