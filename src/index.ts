import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { schema } from './schema'
// import { typeDefs } from './graphql/typedefs'
// import { resolvers } from './graphql/resolvers'

const server = new ApolloServer({ schema })
// const server = new ApolloServer({ typeDefs, resolvers })

startStandaloneServer(server, { listen: { port: 4005 } }).then(() => {
  console.log('Server listening on port: ', 4005)
})
