import React from 'react'
import { number } from 'prop-types'

export default function Trash({ size = 24 }) {
  return (
    <svg style={{ hieght: size, width: size }} viewBox='0 0 24 24'>
      <path
        d='M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z'
        fill='currentColor'
      />
    </svg>
  )
}

Trash.propTypes = {
  size: number
}
