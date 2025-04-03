import ImageNext, { ImageProps as ImagePropsNext } from 'next/image'
import React from 'react'

export default function Image(props: ImagePropsNext) {
  return <ImageNext {...props} unoptimized />
}
