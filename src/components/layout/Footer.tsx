import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerLogos}>
            <div className={styles.footerLogo}>
              <span className={styles.logoPlaceholder}>Neumann János Egyetem</span>
              <span className={styles.logoSub}>Kertészeti és Vidékfejlesztési Kar</span>
            </div>
            <div className={styles.footerLogo}>
              <span className={styles.logoPlaceholder}>Agroskill Kft.</span>
              <span className={styles.logoSub}>Szentkirály</span>
            </div>
          </div>
          <div className={styles.footerCredits}>
            <p><strong>Kutatás:</strong> Dobecz Andor (Kertészmérnök BSc)</p>
            <p><strong>Konzulens:</strong> Dr. Hüvely Attila (Egyetemi docens)</p>
            <p className={styles.footerYear}>2025</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
