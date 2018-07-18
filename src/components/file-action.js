/**
 * @file Provides a `FileActions` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import Settings from '../settings'

export default class FileActions extends React.Component {

  render() {

    const { children, action } = this.props

    return (
      <a href="#"
        className={ Settings.style.navLink }
        onClick={ action }>
        { children }
      </a>
    )
  }
}


