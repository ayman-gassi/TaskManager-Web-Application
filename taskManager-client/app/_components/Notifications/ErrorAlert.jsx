import React from 'react'

function ErrorAlert({ errorMessage }) {
  return (
    <p className=" bg-red-400 pt-1 pb-1 rounded-md mb-3 text-center text-sm text-white">{errorMessage}</p>
  )
}

export default ErrorAlert
