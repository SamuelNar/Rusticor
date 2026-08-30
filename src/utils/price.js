export const DEFAULT_CASH_DISCOUNT_PCT = 10

export function getCashDiscountPct(product) {
  return product.cashDiscountPct ?? DEFAULT_CASH_DISCOUNT_PCT
}

export function getCashPrice(product) {
  const pct = getCashDiscountPct(product)
  return Math.round(product.listPrice * (1 - pct / 100))
}

// products: array de productos que comparten un mismo % de descuento
// (ej. todos los productos sueltos, o todos los de un mismo combo preestablecido).
// El descuento se aplica tanto sobre el total de lista como sobre el total
// contado (ya descontado por el % de contado de cada producto).
export function computeGroupTotals(products, discountPct) {
  const totalList = products.reduce((sum, product) => sum + product.listPrice, 0)
  const totalCashBeforeDiscount = products.reduce((sum, product) => sum + getCashPrice(product), 0)
  const factor = 1 - (discountPct || 0) / 100

  const totalListWithDiscount = Math.round(totalList * factor)
  const totalCash = Math.round(totalCashBeforeDiscount * factor)
  const savings = totalList - totalCash

  return { totalList, totalListWithDiscount, totalCash, savings }
}

// Suma los totales de varios grupos (ej. un combo preestablecido al 30% +
// productos sueltos sin descuento) en un único total agregado.
export function sumGroupTotals(groupTotalsList) {
  return groupTotalsList.reduce(
    (acc, group) => ({
      totalList: acc.totalList + group.totalList,
      totalListWithDiscount: acc.totalListWithDiscount + group.totalListWithDiscount,
      totalCash: acc.totalCash + group.totalCash,
      savings: acc.savings + group.savings,
    }),
    { totalList: 0, totalListWithDiscount: 0, totalCash: 0, savings: 0 },
  )
}

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export function formatARS(amount) {
  return currencyFormatter.format(amount)
}
