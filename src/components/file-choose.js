/**
 * @file Provides a `FileChoose` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */

import React from 'react'

import FileMeta from './file-meta'

export default class FileChoose extends React.Component {

  constructor(props) {
    super(props)
    this.getTableStateStyle = this.getTableStateStyle.bind(this)
  }

  getTableStateStyle(tableState) {
    if (!tableState) {
      tableState = this.props.tableState
    }
    if (tableState === "result") return "bg-green white hover-bg-dark-green"
    if (tableState === "stock") return "bg-dark-blue white hover-bg-navy"
    if (tableState === "supplier") return "bg-gold white hover-bg-red"
    return ""
  }

  simpleLink() {
  }

  infoLink() {
  }

  render() {
    const { renderType, result, identifier, tableState, fileInfo, onClick } = this.props
    const tableStyle = identifier === tableState ? this.getTableStateStyle(identifier) : ""
    const title = `${ identifier.charAt(0).toUpperCase() + identifier.substr(1) } File`
    if (renderType === "metaLink") {
      return (
        <div className="mt1"
             onClick={ (e) => onClick(identifier) }>
          <FileMeta
            title={ title }
            tableStyle={ tableStyle }
            filename={ fileInfo.name }
            rows={ fileInfo.length }
          />
        </div>
      )
    }
    if (renderType === "titleLink") {
      return (
        <div
          className={ `${ tableStyle } pointer ml2 dib pa1 br1 br--top` }
          onClick={ (e) => onClick(identifier) }
          >
          <strong>{ fileInfo.name } ({ fileInfo.length } rows)</strong>
        </div>
      )
    }
  }
}
