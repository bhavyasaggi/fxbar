import React from 'react'

import PageError, { type PageErrorProps } from '@/components/PageError'

import type { NextPageContext } from 'next'

function Error({ name, label, description }: PageErrorProps) {
  return <PageError description={description} label={label} name={name} />
}

Error.getInitialProps = ({ err }: NextPageContext) => {
  return {
    description: err?.stack,
    label: err?.message,
    name: err?.name,
  }
}

export default Error
