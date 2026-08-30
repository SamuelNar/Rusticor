import { useEffect, useState } from 'react'
import { getProducts } from './productsRepo.js'

export function useProducts() {
  const [state, setState] = useState({ products: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    getProducts()
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: null })
      })
      .catch((error) => {
        if (!cancelled) setState({ products: [], loading: false, error })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
