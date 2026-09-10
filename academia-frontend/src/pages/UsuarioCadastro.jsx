import { useState } from 'react'
import { criarAluno } from '../api'
import styles from '../styles/usuario.module.css'

export default function UsuarioCadastro({ plano, onConcluir, onVoltar }) {
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [sexo, setSexo] = useState('')

  const [erroNome, setErroNome] = useState('')
  const [erroCpf, setErroCpf] = useState('')
  const [erroEmail, setErroEmail] = useState('')
  const [erroSexo, setErroSexo] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  function validar() {
    let ok = true

    if (nome.trim() === '') {
      setErroNome('Nome e obrigatorio')
      ok = false
    } else if (nome.trim().length < 3) {
      setErroNome('Minimo 3 caracteres')
      ok = false
    } else {
      setErroNome('')
    }

    const numeros = cpf.replace(/[^0-9]/g, '')
    if (cpf.trim() === '') {
      setErroCpf('CPF e obrigatorio')
      ok = false
    } else if (numeros.length !== 11) {
      setErroCpf('CPF deve ter 11 digitos')
      ok = false
    } else {
      setErroCpf('')
    }

    if (email.trim() === '') {
      setErroEmail('Email e obrigatorio')
      ok = false
    } else if (email.includes('@') === false) {
      setErroEmail('Email invalido')
      ok = false
    } else {
      setErroEmail('')
    }

    if (sexo === '') {
      setErroSexo('Sexo e obrigatorio')
      ok = false
    } else {
      setErroSexo('')
    }

    return ok
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (validar() === false) return

    setLoading(true)
    setErro('')
    try {
      const aluno = await criarAluno({ nome, cpf, email, telefone, sexo, plano: plano.id })
      onConcluir(aluno)
    } catch (e) {
      setErro('Erro ao cadastrar. Tente novamente.')
    }
    setLoading(false)
  }

  return (
    <div className={styles.tela}>
      <div className={styles.card}>
        <div className={styles.passos}>
          <div className={styles.passoConcluido}>1</div>
          <div className={styles.passoLinhaAtiva + ' ' + styles.passoLinha}></div>
          <div className={styles.passoAtivo}>2</div>
          <div className={styles.passoLinha}></div>
          <div className={styles.passo}>3</div>
        </div>

        <span className={styles.planoBadge}>{plano.nome} - R$ {plano.valor}/mes</span>
        <h2 className={styles.titulo}>Seus dados</h2>
        <p className={styles.subtitulo}>Preencha para concluir o cadastro</p>

        {erro && <p style={{ color: '#e74c3c', fontSize: 14, marginBottom: 16 }}>{erro}</p>}

        <form onSubmit={handleSubmit}>
          <div className={styles.campo}>
            <label>Nome completo</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Maria Silva" />
            {erroNome && <span className={styles.erroCampo}>{erroNome}</span>}
          </div>
          <div className={styles.campo}>
            <label>CPF</label>
            <input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" />
            {erroCpf && <span className={styles.erroCampo}>{erroCpf}</span>}
          </div>
          <div className={styles.campo}>
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
            {erroEmail && <span className={styles.erroCampo}>{erroEmail}</span>}
          </div>
          <div className={styles.campo}>
            <label>Telefone <span style={{ color: '#aaa', fontWeight: 400 }}>(opcional)</span></label>
            <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 99999-0000" />
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

          <div className={styles.botoes}>
            <button type="button" className={styles.btnSecundario} onClick={onVoltar}>Voltar</button>
            <button type="submit" className={styles.btnPrincipal} disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar e continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
