import { useCombo } from '../../context/ComboContext.jsx'
import { usePresets } from '../../context/PresetsContext.jsx'
import { useProducts } from '../../data/useProducts.js'
import styles from './PresetList.module.css'

export default function PresetList() {
  const { presets, removePreset } = usePresets()
  const { applyPreset } = useCombo()
  const { products } = useProducts()

  if (presets.length === 0) return null

  function getProductName(productId) {
    return products.find((product) => product.id === productId)?.name ?? productId
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Combos guardados</h2>
      <div className={styles.list}>
        {presets.map((preset) => (
          <article key={preset.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.name}>{preset.name}</span>
              <span className={styles.discount}>{preset.discountPct}% off</span>
            </div>
            <p className={styles.items}>
              {preset.items.map((item) => getProductName(item.productId)).join(' + ')}
            </p>
            <div className={styles.actions}>
              <button type="button" className={styles.applyButton} onClick={() => applyPreset(preset)}>
                Aplicar
              </button>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => removePreset(preset.id)}
                aria-label={`Eliminar combo ${preset.name}`}
              >
                ×
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
