export const blobToText = async (
  blob: Blob,
  options?: { start?: number; end?: number }
) => {
  const start = options?.start ?? 0
  const end = options?.end ?? blob.size
  const arrayBuffer = await blob.slice(start, end).arrayBuffer()
  return new TextDecoder().decode(new Uint8Array(arrayBuffer))
}
