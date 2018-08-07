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
    width: '90%',
    top : '35%',
    left : '10%',
    right : 'auto',
    bottom : 'auto',
    marginRight : '-30%',
    transform : 'translate(-5%, -5%)',
    padding: '.5em 1em .5em 1em',
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

    const { children, isOpen, closeModal } = this.props

    return (
      <Modal
        closeTimeoutMS={ 150 }
        isOpen={ isOpen }
        onAfterOpen={ this.afterOpenModal }
        onRequestClose={ this.onRequestClose }
        style={ customStyles }
        >
        <div className="db tr nv3">
          <button
            type="button"
            className="pa1 mh0 bg-transparent bn f3 pointer"
            onClick={ closeModal }
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="sans-serif db">
          { children }
        </div>
      </Modal>
    )
  }
}
