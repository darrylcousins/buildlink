/**
 * @file Provides a `client` for graphql queries
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

const cache = new InMemoryCache().restore(window.__APOLLO_STATE__)

const stateLink = withClientState({ cache })

export default new ApolloClient({
  link: ApolloLink.from([stateLink]),
  cache: cache,
})
