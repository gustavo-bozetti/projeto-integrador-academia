import { useState, useEffect } from 'react'
import { getAlunos, registrarAcesso, acessosHoje } from '../api'
import styles from '../styles/catraca.module.css'

function formataData(dt) {
  if (!dt) return '-'
  const d = new Date(dt)
  return d.toLocaleString('pt-BR')
}

export default function Catraca() {
  const [alunos, setAlunos] = useState([])
  const [alunoSelecionado, setAlunoSelecionado] = useState('')
  const [resultado, setResultado] = useState(null)
  const [acessos, setAcessos] = useState([])

  useEffect(() => {
    getAlunos().then(lista => {
      setAlunos(lista)
      if (lista.length > 0) {
        setAlunoSelecionado(String(lista[0].id))
      }
    })
    buscarAcessosHoje()
  }, [])

  async function buscarAcessosHoje() {
    const res = await acessosHoje()
    setAcessos(res)
  }

  async function registrar() {
    if (!alunoSelecionado) return
    const res = await registrarAcesso(Number(alunoSelecionado))
    setResultado(res)
    buscarAcessosHoje()
  }

  return (
    <div className={styles.container}>
      <div className={styles.painelEsquerdo}>
        <h2 className={styles.titulo}>Registrar Entrada</h2>

        <div className={styles.campo}>
          <label>Aluno</label>
          <select value={alunoSelecionado} onChange={e => setAlunoSelecionado(e.target.value)}>
            {alunos.map(a => (
              <option key={a.id} value={String(a.id)}>{a.nome}</option>
            ))}
          </select>
        </div>

        <button className={styles.btnRegistrar} onClick={registrar}>
          Registrar Entrada
        </button>

        {resultado && (
          <div className={resultado.autorizado ? styles.resultadoOk : styles.resultadoNeg}>
            <div className={styles.resultadoLabel}>
              {resultado.autorizado ? 'ACESSO LIBERADO' : 'ACESSO NEGADO'}
            </div>
            {resultado.autorizado && resultado.aluno && (
              <div>
                <div className={styles.resultadoNome}>{resultado.aluno.nome}</div>
                <div className={styles.resultadoPlano}>{resultado.aluno.plano}</div>
              </div>
            )}
            {!resultado.autorizado && (
              <div>{resultado.mensagem}</div>
            )}
          </div>
        )}
      </div>

      <div className={styles.painelDireito}>
        <h2 className={styles.titulo}>Acessos de Hoje</h2>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Aluno ID</th>
              <th>Data/Hora</th>
              <th>Status</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {acessos.map((a, i) => (
              <tr key={i}>
                <td>{a.alunoId}</td>
                <td>{formataData(a.dataHoraAcesso)}</td>
                <td className={a.autorizado ? styles.statusOk : styles.statusNeg}>
                  {a.autorizado ? 'Liberado' : 'Negado'}
                </td>
                <td>{a.motivoNegacao || '-'}</td>
              </tr>
            ))}
            {acessos.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.vazio}>Nenhum acesso hoje.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
