import styles from './ProductImage.module.css'

export default function ProductImage({ product, className }) {
  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        className={`${styles.image} ${className ?? ''}`}
      />
    )
  }

  return (
    <div className={`${styles.placeholder} ${className ?? ''}`} data-category={product.category}>
      <span>{product.name.charAt(0)}</span>
    </div>
  )
}
