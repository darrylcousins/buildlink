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
    width: '50%',
    top : '45%',
    left : '50%',
    right : 'auto',
    bottom : 'auto',
    marginRight : '-50%',
    transform : 'translate(-50%, -50%)',
    padding: '1.5em 2em .5em 2em',
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
        <div className="db tr na3">
          <button
            type="button"
            className="ph0 mh0 bg-transparent bn f3 pointer"
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
