/**
 * @file Provides a `FileDownload` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import { CSVLink } from 'react-csv'

export default class FileDownload extends React.Component {

  render() {
    return (
        <CSVLink
          data={ this.props.data }
          headers={ this.props.headers }
          filename={ this.props.filename }
          className="sans-serif bw0 br3 bg-blue pv2 ph3 mv2 white fw1 pointer no-underline dtc dib bg-animate hover-bg-dark-blue"
        >Download file</CSVLink>
    )
  }
}

