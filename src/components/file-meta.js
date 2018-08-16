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
     * identifier is one of "stock", "supplier", "result"
     */
    const { onClick, identifier } = this.props
    onClick(identifier)
  }

  render() {
    const { title, filename, rows, tableState, getTableStateStyle, identifier } = this.props

    return (
      <div className="pointer br2 bg-white mb2 bg-animate hover-bg-light-gray border-box"
           onClick={ this.onClick }>
        <div className={ `${ identifier === tableState ? getTableStateStyle() : "" } pa1 br2` }>
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

