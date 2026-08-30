import { getCategoryLabel } from '../../data/categories.js'
import { formatARS, getCashPrice } from '../../utils/price.js'
import ProductImage from '../shared/ProductImage.jsx'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, onAdd }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <ProductImage product={product} />
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{getCategoryLabel(product.category)}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.prices}>
          <span className={styles.listPrice}>{formatARS(product.listPrice)}</span>
          <span className={styles.cashPrice}>Contado {formatARS(getCashPrice(product))}</span>
        </div>
        <button type="button" className={styles.addButton} onClick={() => onAdd(product.id)}>
          Agregar al combo
        </button>
      </div>
    </article>
  )
}
