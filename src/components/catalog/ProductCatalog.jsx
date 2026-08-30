import { useMemo, useState } from 'react'
import { useCombo } from '../../context/ComboContext.jsx'
import { useProducts } from '../../data/useProducts.js'
import CategoryFilter from './CategoryFilter.jsx'
import ProductCard from './ProductCard.jsx'
import styles from './ProductCatalog.module.css'

export default function ProductCatalog() {
  const { products, loading } = useProducts()
  const { addProduct } = useCombo()
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    if (category === 'all') return products
    return products.filter((product) => product.category === category)
  }, [products, category])

  return (
    <section className={styles.catalog}>
      <h2 className={styles.title}>Catálogo</h2>
      <CategoryFilter value={category} onChange={setCategory} />
      {loading ? (
        <p className={styles.status}>Cargando catálogo…</p>
      ) : filtered.length === 0 ? (
        <p className={styles.status}>No hay productos en esta categoría.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addProduct} />
          ))}
        </div>
      )}
    </section>
  )
}
