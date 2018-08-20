/**
 * @file Provides a `FileMeta` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

export default class FileMeta extends React.Component {

  render() {
    const { title, filename, rows, tableStyle } = this.props

    return (
      <div className="pointer br2 bg-white mb2 bg-animate hover-bg-light-gray border-box">
        <div className={ `${ tableStyle } pa1 br2` }>
          <strong className="db">{ title }:</strong>
          <div className="ml1">
            <span className="db">{ filename }</span>
            <small>({ rows } rows)</small>
          </div>
        </div>
      </div>
    )
  }
}

