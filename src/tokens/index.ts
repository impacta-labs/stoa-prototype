export const colors = {
  bg: '#0C0C0E',
  surface1: '#111115',
  surface2: '#18181E',
  surface3: '#1E1E26',
  rule: '#2A2A30',
  ink: '#F2EDE6',
  ink2: '#9A9490',
  ink3: '#4A4744',
  gold: '#C4952A',
  goldMuted: '#8A6A1E',
  amber: '#B5621A',
  resolve: '#4A7A5A',
  critical: '#8A2A2A',
  border: 'rgba(255, 255, 255, 0.10)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',
} as const

export const fonts = {
  serif: '"Playfair Display", Georgia, "Times New Roman", serif',
  sans: '"IBM Plex Sans", system-ui, -apple-system, sans-serif',
  mono: '"IBM Plex Mono", "Courier New", monospace',
} as const

export const typeScale = [11, 13, 15, 17, 20, 24, 32, 42, 56] as const

export const duration = {
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  archive: 0.4,
} as const
