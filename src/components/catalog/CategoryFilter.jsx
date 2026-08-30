import { CATEGORIES } from '../../data/categories.js'
import styles from './CategoryFilter.module.css'

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className={styles.filter}>
      <button
        type="button"
        className={value === 'all' ? styles.chipActive : styles.chip}
        onClick={() => onChange('all')}
      >
        Todos
      </button>
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          className={value === category.id ? styles.chipActive : styles.chip}
          onClick={() => onChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
