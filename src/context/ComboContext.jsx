import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useProducts } from '../data/useProducts.js'
import { computeGroupTotals, sumGroupTotals } from '../utils/price.js'

const STORAGE_KEY = 'rusticor-combo'
const LOOSE_KEY = 'loose'

const ComboContext = createContext(null)

function emptyState() {
  return { items: [], groups: {}, discountPct: 0 }
}

function loadInitialState() {
  if (typeof window === 'undefined') return emptyState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    return {
      items: Array.isArray(parsed.items)
        ? parsed.items.map((item) => ({ groupId: null, ...item }))
        : [],
      groups: parsed.groups && typeof parsed.groups === 'object' ? parsed.groups : {},
      discountPct: Number(parsed.discountPct) || 0,
    }
  } catch {
    return emptyState()
  }
}

let itemIdCounter = 0
function nextItemId() {
  itemIdCounter += 1
  return `combo-item-${Date.now()}-${itemIdCounter}`
}

let groupIdCounter = 0
function nextGroupId() {
  groupIdCounter += 1
  return `combo-group-${Date.now()}-${groupIdCounter}`
}

function pruneGroups(items, groups) {
  const activeGroupIds = new Set(items.map((item) => item.groupId).filter(Boolean))
  const next = {}
  for (const [groupId, meta] of Object.entries(groups)) {
    if (activeGroupIds.has(groupId)) next[groupId] = meta
  }
  return next
}

function comboReducer(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      return {
        ...state,
        items: [...state.items, { id: nextItemId(), productId: action.productId, groupId: null }],
      }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((item) => item.id !== action.itemId)
      return { ...state, items, groups: pruneGroups(items, state.groups) }
    }
    case 'SWAP_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.itemId ? { ...item, productId: action.productId } : item,
        ),
      }
    case 'SET_DISCOUNT':
      return { ...state, discountPct: action.pct }
    case 'APPLY_PRESET': {
      const groupId = nextGroupId()
      const newItems = action.preset.items.map((entry) => ({
        id: nextItemId(),
        productId: entry.productId,
        groupId,
      }))
      return {
        ...state,
        items: [...state.items, ...newItems],
        groups: {
          ...state.groups,
          [groupId]: {
            name: action.preset.name,
            discountPct: action.preset.discountPct,
            presetId: action.preset.id,
          },
        },
      }
    }
    case 'REMOVE_GROUP': {
      const items = state.items.filter((item) => item.groupId !== action.groupId)
      const groups = { ...state.groups }
      delete groups[action.groupId]
      return { ...state, items, groups }
    }
    case 'CLEAR':
      return emptyState()
    default:
      return state
  }
}

export function ComboProvider({ children }) {
  const [state, dispatch] = useReducer(comboReducer, undefined, loadInitialState)
  const { products } = useProducts()

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const resolvedItems = useMemo(() => {
    return state.items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return product ? { ...item, product } : null
      })
      .filter(Boolean)
  }, [state.items, products])

  // Cada combo preestablecido aplicado mantiene su propio % de descuento;
  // los productos sueltos (sin grupo) usan el descuento manual del combo.
  const groupedTotals = useMemo(() => {
    const buckets = new Map()
    for (const item of resolvedItems) {
      const key = item.groupId ?? LOOSE_KEY
      if (!buckets.has(key)) buckets.set(key, [])
      buckets.get(key).push(item.product)
    }
    return [...buckets.entries()].map(([key, groupProducts]) => {
      const discountPct = key === LOOSE_KEY ? state.discountPct : (state.groups[key]?.discountPct ?? 0)
      return { key, discountPct, ...computeGroupTotals(groupProducts, discountPct) }
    })
  }, [resolvedItems, state.discountPct, state.groups])

  const totals = useMemo(() => sumGroupTotals(groupedTotals), [groupedTotals])

  const value = useMemo(
    () => ({
      items: resolvedItems,
      groups: state.groups,
      discountPct: state.discountPct,
      totals,
      addProduct: (productId) => dispatch({ type: 'ADD_PRODUCT', productId }),
      removeItem: (itemId) => dispatch({ type: 'REMOVE_ITEM', itemId }),
      swapItem: (itemId, productId) => dispatch({ type: 'SWAP_ITEM', itemId, productId }),
      setDiscountPct: (pct) => dispatch({ type: 'SET_DISCOUNT', pct }),
      applyPreset: (preset) => dispatch({ type: 'APPLY_PRESET', preset }),
      removeGroup: (groupId) => dispatch({ type: 'REMOVE_GROUP', groupId }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [resolvedItems, state.groups, state.discountPct, totals],
  )

  return <ComboContext.Provider value={value}>{children}</ComboContext.Provider>
}

export function useCombo() {
  const ctx = useContext(ComboContext)
  if (!ctx) throw new Error('useCombo must be used within a ComboProvider')
  return ctx
}
