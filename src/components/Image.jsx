/* eslint-disable no-unused-vars */
import React from 'react'

const Image = (props) => {
  return (
    <div>
        <img src={props.src} alt={props.alt || ""} />
    </div>
  )
}

export default Image