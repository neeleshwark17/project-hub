export const config = {
  graphqlEndpoint: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql/',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
};
