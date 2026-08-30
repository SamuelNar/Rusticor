export const CATEGORIES = [
  { id: 'colchon', label: 'Colchones' },
  { id: 'soporte', label: 'Soportes y sommiers' },
  { id: 'almohada', label: 'Almohadas' },
  { id: 'sabanas', label: 'Sábanas y protectores' },
]

export function getCategoryLabel(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId)?.label ?? categoryId
}
