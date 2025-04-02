/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable unicorn/prefer-add-event-listener */
import PostalMime, { type Email } from 'postal-mime'

import { yieldToMain } from './yield-to-main'

export interface MBoxWebEmailType {
  from?: Email['from']
  subject?: string
  date?: string
  messageId?: string
  id?: number
  offset: number
  offsetLength: number
}

export interface MBoxWebEmailParsedType extends Email {
  html?: string
  text?: string
  raw?: string
}

export enum MBoxWebEvent {
  PROGRESS = 'progress',
  READY = 'ready',
  CLEAR = 'clear',
  CLOSED = 'closed',
}

export const parseToEmail = async (
  text: string
): Promise<Email | undefined> => {
  let emailPostal: Email | undefined = undefined
  try {
    emailPostal = await PostalMime.parse(text)
  } catch {
    // do nothing
  }

  if (!text || !emailPostal || Object.keys(emailPostal).length === 0) {
    return undefined
  }
  return emailPostal
}

export class MBoxWeb {
  private readonly dbName: string
  private readonly storeName: string
  private readonly eventTarget: EventTarget | undefined = undefined
  private dbInstance: IDBDatabase | undefined = undefined
  private blob: Blob | undefined = undefined

  public constructor(options?: { dbName?: string; storeName?: string }) {
    this.dbName = options?.dbName ?? 'mbox-web'
    this.storeName = options?.storeName ?? 'mbox-web-store'
    this.eventTarget = new EventTarget()
  }

  public async toString(start: number, end: number) {
    if (!this.blob) {
      throw new Error('Blob is not set')
    }
    const arrayBuffer = await this.blob.slice(start, end).arrayBuffer()
    return new TextDecoder().decode(new Uint8Array(arrayBuffer))
  }

  public addEventListener(
    type: MBoxWebEvent,
    listener: (event: CustomEvent) => void
  ) {
    this.eventTarget?.addEventListener(
      type,
      listener as unknown as EventListener
    )
  }

  public removeEventListener(
    type: MBoxWebEvent,
    listener: (event: CustomEvent) => void
  ) {
    this.eventTarget?.removeEventListener(
      type,
      listener as unknown as EventListener
    )
  }

  public async open(
    blob: Blob,
    options?: { chunkSize?: number; maxChunkSize?: number }
  ) {
    const databaseName = this.dbName
    const storeName = this.storeName

    this.eventTarget?.dispatchEvent(
      new CustomEvent(MBoxWebEvent.PROGRESS, { detail: 0 })
    )
    this.blob = blob
    // Can reuse the same db instance
    this.dbInstance =
      this.dbInstance ??
      (await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(databaseName, 1)
        request.onsuccess = () => {
          const databaseInstance = request.result
          resolve(databaseInstance)
        }
        request.onerror = () => {
          reject(new Error('Error opening IndexedDB'))
        }
        request.onblocked = () => {
          reject(new Error('IndexedDB is blocked'))
        }
        request.onupgradeneeded = () => {
          const database = request.result
          if (!database.objectStoreNames.contains(storeName)) {
            const databaseStore = database.createObjectStore(storeName, {
              autoIncrement: true,
              keyPath: 'id',
            })
            databaseStore.createIndex('from', 'From', { unique: false })
          }
        }
      }))
    // Clean out before loading new data
    await this.clear()
    this.eventTarget?.dispatchEvent(new CustomEvent(MBoxWebEvent.READY))
    this.eventTarget?.dispatchEvent(
      new CustomEvent(MBoxWebEvent.PROGRESS, { detail: 10 })
    )

    let pendingText = ''
    let pendingOffset = 0

    const chunkSize = options?.chunkSize ?? this.blob.size
    const totalChunks = chunkSize ? Math.ceil(this.blob.size / chunkSize) : 1
    for (let index = 0; index < totalChunks; index += 1) {
      // wait for the main thread to process the text
      await yieldToMain()

      const start = index * chunkSize
      const end = Math.min(start + chunkSize, this.blob.size)
      const text = await this.toString(start, end)
      const textWithPending = pendingText + text
      if (
        options?.maxChunkSize &&
        textWithPending.length > options.maxChunkSize
      ) {
        throw new Error('Chunk size is too large')
      }

      const textArray = textWithPending
        .split(/^From /gm)
        .reduce<
          { offset: number; text: string }[]
        >((accumulator, v, vIndex) => {
          let currentOffset = pendingOffset
          let vSafe = v
          if (vIndex > 0) {
            const previousAccumulator = accumulator[vIndex - 1]!
            currentOffset =
              previousAccumulator.offset + previousAccumulator.text.length
            vSafe = `From ${v}`
          }
          accumulator.push({
            offset: currentOffset,
            text: vSafe,
          })
          return accumulator
        }, [])

      const pending = textArray.pop()
      pendingText = pending?.text ?? textWithPending
      pendingOffset = pending?.offset ?? pendingOffset
      // wait for the main thread to process the text
      await yieldToMain()

      const emailArray = await Promise.all(
        textArray.map(({ text: textItem }) => {
          return textItem ? parseToEmail(textItem) : undefined
        })
      )

      const emailArrayWithOffset = emailArray
        .map((email, emailIndex) =>
          email
            ? {
                date: email.date,
                from: email.from,
                messageId: email.messageId,
                offset: textArray[emailIndex]!.offset,
                offsetLength: textArray[emailIndex]!.text.length,
                subject: email.subject,
              }
            : undefined
        )
        .filter(Boolean)
      await this.post(emailArrayWithOffset as unknown as MBoxWebEmailType[])
      // wait for the main thread to process the text
      await yieldToMain()
      this.eventTarget?.dispatchEvent(
        new CustomEvent(MBoxWebEvent.PROGRESS, {
          detail: Math.floor(10 + (90 * index) / totalChunks),
        })
      )
    }

    await yieldToMain()
    const pendingEmail = await parseToEmail(pendingText)
    if (pendingEmail) {
      await this.post([
        {
          date: pendingEmail.date,
          from: pendingEmail.from,
          messageId: pendingEmail.messageId,
          offset: pendingOffset,
          offsetLength: pendingText.length,
          subject: pendingEmail.subject,
        },
      ] as unknown as MBoxWebEmailType[])
      this.eventTarget?.dispatchEvent(
        new CustomEvent(MBoxWebEvent.PROGRESS, {
          detail: 100,
        })
      )
    }

    return this
  }

  public async close() {
    if (!this.dbInstance) {
      return this
    }
    const localDatabaseInstance = this.dbInstance
    await new Promise<void>((resolve) => {
      localDatabaseInstance.close()
      localDatabaseInstance.addEventListener('close', () => {
        resolve()
      })
    })
    this.eventTarget?.dispatchEvent(new CustomEvent(MBoxWebEvent.CLOSED))
    this.blob = undefined
    this.dbInstance = undefined
    return this
  }

  public async count() {
    if (!this.dbInstance) {
      throw new Error('Database not opened')
    }
    const transaction = this.dbInstance.transaction(this.storeName, 'readonly')

    const countValue = await new Promise<number>((resolve, reject) => {
      const countRequest = transaction.objectStore(this.storeName).count()
      transaction.oncomplete = () => {
        resolve(countRequest.result)
      }
      transaction.onerror = () => {
        reject(new Error('Error counting records'))
      }
      transaction.addEventListener('abort', () => {
        reject(new Error('Transaction aborted'))
      })
    })

    return countValue
  }

  public async list(start: number, count: number) {
    if (!this.dbInstance) {
      throw new Error('Database not opened')
    }

    const transaction = this.dbInstance.transaction(this.storeName, 'readonly')
    const store = transaction.objectStore(this.storeName)
    const listData: MBoxWebEmailType[] = []

    let hasSkipped = false
    const listValue = await new Promise<MBoxWebEmailType[]>(
      (resolve, reject) => {
        const cursorRequest = store.openCursor()
        cursorRequest.onsuccess = () => {
          const cursor = cursorRequest.result
          if (!cursor) {
            resolve(listData)
            return
          }
          if (!hasSkipped && start > 0) {
            hasSkipped = true
            cursor.advance(start)
            return
          }
          listData.push(cursor.value as MBoxWebEmailType)
          if (listData.length < count) {
            cursor.continue()
          } else {
            resolve(listData)
          }
        }
        cursorRequest.onerror = () => {
          reject(new Error('Error reading emails from IndexedDB'))
        }
      }
    )
    return listValue
  }

  public async get(
    key: number | string
  ): Promise<MBoxWebEmailParsedType | undefined> {
    if (!this.dbInstance) {
      throw new Error('Database not opened')
    }

    const transaction = this.dbInstance.transaction(this.storeName, 'readonly')
    const result = await new Promise<MBoxWebEmailType>((resolve, reject) => {
      const request = transaction.objectStore(this.storeName).get(key)
      transaction.oncomplete = () => {
        resolve(request.result as MBoxWebEmailType)
      }
      transaction.onerror = () => {
        reject(new Error('Error storing emails in IndexedDB'))
      }
      transaction.addEventListener('abort', () => {
        reject(new Error('Transaction aborted'))
      })
    })

    const raw = await this.toString(
      result.offset,
      result.offset + result.offsetLength
    )
    const parsed: MBoxWebEmailParsedType | undefined = await parseToEmail(raw)
    if (parsed) {
      parsed.raw = raw
    }
    return parsed
  }

  private async post(data: MBoxWebEmailType[]) {
    if (!this.dbInstance) {
      throw new Error('Database not opened')
    }

    const transaction = this.dbInstance.transaction(this.storeName, 'readwrite')
    await new Promise<void>((resolve, reject) => {
      for (const datum of data) {
        transaction.objectStore(this.storeName).add(datum)
      }
      transaction.oncomplete = () => {
        resolve()
      }
      transaction.onerror = () => {
        reject(new Error('Error storing emails in IndexedDB'))
      }
      transaction.addEventListener('abort', () => {
        reject(new Error('Transaction aborted'))
      })
    })

    return
  }

  public async clear() {
    if (!this.dbInstance) {
      throw new Error('Database not opened')
    }

    const transaction = this.dbInstance.transaction(this.storeName, 'readwrite')
    await new Promise<void>((resolve, reject) => {
      transaction.objectStore(this.storeName).clear()
      transaction.oncomplete = () => {
        resolve()
      }
      transaction.onerror = () => {
        reject(new Error('Error clearing emails from IndexedDB'))
      }
      transaction.addEventListener('abort', () => {
        reject(new Error('Transaction aborted'))
      })
    })

    this.eventTarget?.dispatchEvent(new CustomEvent(MBoxWebEvent.CLEAR))

    return this
  }
}
