interface WordmarkProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 13, md: 15, lg: 22 }

export default function Wordmark({ size = 'md' }: WordmarkProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: sizes[size],
        fontWeight: 400,
        letterSpacing: '0.22em',
        color: 'var(--stoa-ink)',
        textTransform: 'uppercase' as const,
        userSelect: 'none',
      }}
    >
      Stoa
    </span>
  )
}
