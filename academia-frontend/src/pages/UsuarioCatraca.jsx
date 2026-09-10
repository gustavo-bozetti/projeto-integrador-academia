import { useState, useEffect } from 'react'
import { registrarAcesso } from '../api'
import styles from '../styles/usuario.module.css'

export default function UsuarioCatraca({ aluno, plano, onInicio }) {
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    entrar()
  }, [])

  async function entrar() {
    setLoading(true)
    setResultado(null)
    try {
      const res = await registrarAcesso(aluno.id)
      setResultado(res)
    } catch (e) {
      setResultado({ autorizado: false, mensagem: 'Erro ao conectar com a catraca' })
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className={styles.catracaTela}>
        <div className={styles.catracaCard}>
          <div className={styles.catracaResultado} style={{ textAlign: 'center', padding: 60 }}>
            <p style={{ color: '#888', fontSize: 15 }}>Verificando acesso...</p>
          </div>
        </div>
      </div>
    )
  }

  const ok = resultado && resultado.autorizado

  return (
    <div className={styles.catracaTela}>
      <div className={styles.catracaCard}>
        <div className={styles.passos} style={{ padding: '24px 36px 0' }}>
          <div className={styles.passoConcluido}>1</div>
          <div className={styles.passoLinhaAtiva + ' ' + styles.passoLinha}></div>
          <div className={styles.passoConcluido}>2</div>
          <div className={styles.passoLinhaAtiva + ' ' + styles.passoLinha}></div>
          <div className={ok ? styles.passoConcluido : styles.passoAtivo}>3</div>
        </div>

        <div className={ok ? styles.catracaResultado + ' ' + styles.catracaResultadoOk : styles.catracaResultado + ' ' + styles.catracaResultadoNeg}>
          <div className={ok ? styles.catracaLabel + ' ' + styles.catracaLabelOk : styles.catracaLabel + ' ' + styles.catracaLabelNeg}>
            {ok ? 'Acesso liberado' : 'Acesso negado'}
          </div>

          {ok && (
            <div>
              <div className={styles.catracaNome}>{aluno.nome}</div>
              <div className={styles.catracaInfo}>Plano {plano.nome}</div>
            </div>
          )}

          {!ok && (
            <div>
              <div className={styles.catracaNome} style={{ fontSize: 18 }}>Nao foi possivel liberar</div>
              <div className={styles.catracaMotivo}>{resultado ? resultado.mensagem : ''}</div>
            </div>
          )}
        </div>

        <div className={styles.catracaRodape}>
          {!ok && (
            <button className={styles.btnTentar} onClick={entrar}>Tentar novamente</button>
          )}
          <button className={styles.btnInicio} onClick={onInicio}>Voltar ao inicio</button>
        </div>
      </div>
    </div>
  )
}
