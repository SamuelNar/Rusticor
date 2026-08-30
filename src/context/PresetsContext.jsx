import { createContext, useContext, useEffect, useReducer } from 'react'

const STORAGE_KEY = 'rusticor-presets'

const PresetsContext = createContext(null)

function loadInitialPresets() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

let presetIdCounter = 0
function nextPresetId() {
  presetIdCounter += 1
  return `preset-${Date.now()}-${presetIdCounter}`
}

function presetsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.preset]
    case 'REMOVE':
      return state.filter((preset) => preset.id !== action.id)
    default:
      return state
  }
}

export function PresetsProvider({ children }) {
  const [presets, dispatch] = useReducer(presetsReducer, undefined, loadInitialPresets)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  }, [presets])

  function savePreset({ name, items, discountPct }) {
    const preset = {
      id: nextPresetId(),
      name,
      discountPct,
      items: items.map((productId) => ({ productId })),
    }
    dispatch({ type: 'ADD', preset })
    return preset
  }

  function removePreset(id) {
    dispatch({ type: 'REMOVE', id })
  }

  const value = { presets, savePreset, removePreset }

  return <PresetsContext.Provider value={value}>{children}</PresetsContext.Provider>
}

export function usePresets() {
  const ctx = useContext(PresetsContext)
  if (!ctx) throw new Error('usePresets must be used within a PresetsProvider')
  return ctx
}
