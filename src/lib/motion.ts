import type { Variants } from 'framer-motion'

/* settle — finds its place; gravity, not emergence */
export const settle: Variants = {
  hidden: { y: 2, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
}

/* compress — arrives with weight from above */
export const compress: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

/* archive — recedes into record */
export const archive: Variants = {
  visible: { opacity: 1 },
  hidden: {
    opacity: 0.35,
    transition: { duration: 0.4, ease: 'easeIn' },
  },
}

/* chamberEnter — crossing a membrane; deliberate */
export const chamberEnter: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

/* deposit — information accumulates; sediment, not reveal */
export const deposit: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
}

/* depositItem — appears as if it was always there */
export const depositItem: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}
