import { formatARS } from './price.js'

export function buildComboSummaryText({ items, groups, totals }) {
  const lines = ['*Combo Rusticor*', '']
  const groupIds = Object.keys(groups)

  for (const groupId of groupIds) {
    const meta = groups[groupId]
    const groupItems = items.filter((item) => item.groupId === groupId)
    if (groupItems.length === 0) continue
    lines.push(`*${meta.name}* (${meta.discountPct}% off)`)
    for (const { product } of groupItems) {
      lines.push(`- ${product.name}: ${formatARS(product.listPrice)}`)
    }
    lines.push('')
  }

  const looseItems = items.filter((item) => !item.groupId)
  if (looseItems.length > 0) {
    if (groupIds.length > 0) lines.push('*Otros productos*')
    for (const { product } of looseItems) {
      lines.push(`- ${product.name}: ${formatARS(product.listPrice)}`)
    }
    lines.push('')
  }

  lines.push(`Subtotal lista: ${formatARS(totals.totalList)}`)
  if (totals.totalListWithDiscount !== totals.totalList) {
    lines.push(`Total con descuentos: ${formatARS(totals.totalListWithDiscount)}`)
  }
  lines.push(`Precio contado: ${formatARS(totals.totalCash)}`)
  if (totals.savings > 0) {
    lines.push(`Ahorrás: ${formatARS(totals.savings)}`)
  }

  return lines.join('\n')
}
