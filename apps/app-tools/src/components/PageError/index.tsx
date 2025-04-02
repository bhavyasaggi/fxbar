import React from 'react'

export interface PageErrorProps {
  readonly name?: string
  readonly label?: string
  readonly description?: string
}

export default function PageError(props: PageErrorProps) {
  return (
    <div>
      <p>{props.label || 'Something went wrong'}</p>
      {props.name ? <code>{props.name}</code> : undefined}
      {props.description ? (
        <pre>
          <code>{props.description}</code>
        </pre>
      ) : undefined}
    </div>
  )
}
