import type { Variants } from 'framer-motion'

export const settle: Variants = {
  hidden: { y: 4, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const compress: Variants = {
  hidden: { scaleY: 1.02, opacity: 0.6, transformOrigin: 'top' },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

export const archive: Variants = {
  visible: { opacity: 1, y: 0 },
  hidden: {
    opacity: 0.4,
    y: 2,
    transition: { duration: 0.4, ease: 'easeIn' },
  },
}

export const chamberEnter: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

export const deposit: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

export const depositItem: Variants = {
  hidden: { y: 4, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}
