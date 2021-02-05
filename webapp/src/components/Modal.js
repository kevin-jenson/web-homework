import React from 'react'
import PropTypes from 'prop-types'
import MuiModal from '@material-ui/core/Modal'

function Modal({ children, open, onClose }) {
  return (
    <MuiModal onClose={onClose} open={open}>
      {children}
    </MuiModal>
  )
}

export default Modal

Modal.propTypes = {
  children: PropTypes.element,
  open: PropTypes.bool,
  onClose: PropTypes.func
}
