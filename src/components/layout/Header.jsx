import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>Rusticor</span>
      <span className={styles.tagline}>Armador de combos</span>
    </header>
  )
}
