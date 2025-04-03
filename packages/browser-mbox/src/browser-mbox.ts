import { fileOpen } from 'browser-fs-access'
import { openDB } from 'idb'
import { type Email } from 'postal-mime'

import { blobToText } from './blob-to-text'
import { fileToEmailIDB } from './file-to-email-idb'
import { textToEmail } from './text-to-email'
import { yieldToMain } from './yield-to-main'

export interface BrowserMBoxEmailType {
  from?: Email['from']
  subject?: string
  date?: string
  messageId?: string
  id?: number
  offset: number
  offsetLength: number
}

export interface BrowserMBoxEmailParsedType extends Email {
  html?: string
  text?: string
  raw?: string
}

export enum BrowserMBoxEvent {
  PROGRESS = 'progress',
  READY = 'ready',
}

export class BrowserMBox {
  private readonly dbName: string
  private readonly storeName: string
  private readonly eventTarget: EventTarget | undefined = undefined
  private blob: Blob | undefined = undefined

  public constructor(options?: { dbName?: string; storeName?: string }) {
    this.dbName = options?.dbName ?? 'browser-mbox'
    this.storeName = options?.storeName ?? 'browser-mbox-store'
    this.eventTarget = new EventTarget()
  }

  public addEventListener(
    type: BrowserMBoxEvent,
    listener: (event: CustomEvent) => void
  ) {
    this.eventTarget?.addEventListener(
      type,
      listener as unknown as EventListener
    )
  }

  public removeEventListener(
    type: BrowserMBoxEvent,
    listener: (event: CustomEvent) => void
  ) {
    this.eventTarget?.removeEventListener(
      type,
      listener as unknown as EventListener
    )
  }

  public async open(options?: {
    file?: File
    chunkSize?: number
    maxChunkSize?: number
  }) {
    this.eventTarget?.dispatchEvent(
      new CustomEvent(BrowserMBoxEvent.PROGRESS, { detail: 0 })
    )

    this.blob =
      options?.file ||
      (await fileOpen({
        extensions: ['.mbox', '.eml'],
        mimeTypes: [
          'application/mbox',
          'application/vnd.ms-outlook',
          'message/rfc822',
        ],
        multiple: false,
      }))

    if (!this.blob) {
      throw new Error('File not opened')
    }

    this.eventTarget?.dispatchEvent(
      new CustomEvent(BrowserMBoxEvent.PROGRESS, { detail: 1 })
    )

    await yieldToMain()
    await fileToEmailIDB(this.blob as File, {
      chunkSize: options?.chunkSize,
      dbName: this.dbName,
      maxChunkSize: options?.maxChunkSize,
      onProgress: (progress) => {
        this.eventTarget?.dispatchEvent(
          new CustomEvent(BrowserMBoxEvent.PROGRESS, { detail: progress })
        )
      },
      storeName: this.storeName,
    })

    return this
  }

  public async count() {
    if (!this.blob) {
      throw new Error('File not opened')
    }
    const currentDatabaseInstance = await openDB(this.dbName)
    const countValue = await currentDatabaseInstance.count(this.storeName)

    await yieldToMain()
    // Important to close the database
    currentDatabaseInstance.close()

    return countValue
  }

  public async list(start: number, count: number) {
    if (!this.blob) {
      throw new Error('File not opened')
    }

    const currentDatabaseInstance = await openDB(this.dbName)
    await yieldToMain()

    let hasSkipped = false
    const listData: BrowserMBoxEmailType[] = []
    const transaction = currentDatabaseInstance.transaction(
      this.storeName,
      'readonly'
    )
    // This can not be yielded to main thread, because it is a cursor
    // and it will be closed when the transaction is closed
    for await (const cursor of transaction.store) {
      if (!hasSkipped && start > 0) {
        hasSkipped = true
        cursor.advance(start)
        continue
      }
      listData.push(cursor.value)
      if (listData.length < count) {
        cursor.continue()
      } else {
        break
      }
    }

    // Important to close the database
    currentDatabaseInstance.close()

    return listData
  }

  public async get(
    key: number | string
  ): Promise<BrowserMBoxEmailParsedType | undefined> {
    if (!this.blob) {
      throw new Error('File not opened')
    }

    const currentDatabaseInstance = await openDB(this.dbName)
    const result = await currentDatabaseInstance.get(this.storeName, key)

    await yieldToMain()
    const currentFile = this.blob
    const raw = await blobToText(currentFile, {
      end: result.offset + result.offsetLength,
      start: result.offset,
    })

    await yieldToMain()
    const parsed: BrowserMBoxEmailParsedType | undefined = await textToEmail(
      raw,
      result.offset
    )
    if (parsed) {
      parsed.raw = raw
    }

    await yieldToMain()
    // Important to close the database
    currentDatabaseInstance.close()

    return parsed
  }
}
