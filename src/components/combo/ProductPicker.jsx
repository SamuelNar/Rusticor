import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, getCategoryLabel } from '../../data/categories.js'
import { useProducts } from '../../data/useProducts.js'
import { formatARS, getCashPrice } from '../../utils/price.js'
import ProductImage from '../shared/ProductImage.jsx'
import styles from './ProductPicker.module.css'

export default function ProductPicker({ initialCategory = 'all', excludeProductId, onSelect, onClose }) {
  const { products } = useProducts()
  const [category, setCategory] = useState(initialCategory)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const filtered = useMemo(() => {
    return products.filter(
      (product) =>
        (category === 'all' || product.category === category) && product.id !== excludeProductId,
    )
  }, [products, category, excludeProductId])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <header className={styles.header}>
          <h2>Elegir producto</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>
        <div className={styles.tabs}>
          <button
            type="button"
            className={category === 'all' ? styles.tabActive : styles.tab}
            onClick={() => setCategory('all')}
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={category === cat.id ? styles.tabActive : styles.tab}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <ul className={styles.list}>
          {filtered.map((product) => (
            <li key={product.id}>
              <button type="button" className={styles.item} onClick={() => onSelect(product.id)}>
                <span className={styles.itemImage}>
                  <ProductImage product={product} />
                </span>
                <span className={styles.itemInfo}>
                  <span className={styles.itemName}>{product.name}</span>
                  <span className={styles.itemMeta}>
                    {getCategoryLabel(product.category)} · {formatARS(product.listPrice)} · Contado{' '}
                    {formatARS(getCashPrice(product))}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className={styles.empty}>No hay productos en esta categoría.</li>}
        </ul>
      </div>
    </div>
  )
}
