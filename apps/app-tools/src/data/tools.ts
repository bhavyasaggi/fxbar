/* eslint-disable sort-keys */
import type { FeatherIconNames } from 'feather-icons'

export type ToolGroupType =
  | 'app'
  | 'seo'
  | 'multimedia'
  | 'cryptography'
  | 'code' // generate, preview, format, beautify, etc.
  | 'other'

export type ToolType = {
  /**
   * url of the tool
   */
  id: string
  label: string
  icon?: FeatherIconNames
  description?: string
  group?: ToolGroupType
  keywords?: string[]
}

export const tools: ToolType[] = (
  [
    {
      id: '/image-to-base64',
      label: 'Image to Base64',
      description: 'Convert images to base64',
      icon: 'file',
      group: 'multimedia',
    },
    {
      id: '/image-editor',
      label: 'Image Editor',
      description: 'Edit images',
      icon: 'file',
      group: 'multimedia',
    },
    {
      id: '/generate-favicon',
      label: 'Generate Favicon',
      description: 'Generate favicon',
      icon: 'file',
      group: 'multimedia',
    },
    {
      id: '/app-screenshot-generator',
      label: 'App Screenshot Generator',
      description: 'Generate screenshots of your app',
      icon: 'file',
      group: 'app',
    },
    {
      id: '/app-icon-generator',
      label: 'App Icon Generator',
      description: 'Generate app icons',
      icon: 'file',
      group: 'app',
    },
    {
      id: '/cryptography-keygen',
      label: 'Cryptography Keygen',
      description: 'Generate cryptography keys',
      icon: 'file',
      group: 'cryptography',
    },
    {
      id: '/cryptography-generate-hash', // md5, sha1, sha224, sha256, sha384, sha512
      label: 'Cryptography Generate Hash',
      description: 'Generate hash of a string',
      icon: 'file',
      group: 'cryptography',
    },
    {
      id: '/cryptography-encode-decode-jwt',
      label: 'Cryptography Encode/Decode JWT',
      description: 'Encode/Decode JWT',
      icon: 'file',
      group: 'cryptography',
    },
    {
      id: '/cryptography-checksum-calculator',
      label: 'Cryptography Checksum Calculator',
      description: 'Calculate checksum of a file',
      icon: 'file',
      group: 'cryptography',
    },
    {
      id: '/preview-markdown',
      label: 'Preview Markdown',
      description: 'Preview markdown',
      icon: 'file',
      group: 'code',
    },
    {
      id: '/code-editor',
      label: 'Live Code Editor',
      description: 'Live Javascript coding in Browser',
      icon: 'file',
      group: 'code',
    },
    {
      id: '/preview-mbox',
      label: 'Preview Mbox',
      description: 'Preview Mbox in Browser',
      icon: 'file',
      group: 'code',
    },
    {
      id: '/generate-bookmarklet',
      label: 'Generate Bookmarklet',
      description: 'Generate Bookmarklet',
      icon: 'file',
      group: 'code',
    },
    {
      id: '/generate-code-screenshot',
      label: 'Generate Code Screenshot',
      description: 'Generate Screenshot of a code segment',
      icon: 'file',
      group: 'code',
    },
    {
      id: '/generate-qr-code',
      label: 'Generate QR Code',
      description: 'Generate QR code of a string',
      icon: 'file',
      group: 'code',
    },
    {
      id: '/generator-barcode',
      label: 'Generate Barcode',
      description: 'Generate barcode of a string',
      icon: 'file',
      group: 'code',
    },
    {
      id: '/generate-crontab',
      label: 'Generate Crontab',
      description: 'Generate crontab',
      icon: 'file',
      group: 'code',
    },
    {
      id: '/generate-metatags',
      label: 'Generate Metatags',
      description: 'Generate metatags',
      icon: 'file',
      group: 'seo',
    },
    {
      id: '/generate-open-graph-tags',
      label: 'Generate Open Graph Tags',
      description: 'Generate open graph tags',
      icon: 'file',
      group: 'seo',
    },
    {
      id: '/reference-html-entities',
      label: 'HTML Entities',
      description: 'Reference HTML entities',
      icon: 'file',
      group: 'other',
    },
  ] as ToolType[]
).sort((a, b) => a.id.localeCompare(b.id))
