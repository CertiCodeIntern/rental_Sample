import { useEffect, useRef, useCallback, useState } from 'react'

/**
 * Hook to apply stagger entrance animation to container children
 * Assigns --index CSS variable to each child for CSS-based stagger delays
 */
export function useStaggerEntrance(selector = ':scope > .stagger-child') {
  const ref = useRef(null)
  
  useEffect(() => {
    if (!ref.current) return
    
    const children = ref.current.querySelectorAll(selector)
    children.forEach((child, index) => {
      child.style.setProperty('--index', index)
    })
  }, [selector])
  
  return ref
}

/**
 * Hook to handle async loading with skeleton states
 * Returns loading/error state and a wrapper function for fetch promises
 */
export function useLoadWithLoader(options = {}) {
  const { minVisible = 150, fallback = 30000 } = options
  const [state, setState] = useState({ loading: false, error: null, loaded: false })
  
  const loadWithLoader = useCallback(async (fetchPromise) => {
    setState({ loading: true, error: null, loaded: false })
    const start = Date.now()
    
    const fallbackTimer = setTimeout(() => {
      setState(prev => ({ ...prev, loading: false, error: 'Request timed out' }))
    }, fallback)
    
    try {
      const result = await fetchPromise
      const elapsed = Date.now() - start
      const wait = Math.max(0, minVisible - elapsed)
      
      await new Promise(resolve => setTimeout(resolve, wait))
      
      clearTimeout(fallbackTimer)
      setState({ loading: false, error: null, loaded: true })
      return result
    } catch (err) {
      clearTimeout(fallbackTimer)
      setState({ loading: false, error: err.message || 'Failed to load', loaded: false })
      throw err
    }
  }, [minVisible, fallback])
  
  return { ...state, loadWithLoader }
}

/**
 * Simple fade-in animation hook for individual elements
 */
export function useFadeIn(delay = 0) {
  const ref = useRef(null)
  
  useEffect(() => {
    if (!ref.current) return
    
    ref.current.style.opacity = '0'
    ref.current.style.transform = 'translateY(12px)'
    
    const timer = setTimeout(() => {
      if (ref.current) {
        ref.current.style.transition = 'opacity 400ms cubic-bezier(.2,.8,.2,1), transform 400ms cubic-bezier(.2,.8,.2,1)'
        ref.current.style.opacity = '1'
        ref.current.style.transform = 'none'
      }
    }, delay)
    
    return () => clearTimeout(timer)
  }, [delay])
  
  return ref
}
