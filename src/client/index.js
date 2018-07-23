/**
 * @file Provides a `client` for graphql queries
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { InMemoryCache } from 'apollo-cache-inmemory'

export const getHeaders = gql`
  query {
    headers {
      value
      label
    }
  }
`

const resolvers = {
    Query: {
      headers: () => getHeaders,
    }
  }

const cache = new InMemoryCache().restore(window.__APOLLO_STATE__)

const defaults = {
    headers: ['Code', 'Description'],
}

const stateLink = withClientState({ resolvers, cache, defaults })
//const stateLink = withClientState({ resolvers, cache, defaults, typeDefs })

export default new ApolloClient({
  link: ApolloLink.from([stateLink]),
  cache: cache,
})
