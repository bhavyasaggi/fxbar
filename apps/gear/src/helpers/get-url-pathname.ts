export const getUrlPathname = (url: URL | string | undefined) => {
  try {
    return new URL(url || '', 'http://localhost').pathname.replace(/\/$/, '')
  } catch {
    //
  }
  return String(url || '').replace(/\/$/, '')
}
