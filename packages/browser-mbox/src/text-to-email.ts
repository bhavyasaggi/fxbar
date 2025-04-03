import PostalMime, { type Email } from 'postal-mime'

export async function textToEmail(
  text: string,
  options?: {
    start?: number
    end?: number
    offset?: number
  }
) {
  if (!text) {
    return
  }
  const start = options?.start ?? 0
  const end = options?.end ?? text.length
  const emailText = text.slice(start, end)
  const email: Email & {
    raw?: string
    offset?: number
    offsetLength?: number
  } = await PostalMime.parse(emailText)
  if (!email || Object.keys(email).length === 0) {
    return
  }
  email.raw = emailText
  email.offset = options?.offset ?? 0
  email.offsetLength = emailText.length
  return email
}
