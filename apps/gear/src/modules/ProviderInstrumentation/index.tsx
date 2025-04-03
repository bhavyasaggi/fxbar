/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component, ErrorInfo } from 'react'

import PageError from '@/components/PageError'

const IS_DEV = process.env.NODE_ENV === 'development'

interface Props {
  readonly children: React.ReactNode
}

interface State {
  errorName: string | undefined
  errorLabel: string | undefined
  errorDescription: string | undefined
}

class ProviderInstrumentation extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      errorDescription: '',
      errorLabel: '',
      errorName: '',
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return {
      errorDescription: error.stack || JSON.stringify(error, undefined, 2),
      errorLabel: error.message || 'Something went wrong',
      errorName: error.name,
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (IS_DEV) {
      // eslint-disable-next-line no-console
      console.error('Error caught in ProviderInstrumentation:', error, info)
    }
  }

  render() {
    if (this.state.errorName || this.state.errorLabel) {
      // Fallback UI
      return (
        <PageError
          description={this.state.errorDescription}
          label={this.state.errorLabel}
          name={this.state.errorName}
        />
      )
    }

    return this.props.children
  }
}

export default ProviderInstrumentation
