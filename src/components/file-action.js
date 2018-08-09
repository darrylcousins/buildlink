/**
 * @file Provides a `FileActions` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

export default class FileActions extends React.Component {

  render() {

    const { children, action } = this.props

    return (
      <button className="w-100 pointer tl br2 ba bg-black-10 black-70 mv1 pa1 pl3 bg-animate hover-bg-light-gray border-box"
        onClick={ action }>
        { children }
      </button>
    )
  }
}


