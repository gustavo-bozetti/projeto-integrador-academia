import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getAlunos, acessosPorAluno } from '../api'
import styles from '../styles/frequencia.module.css'

function formataData(dt) {
  if (!dt) return '-'
  return new Date(dt).toLocaleString('pt-BR')
}

function dataHoje() {
  return new Date().toISOString().slice(0, 10)
}

function data30DiasAtras() {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().slice(0, 10)
}

export default function Frequencia() {
  const [alunos, setAlunos] = useState([])
  const [acessos, setAcessos] = useState([])
  const [alunoId, setAlunoId] = useState('')
  const [dataInicio, setDataInicio] = useState(data30DiasAtras())
  const [dataFim, setDataFim] = useState(dataHoje())
  const [loading, setLoading] = useState(false)
  const [buscou, setBuscou] = useState(false)

  useEffect(() => {
    getAlunos().then(lista => {
      setAlunos(lista)
      if (lista.length > 0) setAlunoId(String(lista[0].id))
    })
  }, [])

  async function buscar() {
    if (!alunoId) return
    setLoading(true)
    const res = await acessosPorAluno(alunoId, dataInicio, dataFim)
    setAcessos(res)
    setBuscou(true)
    setLoading(false)
  }

  function montarGrafico() {
    const agrupado = {}
    for (let i = 0; i < acessos.length; i++) {
      const a = acessos[i]
      if (!a.autorizado) continue
      const dia = a.dataHoraAcesso ? a.dataHoraAcesso.slice(0, 10) : ''
      if (!dia) continue
      if (agrupado[dia]) {
        agrupado[dia] = agrupado[dia] + 1
      } else {
        agrupado[dia] = 1
      }
    }
    const resultado = []
    const chaves = Object.keys(agrupado).sort()
    for (let i = 0; i < chaves.length; i++) {
      resultado.push({ data: chaves[i], total: agrupado[chaves[i]] })
    }
    return resultado
  }

  let totalAuth = 0
  for (let i = 0; i < acessos.length; i++) {
    if (acessos[i].autorizado) totalAuth++
  }

  const dadosGrafico = montarGrafico()

  return (
    <div>
      <h2 className={styles.titulo}>Frequencia</h2>

      <div className={styles.filtros}>
        <div className={styles.campofiltro}>
          <label>Aluno</label>
          <select value={alunoId} onChange={e => setAlunoId(e.target.value)}>
            {alunos.map(a => (
              <option key={a.id} value={String(a.id)}>{a.nome}</option>
            ))}
          </select>
        </div>
        <div className={styles.campofiltro}>
          <label>Data inicio</label>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
        </div>
        <div className={styles.campofiltro}>
          <label>Data fim</label>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
        </div>
        <button className={styles.btnBuscar} onClick={buscar}>Buscar</button>
      </div>

      {loading && <p>Carregando...</p>}

      {buscou && !loading && (
        <div>
          <p className={styles.resumo}>
            Total: {acessos.length} | Autorizados: {totalAuth}
          </p>

          <div className={styles.tabelaWrap}>
            <table className={styles.tabela}>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Autorizado</th>
                </tr>
              </thead>
              <tbody>
                {acessos.map((a, i) => (
                  <tr key={i}>
                    <td>{formataData(a.dataHoraAcesso)}</td>
                    <td>{a.autorizado ? 'Sim' : 'Nao'}</td>
                  </tr>
                ))}
                {acessos.length === 0 && (
                  <tr>
                    <td colSpan={2} className={styles.vazio}>Nenhum acesso no periodo.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {dadosGrafico.length > 0 && (
            <div className={styles.grafico}>
              <h3 className={styles.graficoTitulo}>Acessos por dia</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={dadosGrafico}>
                  <XAxis dataKey="data" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#e94560" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
