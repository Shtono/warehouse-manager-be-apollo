export const typeDefs = `#graphql
    type Query {
#        ✅ Customer
        customer(id: ID!): Customer
        customers: [Customer!]!
#        ✅ Warehouse
        warehouse(id: ID!): Warehouse
        warehouses: [Warehouse!]!
#        ✅ Product
        product(id: ID!): Product
        products: [Product!]!
#        ✅ MovementLog
        movement_log(id: ID!): MovementLog
        movement_logs: [MovementLog!]!
#        ✅ Contai
        container(id: ID!): Container
        containers: [Container!]!
    }
type Mutation {
#    ✅ Customer
    createCustomer(input: CustomerInput!): Customer
    updateCustomer(id: ID!, input: CustomerInput!): Customer
    createCustomer1(test: String): Customer
    deleteCustomer(id: ID!): Customer
#    ✅ Warehouse
    createWarehouse(input: WarehouseInput!): Warehouse
    updateWarehouse(id: ID!, input: WarehouseInput!): Warehouse
    deleteWarehouse(id: ID!): Warehouse
#    ✅ Product
    createProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Product
#    ✅ Helper
    addStockToWarehouse(input: WarehouseInput!): Warehouse
    removeStockFromWarehouse(input: WarehouseInput!): Warehouse
}
  type Warehouse {
    id: ID!
    name: String!
    location: String!
    capacity: Int!
    current_capacity: Int!
    hazardous: Boolean!
    customer_id: Int!
    customer: Customer!
    movement_logs: [MovementLog!]!
    containers: [Container!]!
    created_at: String!
    updated_at: String!
  }
  type Customer {
    id: ID!
    name: String!
    email: String!
    phone: String!
    warehouses: [Warehouse!]!
    created_at: String!
    updated_at: String!
  }
  type MovementLog {
    id: ID!
    description: String!
    quantity: Int!
    movement_type: MovementType!
    container_id: Int!
    container: Container!
    warehouse_id: Int!
    warehouse: Warehouse!
    created_at: String!
  }
  type Container {
    id: ID!
    quantity: Int!
    size: Int!
    product_id: Int!
    product: Product!
    warehouse_id: Int!
    warehouse: Warehouse!
    movement_logs: [MovementLog!]!
    created_at: String!
    updated_at: String!
  }
  type Product {
    id: ID!
    name: String!
    description: String!
    price: Float!
    size: Int!
    hazardous: Boolean!
    containers: [Container!]!
    created_at: String!
    updated_at: String!
  }

  enum MovementType {
    IN
    OUT
  }
  input WarehouseInput {
    name: String!
    location: String!
    capacity: Int!
    hazardous: Boolean!
    customer_id: Int!
  }
  input CustomerInput {
    name: String!
    email: String!
    phone: String!
  }
  input MovementLogInput {
    description: String!
    quantity: Int!
    movement_type: MovementType!
    container_id: Int!
    warehouse_id: Int!
  }
  input ProductInput {
    name: String!
    description: String!
    price: Float!
    size: Int!
    hazardous: Boolean!
  }
`
