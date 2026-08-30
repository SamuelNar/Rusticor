import { useMemo } from 'react'
import { useCombo } from '../../context/ComboContext.jsx'
import { usePresets } from '../../context/PresetsContext.jsx'
import ComboItemRow from './ComboItemRow.jsx'
import CopySummaryButton from './CopySummaryButton.jsx'
import DiscountControl from './DiscountControl.jsx'
import styles from './ComboBuilder.module.css'
import PriceSummary from './PriceSummary.jsx'
import SavePresetForm from './SavePresetForm.jsx'

export default function ComboBuilder() {
  const { items, groups, discountPct, totals, removeItem, swapItem, setDiscountPct, removeGroup, clear } =
    useCombo()
  const { savePreset } = usePresets()

  const { looseItems, groupSections } = useMemo(() => {
    const loose = items.filter((item) => !item.groupId)
    const sections = Object.entries(groups)
      .map(([groupId, meta]) => ({
        groupId,
        meta,
        items: items.filter((item) => item.groupId === groupId),
      }))
      .filter((section) => section.items.length > 0)
    return { looseItems: loose, groupSections: sections }
  }, [items, groups])

  return (
    <aside className={styles.builder}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Combo</h2>
        {items.length > 0 && (
          <button type="button" className={styles.clearButton} onClick={clear}>
            Vaciar
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>Agregá productos del catálogo o aplicá un combo guardado.</p>
      ) : (
        <>
          {groupSections.map((section) => (
            <div key={section.groupId} className={styles.group}>
              <div className={styles.groupHeader}>
                <span className={styles.groupName}>
                  {section.meta.name} · {section.meta.discountPct}% off
                </span>
                <button
                  type="button"
                  className={styles.groupRemove}
                  onClick={() => removeGroup(section.groupId)}
                >
                  Quitar combo
                </button>
              </div>
              <ul className={styles.list}>
                {section.items.map((item) => (
                  <ComboItemRow key={item.id} item={item} onSwap={swapItem} onRemove={removeItem} />
                ))}
              </ul>
            </div>
          ))}

          {looseItems.length > 0 && (
            <div className={styles.group}>
              {groupSections.length > 0 && <span className={styles.groupName}>Otros productos</span>}
              <ul className={styles.list}>
                {looseItems.map((item) => (
                  <ComboItemRow key={item.id} item={item} onSwap={swapItem} onRemove={removeItem} />
                ))}
              </ul>
            </div>
          )}

          <DiscountControl value={discountPct} onChange={setDiscountPct} />
          <PriceSummary totals={totals} />
          <SavePresetForm items={items} discountPct={discountPct} onSave={savePreset} />
          <div className={styles.footer}>
            <CopySummaryButton items={items} groups={groups} totals={totals} />
          </div>
        </>
      )}
    </aside>
  )
}
