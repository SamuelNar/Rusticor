import { useRef, useState } from 'react'
import { buildComboSummaryText } from '../../utils/whatsappSummary.js'
import styles from './CopySummaryButton.module.css'

function legacyCopy(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  return ok
}

export default function CopySummaryButton({ items, groups, totals }) {
  const [copied, setCopied] = useState(false)
  const [fallbackText, setFallbackText] = useState(null)
  const fallbackRef = useRef(null)

  async function handleCopy() {
    const text = buildComboSummaryText({ items, groups, totals })

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text)
        showCopied()
        return
      } catch {
        // sigue al fallback
      }
    }

    if (legacyCopy(text)) {
      showCopied()
      return
    }

    // No se pudo copiar automáticamente: mostrar el texto para copiarlo a mano.
    setFallbackText(text)
    requestAnimationFrame(() => fallbackRef.current?.select())
  }

  function showCopied() {
    setFallbackText(null)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.copyButton} onClick={handleCopy} disabled={items.length === 0}>
        {copied ? '¡Copiado!' : 'Copiar resumen para WhatsApp'}
      </button>
      {fallbackText && (
        <textarea
          ref={fallbackRef}
          className={styles.fallback}
          readOnly
          value={fallbackText}
          onFocus={(event) => event.target.select()}
        />
      )}
    </div>
  )
}
