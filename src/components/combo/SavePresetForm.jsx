import { useState } from 'react'
import styles from './SavePresetForm.module.css'

export default function SavePresetForm({ items, discountPct, onSave }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [presetDiscount, setPresetDiscount] = useState(discountPct)

  if (items.length === 0) return null

  function handleOpen() {
    setPresetDiscount(discountPct)
    setOpen(true)
  }

  function handleDiscountChange(event) {
    const next = Number(event.target.value)
    setPresetDiscount(Number.isFinite(next) ? Math.min(100, Math.max(0, next)) : 0)
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      items: items.map((item) => item.productId),
      discountPct: presetDiscount,
    })
    setName('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button type="button" className={styles.openButton} onClick={handleOpen}>
        Guardar como combo preestablecido
      </button>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.nameInput}
        placeholder="Nombre (ej. Queen + Soporte común)"
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoFocus
      />
      <label className={styles.discountRow}>
        Descuento de este combo
        <div className={styles.discountInputWrap}>
          <input type="number" min="0" max="100" value={presetDiscount} onChange={handleDiscountChange} />
          <span>%</span>
        </div>
      </label>
      <div className={styles.actions}>
        <button type="submit" className={styles.saveButton} disabled={!name.trim()}>
          Guardar
        </button>
        <button type="button" className={styles.cancelButton} onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
