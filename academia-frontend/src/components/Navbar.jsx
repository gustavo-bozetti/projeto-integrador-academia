import styles from '../styles/navbar.module.css'

export default function Navbar({ page, setPage, onSair }) {
  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>Academia</span>
      <button
        className={page === 'alunos' ? styles.ativo + ' ' + styles.linkBtn : styles.linkBtn}
        onClick={() => setPage('alunos')}
      >
        Alunos
      </button>
      <button
        className={page === 'catraca' ? styles.ativo + ' ' + styles.linkBtn : styles.linkBtn}
        onClick={() => setPage('catraca')}
      >
        Catraca
      </button>
      <button
        className={page === 'frequencia' ? styles.ativo + ' ' + styles.linkBtn : styles.linkBtn}
        onClick={() => setPage('frequencia')}
      >
        Frequencia
      </button>
      <button className={styles.btnSair} onClick={onSair}>Sair</button>
    </nav>
  )
}
