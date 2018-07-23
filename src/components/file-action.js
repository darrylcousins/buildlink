/**
 * @file Provides a `FileActions` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

export default class FileActions extends React.Component {

  render() {

    const { children, action } = this.props

    return (
      <a href="#"
        className="link pa1 f6 fw1 navy hover-bg-gray hover-white dib pointer br2"
        onClick={ action }>
        { children }
      </a>
    )
  }
}


