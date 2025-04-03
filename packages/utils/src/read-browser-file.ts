export async function readBrowserFile(
  file: File,
  options?: {
    offset?: number
    offsetLength?: number
    signal?: AbortSignal
  }
) {
  const { offset, offsetLength, signal } = options || {}

  if (!file) {
    throw new Error('File not opened')
  }
  if (file.size === 0) {
    throw new Error('File is empty')
  }
  if (!file.arrayBuffer) {
    throw new Error('File is not supported')
  }

  const start = offset || 0
  const end = Math.min(file.size, (offset || 0) + (offsetLength || 0))
  signal?.throwIfAborted()

  const fileReader = new FileReader()
  if (signal) {
    signal.addEventListener('abort', () => {
      fileReader.abort()
    })
  }

  const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.addEventListener('load', () => {
      resolve(fileReader.result as ArrayBuffer)
    })
    fileReader.addEventListener('error', () => {
      reject(new Error('File error'))
    })
    fileReader.addEventListener('abort', () => {
      reject(new Error('File aborted'))
    })
    // eslint-disable-next-line unicorn/prefer-blob-reading-methods
    fileReader.readAsArrayBuffer(file.slice(start, end))
  })

  return arrayBuffer
}
