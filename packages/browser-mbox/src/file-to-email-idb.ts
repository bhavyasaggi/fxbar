import { openDB } from 'idb'
import { type Email } from 'postal-mime'

import { blobToText } from './blob-to-text'
import { textToEmail } from './text-to-email'
import { yieldToMain } from './yield-to-main'

export interface BrowserMBoxEmailType {
  from?: Email['from']
  subject?: string
  date?: string
  messageId?: string
  id?: number
  offset?: number
  offsetLength?: number
}

export async function fileToEmailIDB(
  file: File,
  options?: {
    dbName?: string
    storeName?: string
    chunkSize?: number
    maxChunkSize?: number
    onProgress?: (progress: number) => void
  }
) {
  const databaseName = options?.dbName ?? 'browser-mbox'
  const storeName = options?.storeName ?? 'browser-mbox-store'

  let pendingText = ''
  let pendingOffset = 0

  const currentDatabaseInstance = await openDB(databaseName, undefined, {
    upgrade(database) {
      database.createObjectStore(storeName)
    },
  })
  // Clean out before loading new data
  await currentDatabaseInstance.clear(storeName)
  options?.onProgress?.(10)

  const chunkSize = options?.chunkSize ?? file.size
  const totalChunks = chunkSize ? Math.ceil(file.size / chunkSize) : 1
  for (let index = 0; index < totalChunks; index += 1) {
    await yieldToMain()

    const start = index * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const text = await blobToText(file, { end, start })
    const textWithPending = pendingText + text
    if (
      options?.maxChunkSize &&
      textWithPending.length > options.maxChunkSize
    ) {
      throw new Error('Chunk size is too large')
    }

    const textArray = textWithPending.split(/^From /gm)
    const textArrayWithOffset: { offset: number; text: string }[] = []
    for (const [vIndex, element] of textArray.entries()) {
      await yieldToMain()
      const v = element || ''
      let currentOffset = pendingOffset
      let vSafe = v
      const vPrevious = textArrayWithOffset[vIndex - 1]
      if (vPrevious && vIndex > 0) {
        currentOffset = vPrevious.offset + vPrevious.text.length
        vSafe = `From ${v}`
      }
      textArrayWithOffset.push({
        offset: currentOffset,
        text: vSafe,
      })
    }

    await yieldToMain()
    const pending = textArrayWithOffset.pop()
    pendingText = pending?.text ?? textWithPending
    pendingOffset = pending?.offset ?? pendingOffset

    for (const textItem of textArrayWithOffset) {
      await yieldToMain()
      const email = await textToEmail(textItem.text, {
        offset: textItem.offset,
      })
      if (email) {
        await yieldToMain()
        await currentDatabaseInstance.add(storeName, {
          date: email.date,
          from: email.from,
          messageId: email.messageId,
          offset: email.offset,
          offsetLength: email.offsetLength,
          subject: email.subject,
        })
      }
    }
    options?.onProgress?.(Math.floor(((index + 1) / totalChunks) * 90) + 10)
  }

  await yieldToMain()
  const pendingEmailWithOffset = await textToEmail(pendingText, {
    offset: pendingOffset,
  })
  if (pendingEmailWithOffset) {
    await yieldToMain()
    await currentDatabaseInstance.add(storeName, {
      date: pendingEmailWithOffset.date,
      from: pendingEmailWithOffset.from,
      messageId: pendingEmailWithOffset.messageId,
      offset: pendingEmailWithOffset.offset,
      offsetLength: pendingEmailWithOffset.offsetLength,
      subject: pendingEmailWithOffset.subject,
    })
  }

  // Important to close the database
  currentDatabaseInstance.close()
  options?.onProgress?.(100)

  return
}
