import { formatARS } from '../../utils/price.js'
import styles from './PriceSummary.module.css'

export default function PriceSummary({ totals }) {
  return (
    <dl className={styles.summary}>
      <div className={styles.row}>
        <dt>Subtotal lista</dt>
        <dd>{formatARS(totals.totalList)}</dd>
      </div>
      {totals.totalListWithDiscount !== totals.totalList && (
        <div className={styles.row}>
          <dt>Total con descuentos</dt>
          <dd>{formatARS(totals.totalListWithDiscount)}</dd>
        </div>
      )}
      <div className={styles.rowHighlight}>
        <dt>Precio contado</dt>
        <dd>{formatARS(totals.totalCash)}</dd>
      </div>
      {totals.savings > 0 && (
        <div className={styles.row}>
          <dt>Ahorrás</dt>
          <dd>{formatARS(totals.savings)}</dd>
        </div>
      )}
    </dl>
  )
}
