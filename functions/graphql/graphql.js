const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const q = faunadb.query;

var client = new faunadb.Client({ secret: process.env.FAUNA });

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    todos: [Todo]!
  }
  type Todo {
    id: ID!
    text: String!
    done: Boolean!
  }
  type Mutation {
    addTodo(text: String!): Todo
    updateTodoDone(id: ID!): Todo
  }
`;

const resolvers = {
  Query: {
    todos: (parent, args, { user }) => {
      if (!user) {
        return [];
      } else {
        const results = await client.query(q.Paginate(q.Match(q.Index("todos_by_user"),  user)))
        return results.data.map(([ref,text,done])=>{
          id: ref.id,
          text,
          done
        })
      }
    }
  },
  Mutation: {
    addTodo: async (_, { text }, { user }) => {
      if (!user) {
        throw new Error("no user !");
      } 
      const results = await client.query(q.Create(q.Collection("todos"), {
              data: {
                text: text,
                done: false,
                owner: user
              }
            })
      )
      return {
        ...reuslts.data,
        id: results.ref.id
      }
    },
    updateTodoDone: (_, { id }) => {
      if (!user) {
        throw new Error("no user !");
      } 
      const results = await client.query(
        q.Update(q.Ref(q.Collection("todos"), id), {data: {
          done: true
        }
      })
      )
      return {
        ...reuslts.data,
        id: results.ref.id
      }
    }
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context }) => {
    if (context.clientContext.user) {
      return { user: context.clientContext.user.sub };
    } else {
      return {};
    }
  },
  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // the `playground` and `introspection` options must be set explicitly to `true`.
  playground: true,
  introspection: true
});

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});
