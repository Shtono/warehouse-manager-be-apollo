import { builder } from '../builder';
import { prisma } from '../db';
builder.prismaObject('Product', {
    fields: (t) => ({
        id: t.exposeID('id'),
        name: t.exposeString('name'),
        description: t.exposeString('description'),
        price: t.exposeFloat('price'),
        size: t.exposeInt('size'),
        hazardous: t.exposeBoolean('hazardous'),
        containers: t.relation('containers'),
        created_at: t.expose('created_at', { type: 'Date' }),
        updated_at: t.expose('updated_at', { type: 'Date' }),
    }),
});
builder.queryField('products', (t) => t.prismaField({
    type: ['Product'],
    resolve: async (query, _root, _args, _ctx, _info) => {
        return prisma.product.findMany({ ...query });
    },
}));
