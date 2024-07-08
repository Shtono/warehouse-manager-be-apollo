export const resolvers = {
  Query: {
    async getCustomer(parent: any, args: any, context: any, info: any) {
      return {
        id: 1,
        name: 'John Doe',
        email: 'John@doe.com',
        phone: '1234567890',
        warehouses: [],
      }
    },
  },
  Mutation: {
    async createCustomer1(parent: any, args: any, context: any, info: any) {
      return {
        id: 1,
        name: args.test,
        // name: 'John Doe',
        email: 'john@doe.com',
        phone: JSON.stringify(args),
      }
    },
  },
}
