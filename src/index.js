import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import registerServiceWorker from './registerServiceWorker'

// imports for console testing
import gql from 'graphql-tag'
import Client from './client'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()

window.Client = Client
window.gql = gql
