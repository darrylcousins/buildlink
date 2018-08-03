/**
 * @file Provides a `FileMeta` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

export default class FileMeta extends React.Component {

  render() {

    return (
      <div className="br2 ba b--black-20 bg-white pa0 mb2 bg-animate hover-bg-light-gray border-box">
        <div className="b dark-gray bb b--black-20 w-100 pa1 ma0">
          <span>File info:</span>
        </div>
        <dl className="f6 ma1 lh-copy">
          <dt className="b">Name</dt>
          <dd className="ml0">{ this.props.filename }</dd>
          <dt className="b">Rows</dt>
          <dd className="ml0">{ this.props.rows }</dd>
          <dt className="b">Size</dt>
          <dd className="ml0">{ this.props.size }</dd>
        </dl>
      </div>
    )
  }
}

