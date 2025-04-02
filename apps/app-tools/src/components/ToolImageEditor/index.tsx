import { Box, Group, Paper, Skeleton, Text } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { saveAs } from 'file-saver'
import dynamic from 'next/dynamic'
import React, { useRef, useState } from 'react'

import Icon from '@/components/Icon'
import IMAGE_DEFAULT from '@/images/image-editor-default.jpg'

const FilerobotImageEditor = dynamic(
  () => import('react-filerobot-image-editor'),
  { loading: () => <Skeleton h={430} />, ssr: false }
)

export default function ToolImageEditor() {
  const dropzoneRef = useRef<() => void>(null)
  const [sourceImage, setSourceImage] = useState('')
  // TODO: Use CreateObjectUrl instead of FileReader
  const handleSourceImageChange = (file: File) => {
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      if (event.target?.result) {
        setSourceImage(event.target.result as string)
      }
    })
    reader.readAsDataURL(file)
  }

  return (
    <React.Fragment>
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        multiple={false}
        openRef={dropzoneRef}
        px='xs'
        py='xl'
        onDrop={(files) => {
          const file = files?.[0]
          if (file) {
            handleSourceImageChange(file)
          }
        }}
      >
        <Group align='center' justify='center' wrap='wrap'>
          <Dropzone.Accept>
            <Icon name='image' size={64} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <Icon
              name='x-octagon'
              size={64}
              style={{ color: 'var(--mantine-color-red)' }}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <Icon name='image' size={64} />
          </Dropzone.Idle>
          <Box>
            <Text fw='bold' size='xl'>
              Select Image
            </Text>
            <Text c='gray'>
              <Text span>Drag files here</Text>
              <Text span c='dimmed' fs='italic'>
                &nbsp;or&nbsp;
              </Text>
              <Text span>Browse to upload</Text>
            </Text>
          </Box>
        </Group>
      </Dropzone>
      <Paper withBorder mt='xs' shadow='md'>
        <FilerobotImageEditor
          avoidChangesNotSavedAlertOnLeave={true}
          defaultSavedImageName='download'
          defaultSavedImageQuality={0.85}
          defaultSavedImageType='jpg'
          previewPixelRatio={4} // window.devicePixelRatio
          resetOnImageSourceChange={true}
          savingPixelRatio={4}
          source={sourceImage || String(IMAGE_DEFAULT?.src || IMAGE_DEFAULT)}
          useCloudimage={false}
          onSave={(editedImageObject) => {
            if (editedImageObject.imageBase64) {
              saveAs(
                editedImageObject.imageBase64,
                editedImageObject.fullName || 'download.jpg'
              )
            }
          }}
        />
      </Paper>
    </React.Fragment>
  )
}
