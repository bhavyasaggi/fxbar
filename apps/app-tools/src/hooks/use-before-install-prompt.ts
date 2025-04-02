import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

export function useBeforeInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | undefined>()

  const promptCallback: BeforeInstallPromptEvent['prompt'] | undefined = prompt
    ? async () => {
        const result = await prompt.prompt()
        setPrompt(undefined)
        return result
      }
    : undefined

  useEffect(() => {
    const handleInstalled = () => {
      setPrompt(undefined)
    }
    const handlePrompt = ((event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      setPrompt(event)
    }) as EventListener
    globalThis.addEventListener('appinstalled', handleInstalled)
    globalThis.addEventListener('beforeinstallprompt', handlePrompt)
    return () => {
      globalThis.removeEventListener('beforeinstallprompt', handlePrompt)
      globalThis.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  return promptCallback
}
