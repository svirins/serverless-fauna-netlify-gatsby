const React = require("react");
const { ThemeProvider } = require("theme-ui");
const { deep } = require("@theme-ui/presets");
const { Provider } = require("./identity-context");
const {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache
} = require("@apollo/client");
const tokens = {
  ...deep,
  sizes: { container: 1024 }
};
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri:
      "https://serverless-fauna-netlify-gatsby.netlify.com/.netlify/functions/graphql"
  })
});

module.exports = ({ element }) => (
  <ApolloProvider client={client}>
    <Provider>
      <ThemeProvider theme={tokens}>{element}</ThemeProvider>
    </Provider>
  </ApolloProvider>
);
