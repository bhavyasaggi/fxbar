declare global {
  // eslint-disable-next-line no-var
  var scheduler:
    | {
        yield?: () => Promise<void>
      }
    | undefined
}

export async function yieldToMain() {
  await globalThis.scheduler?.yield?.()
}
