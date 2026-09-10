import { useState, useEffect } from 'react'
import { getAlunos, getPlanos } from '../api'
import styles from '../styles/usuario.module.css'

export default function UsuarioLogin({ onConcluir, onVoltar }) {
  const [cpf, setCpf] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [alunoEncontrado, setAlunoEncontrado] = useState(null)
  const [planoInfo, setPlanoInfo] = useState(null)

  async function buscar(e) {
    e.preventDefault()
    setErro('')
    setAlunoEncontrado(null)

    const numeros = cpf.replace(/[^0-9]/g, '')
    if (numeros.length !== 11) {
      setErro('CPF deve ter 11 digitos')
      return
    }

    setLoading(true)
    try {
      const [alunos, planos] = await Promise.all([getAlunos(), getPlanos()])

      let encontrado = null
      for (let i = 0; i < alunos.length; i++) {
        const cpfAluno = alunos[i].cpf.replace(/[^0-9]/g, '')
        if (cpfAluno === numeros) {
          encontrado = alunos[i]
          break
        }
      }

      if (encontrado === null) {
        setErro('Nenhum aluno encontrado com esse CPF')
        setLoading(false)
        return
      }

      let infoPlano = null
      for (let i = 0; i < planos.length; i++) {
        if (planos[i].id === encontrado.plano) {
          infoPlano = planos[i]
          break
        }
      }

      setAlunoEncontrado(encontrado)
      setPlanoInfo(infoPlano)
    } catch (e) {
      setErro('Erro ao buscar. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div className={styles.tela}>
      <div className={styles.card}>
        <h2 className={styles.titulo}>Ja tenho cadastro</h2>
        <p className={styles.subtitulo}>Informe seu CPF para acessar a catraca</p>

        <form onSubmit={buscar}>
          <div className={styles.campo}>
            <label>CPF</label>
            <input
              value={cpf}
              onChange={e => { setCpf(e.target.value); setErro(''); setAlunoEncontrado(null) }}
              placeholder="000.000.000-00"
            />
            {erro && <span className={styles.erroCampo}>{erro}</span>}
          </div>

          <div className={styles.botoes}>
            <button type="button" className={styles.btnSecundario} onClick={onVoltar}>Voltar</button>
            <button type="submit" className={styles.btnPrincipal} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </form>

        {alunoEncontrado && (
          <div style={{ marginTop: 24, padding: '16px', background: '#f0faf4', borderRadius: 6, border: '1px solid #b7e4c7' }}>
            <p style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>Aluno encontrado</p>
            <p style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{alunoEncontrado.nome}</p>
            <p style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
              Plano {planoInfo ? planoInfo.nome : alunoEncontrado.plano}
            </p>
            <button
              className={styles.btnPrincipal}
              style={{ marginTop: 14, width: '100%' }}
              onClick={() => onConcluir(alunoEncontrado, planoInfo)}
            >
              Entrar na catraca
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
