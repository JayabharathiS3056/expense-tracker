import { useEffect } from 'react'

/**
 * Attaches an IntersectionObserver to all `.reveal` elements.
 * When they enter the viewport, adds the `.visible` class.
 * Call this hook once in any page component.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)   // fire once only
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}
