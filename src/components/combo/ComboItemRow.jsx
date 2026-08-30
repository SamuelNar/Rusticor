import { useState } from 'react'
import { getCategoryLabel } from '../../data/categories.js'
import { formatARS, getCashPrice } from '../../utils/price.js'
import ProductImage from '../shared/ProductImage.jsx'
import ProductPicker from './ProductPicker.jsx'
import styles from './ComboItemRow.module.css'

export default function ComboItemRow({ item, onSwap, onRemove }) {
  const [swapping, setSwapping] = useState(false)
  const { product } = item

  return (
    <li className={styles.row}>
      <div className={styles.imageWrap}>
        <ProductImage product={product} />
      </div>
      <div className={styles.info}>
        <span className={styles.category}>{getCategoryLabel(product.category)}</span>
        <span className={styles.name}>{product.name}</span>
        <span className={styles.price}>
          {formatARS(product.listPrice)} · Contado {formatARS(getCashPrice(product))}
        </span>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.swapButton} onClick={() => setSwapping(true)}>
          Cambiar
        </button>
        <button
          type="button"
          className={styles.removeButton}
          onClick={() => onRemove(item.id)}
          aria-label={`Quitar ${product.name} del combo`}
        >
          ×
        </button>
      </div>
      {swapping && (
        <ProductPicker
          initialCategory={product.category}
          excludeProductId={product.id}
          onSelect={(productId) => {
            onSwap(item.id, productId)
            setSwapping(false)
          }}
          onClose={() => setSwapping(false)}
        />
      )}
    </li>
  )
}
