import { useState, useEffect } from 'react'
import { getPlanos } from '../api'
import styles from '../styles/planos.module.css'

export default function PlanoSelect({ onContinuar, onVoltar, onJaTenhoPlano }) {
  const [planos, setPlanos] = useState([])
  const [selecionado, setSelecionado] = useState(null)

  useEffect(() => {
    getPlanos().then(lista => {
      setPlanos(lista)
    })
  }, [])

  function descricaoLimite(limite) {
    if (limite >= 999) return 'Acesso ilimitado por dia'
    return 'Ate ' + limite + ' entradas por dia'
  }

  return (
    <div className={styles.tela}>
      <button className={styles.btnVoltar} onClick={onVoltar}>Voltar</button>

      <div className={styles.topo}>
        <h2 className={styles.titulo}>Escolha seu plano</h2>
        <p className={styles.subtitulo}>Selecione o plano que melhor combina com sua rotina</p>
      </div>

      <div className={styles.cards}>
        {planos.map(p => {
          const ativo = selecionado && selecionado.id === p.id
          return (
            <div
              key={p.id}
              className={ativo ? styles.card + ' ' + styles.cardAtivo : styles.card}
              onClick={() => setSelecionado(p)}
            >
              <span className={ativo ? styles.planoBadge + ' ' + styles.planoBadgeAtivo : styles.planoBadge}>
                {p.id}
              </span>
              <div className={styles.preco}>
                R$ {p.valor}
                <span className={styles.precoSufixo}>/mes</span>
              </div>
              <div className={styles.nome}>{p.nome}</div>
              <div className={styles.limite}>{descricaoLimite(p.limiteFrequenciaDiaria)}</div>
              <button className={ativo ? styles.btnSelecionar + ' ' + styles.btnSelecionarAtivo : styles.btnSelecionar}>
                {ativo ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>
          )
        })}
      </div>

      <div className={styles.rodape}>
        <button
          className={styles.btnContinuar}
          disabled={selecionado === null}
          onClick={() => onContinuar(selecionado)}
        >
          Continuar
        </button>
        <p style={{ marginTop: 20, color: '#888', fontSize: 14 }}>
          Ja e aluno?{' '}
          <button onClick={onJaTenhoPlano} style={{ background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: 14, textDecoration: 'underline', padding: 0 }}>
            Acessar com meu CPF
          </button>
        </p>
      </div>
    </div>
  )
}
