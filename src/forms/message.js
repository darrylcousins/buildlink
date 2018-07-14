/**
 * @file Provides an `Message` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'
import { CSSTransition } from 'react-transition-group'

import Settings from '../settings'

export default class Message extends React.Component {

  constructor(props) {
    super(props)
    this.state = { in: false }
  }

  componentDidMount() {
    this.setState({ in: true })
  }

  render() {
    const { name, type, messages } = this.props

    if (messages === undefined || !(name in messages)) return null

    var color
    switch (type) {
      case "error":
        color = "red"
        break
      case "success":
        color = "dark-green"
        break
      case "warning":
        color = "orange"
        break
      default:
        color = "red"
    }
    const text = messages[name]

    return (
      <CSSTransition
        in={ this.state.in }
        timeout={300}
        classNames="fade"
        unmountOnExit
        >
        <div className={ Settings.style.message }>
          <span className={ color }>{ text }</span>
        </div>
      </CSSTransition>
    )
  }
}
