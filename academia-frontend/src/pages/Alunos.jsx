import { useState, useEffect } from 'react'
import { getAlunos, getPlanos, criarAluno, atualizarAluno, deletarAluno, pagarAluno } from '../api'
import styles from '../styles/alunos.module.css'

export default function Alunos() {
  const [lista, setLista] = useState([])
  const [planos, setPlanos] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [modalPagar, setModalPagar] = useState(null)
  const [formaPag, setFormaPag] = useState('DINHEIRO')

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [sexo, setSexo] = useState('')
  const [plano, setPlano] = useState('')

  const [erroNome, setErroNome] = useState('')
  const [erroCpf, setErroCpf] = useState('')
  const [erroEmail, setErroEmail] = useState('')
  const [erroSexo, setErroSexo] = useState('')

  async function carregar() {
    setLoading(true)
    try {
      const alunos = await getAlunos()
      const p = await getPlanos()
      setLista(alunos)
      setPlanos(p)
      if (p.length > 0 && plano === '') {
        setPlano(p[0].id)
      }
    } catch (e) {
      setErro('Erro ao carregar.')
    }
    setLoading(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  function limparErros() {
    setErroNome('')
    setErroCpf('')
    setErroEmail('')
    setErroSexo('')
  }

  function validar() {
    let valido = true

    if (nome.trim() === '') {
      setErroNome('Nome e obrigatorio')
      valido = false
    } else if (nome.trim().length < 3) {
      setErroNome('Nome deve ter pelo menos 3 caracteres')
      valido = false
    } else {
      setErroNome('')
    }

    const cpfNumeros = cpf.replace(/[^0-9]/g, '')
    if (cpf.trim() === '') {
      setErroCpf('CPF e obrigatorio')
      valido = false
    } else if (cpfNumeros.length !== 11) {
      setErroCpf('CPF deve ter 11 digitos')
      valido = false
    } else {
      setErroCpf('')
    }

    if (email.trim() === '') {
      setErroEmail('Email e obrigatorio')
      valido = false
    } else if (email.includes('@') === false) {
      setErroEmail('Email invalido')
      valido = false
    } else {
      setErroEmail('')
    }

    if (sexo === '') {
      setErroSexo('Sexo e obrigatorio')
      valido = false
    } else {
      setErroSexo('')
    }

    return valido
  }

  function abrirNovo() {
    setEditando(null)
    setNome('')
    setCpf('')
    setEmail('')
    setTelefone('')
    setSexo('')
    setPlano(planos.length > 0 ? planos[0].id : '')
    limparErros()
    setShowForm(true)
  }

  function abrirEditar(aluno) {
    setEditando(aluno)
    setNome(aluno.nome)
    setCpf(aluno.cpf)
    setEmail(aluno.email)
    setTelefone(aluno.telefone || '')
    setSexo(aluno.sexo || '')
    setPlano(aluno.plano)
    limparErros()
    setShowForm(true)
  }

  function cancelar() {
    setShowForm(false)
    setEditando(null)
    limparErros()
  }

  async function salvar(e) {
    e.preventDefault()

    if (validar() === false) return

    const dados = { nome, cpf, email, telefone, sexo, plano }
    try {
      if (editando) {
        await atualizarAluno(editando.id, dados)
      } else {
        await criarAluno(dados)
      }
      setShowForm(false)
      setEditando(null)
      carregar()
    } catch (e) {
      setErro('Erro ao salvar.')
    }
  }

  async function excluir(id) {
    if (!window.confirm('Excluir este aluno?')) return
    try {
      await deletarAluno(id)
      carregar()
    } catch (e) {
      setErro('Erro ao excluir.')
    }
  }

  async function confirmarPagamento() {
    try {
      await pagarAluno(modalPagar.id, formaPag)
      setModalPagar(null)
      carregar()
    } catch (e) {
      setErro('Erro ao registrar pagamento.')
    }
  }

  if (loading) return <p style={{ marginTop: 20 }}>Carregando...</p>

  return (
    <div>
      <div className={styles.topo}>
        <h2 className={styles.titulo}>Alunos</h2>
        <button className={styles.btnNovo} onClick={showForm ? cancelar : abrirNovo}>
          {showForm ? 'Cancelar' : 'Novo Aluno'}
        </button>
      </div>

      {erro && <p className={styles.erro}>{erro}</p>}

      {showForm && (
        <div className={styles.form}>
          <h3 className={styles.formTitulo}>{editando ? 'Editar Aluno' : 'Cadastrar Aluno'}</h3>
          <form onSubmit={salvar}>
            <div className={styles.formGrid}>
              <div className={styles.campo}>
                <label>Nome</label>
                <input value={nome} onChange={e => setNome(e.target.value)} />
                {erroNome && <span className={styles.erroCampo}>{erroNome}</span>}
              </div>
              <div className={styles.campo}>
                <label>CPF</label>
                <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" />
                {erroCpf && <span className={styles.erroCampo}>{erroCpf}</span>}
              </div>
              <div className={styles.campo}>
                <label>Email</label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                {erroEmail && <span className={styles.erroCampo}>{erroEmail}</span>}
              </div>
              <div className={styles.campo}>
                <label>Telefone</label>
                <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="opcional" />
              </div>
              <div className={styles.campo}>
                <label>Sexo</label>
                <select value={sexo} onChange={e => setSexo(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                  <option value="OUTRO">Prefiro nao informar</option>
                </select>
                {erroSexo && <span className={styles.erroCampo}>{erroSexo}</span>}
              </div>
              <div className={styles.campo}>
                <label>Plano</label>
                <select value={plano} onChange={e => setPlano(e.target.value)}>
                  {planos.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor}/mes</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.formBotoes}>
              <button type="submit" className={styles.btnSalvar}>Salvar</button>
              <button type="button" className={styles.btnCancelar} onClick={cancelar}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.tabelaWrap}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Plano</th>
              <th>Status Pag.</th>
              <th>Vencimento</th>
              <th>Ativo</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {lista.map(a => (
              <tr key={a.id}>
                <td>{a.nome}</td>
                <td>{a.cpf}</td>
                <td>{a.plano}</td>
                <td>
                  <span className={a.statusPagamento === 'PAGO' ? styles.badgePago : styles.badgePendente}>
                    {a.statusPagamento}
                  </span>
                </td>
                <td>{a.dataVencimento || '-'}</td>
                <td>{a.ativo ? 'Sim' : 'Nao'}</td>
                <td>
                  <div className={styles.acoes}>
                    <button className={styles.btnEditar} onClick={() => abrirEditar(a)}>Editar</button>
                    {a.statusPagamento !== 'PAGO' && (
                      <button className={styles.btnPagar} onClick={() => { setModalPagar(a); setFormaPag('DINHEIRO') }}>Pagar</button>
                    )}
                    <button className={styles.btnExcluir} onClick={() => excluir(a.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.vazio}>Nenhum aluno cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalPagar && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitulo}>Registrar Pagamento</h3>
            <p className={styles.modalAluno}>Aluno: <strong>{modalPagar.nome}</strong></p>
            <div className={styles.modalCampo}>
              <label>Forma de pagamento</label>
              <select value={formaPag} onChange={e => setFormaPag(e.target.value)}>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="CARTAO">Cartao</option>
              </select>
            </div>
            <div className={styles.modalBotoes}>
              <button className={styles.btnSalvar} onClick={confirmarPagamento}>Confirmar</button>
              <button className={styles.btnCancelar} onClick={() => setModalPagar(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
