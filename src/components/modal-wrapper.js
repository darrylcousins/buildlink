/**
 * @file Provides a `modalWrapper` component
 * @author Darryl Cousins <darryljcousins@gmail.com>
 */
import React from 'react'

import Modal from 'react-modal'

// pretty assertive assumption here but works in this app
Modal.setAppElement(document.getElementById('root'))

// Modal styles
const customStyles = {
  content : {
    top : '50%',
    left : '50%',
    right : 'auto',
    bottom : 'auto',
    border: '3px',
    marginRight : '-50%',
    transform : 'translate(-50%, -50%)'
  }
}

export default class ModalWrapper extends React.Component {

  constructor(props) {
    super(props)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.onRequestClose = this.onRequestClose.bind(this)
  }

  afterOpenModal() {
  }

  onRequestClose() {
  }

  render() {

    const { children } = this.props

    return (
      <Modal
        closeTimeoutMS={ 150 }
        isOpen={ this.props.isOpen }
        onAfterOpen={ this.afterOpenModal }
        onRequestClose={ this.onRequestClose }
        style={ customStyles }
        >
        <button
          type="button"
          className="ph0 mh0 bg-transparent bn f3 fr dib pointer"
          onClick={ this.props.closeModal }
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="db">
          { children }
        </div>
      </Modal>
    )
  }
}
