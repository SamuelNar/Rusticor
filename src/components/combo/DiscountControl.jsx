import styles from './DiscountControl.module.css'

export default function DiscountControl({ value, onChange }) {
  function handleChange(event) {
    const next = Number(event.target.value)
    onChange(Number.isFinite(next) ? Math.min(100, Math.max(0, next)) : 0)
  }

  return (
    <label className={styles.control}>
      <span className={styles.label}>Descuento en productos sueltos</span>
      <div className={styles.inputWrap}>
        <input type="number" min="0" max="100" step="1" value={value} onChange={handleChange} />
        <span>%</span>
      </div>
    </label>
  )
}
