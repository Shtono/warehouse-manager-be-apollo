import { builder } from '../builder';
import { prisma } from '../db';
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
});
builder.queryField('customers', (t) => t.prismaField({
    type: ['Customer'],
    resolve: async (query, _root, _args, _ctx, _info) => {
        return prisma.customer.findMany({ ...query });
    },
}));
builder.mutationField('createCustomer', (t) => t.prismaField({
    type: 'Customer',
    args: {
        name: t.arg({ type: 'String', required: true }),
        email: t.arg({ type: 'String', required: true }),
        phone: t.arg({ type: 'String', required: true }),
    },
    resolve: async (_one, _two, args) => {
        const data = { ...args, updated_at: new Date() };
        const customer = await prisma.customer.create({
            data,
        });
        return customer;
    },
}));
builder.mutationField('updateCustomer', (t) => {
    return t.prismaField({
        type: 'Customer',
        args: {
            id: t.arg({ type: 'Int', required: true }),
            name: t.arg({ type: 'String', required: false }),
            email: t.arg({ type: 'String', required: false }),
            phone: t.arg({ type: 'String', required: false }),
        },
        resolve: async (_one, _two, args) => {
            const { id, ...rest } = args;
            const data = { ...rest, updated_at: new Date() };
            console.log('Data: ', data);
            try {
                const customer = await prisma.customer.update({
                    where: { id },
                    data,
                });
                console.log(123);
                return customer;
            }
            catch (err) {
                console.log('Error: ', Object.keys(err));
                // @ts-ignore
                return null;
            }
        },
        nullable: true,
        description: 'Update a customer',
    });
});
