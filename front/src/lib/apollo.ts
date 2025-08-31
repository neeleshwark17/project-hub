import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

// Create HTTP link - replace with your GraphQL endpoint
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql/',
});

// Auth link for adding authentication headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from localStorage if it exists
  const token = localStorage.getItem('authToken');
  const organization = localStorage.getItem('organization');
  
  let orgSlug = '';
  if (organization) {
    try {
      const orgData = JSON.parse(organization);
      orgSlug = orgData.slug || '';
    } catch (error) {
      console.error('Error parsing organization data:', error);
    }
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'X-Organization-Slug': orgSlug,
    }
  };
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Project: {
        fields: {
          tasks: {
            merge(existing = [], incoming = []) {
              return incoming;
            },
          },
        },
      },
      Task: {
        fields: {
          comments: {
            merge(existing = [], incoming = []) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});