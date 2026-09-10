import styles from '../styles/roleselect.module.css'

export default function RoleSelect({ onSelect }) {
  return (
    <div className={styles.tela}>
      <div className={styles.cabecalho}>
        <h1 className={styles.titulo}>Academia</h1>
        <p className={styles.subtitulo}>Bem-vindo. Como deseja continuar?</p>
      </div>

      <div className={styles.cards}>
        <div className={styles.card} onClick={() => onSelect('usuario')}>
          <span className={styles.cardIcone}>🏋️</span>
          <div className={styles.cardTitulo}>Sou Aluno</div>
          <p className={styles.cardDesc}>Escolha um plano, cadastre seus dados e passe pela catraca</p>
          <button className={styles.cardBotao}>Entrar como Aluno</button>
        </div>

        <div className={styles.card} onClick={() => onSelect('admin')}>
          <span className={styles.cardIcone}>🔧</span>
          <div className={styles.cardTitulo}>Administrador</div>
          <p className={styles.cardDesc}>Gerencie alunos, pagamentos e visualize a frequencia</p>
          <button className={styles.cardBotao}>Entrar como Admin</button>
        </div>
      </div>
    </div>
  )
}
