/**
 * @file Provides a `FileMeta` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

export default class FileMeta extends React.Component {

  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    /*
     * identifier is one of "stock", "supplier"
     */
    const { onClick, identifier } = this.props
    onClick(identifier)
  }

  render() {
    const { title, filename, rows, tableState, identifier } = this.props

    return (
      <div className="pointer br2 bg-white mb2 bg-animate hover-bg-light-gray border-box"
           onClick={ this.onClick }>
        <div className={ `${ tableState === identifier ? "bg-black-60 white" : "ba b--black-20" } pa1 br2` }>
          <strong className="db">{ title }:</strong>
          <div className="ml1">
            <strong className="db">{ filename }</strong>
            <small>({ rows } rows)</small>
          </div>
        </div>
      </div>
    )
  }
}

