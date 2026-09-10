import { useState } from 'react'
import Navbar from './components/Navbar'
import RoleSelect from './pages/RoleSelect'
import PlanoSelect from './pages/PlanoSelect'
import UsuarioCadastro from './pages/UsuarioCadastro'
import UsuarioCatraca from './pages/UsuarioCatraca'
import UsuarioLogin from './pages/UsuarioLogin'
import Alunos from './pages/Alunos'
import Catraca from './pages/Catraca'
import Frequencia from './pages/Frequencia'
import './App.css'

export default function App() {
  const [role, setRole] = useState(null)
  const [step, setStep] = useState('plano')
  const [planoSelecionado, setPlanoSelecionado] = useState(null)
  const [alunoRegistrado, setAlunoRegistrado] = useState(null)
  const [adminPage, setAdminPage] = useState('alunos')

  function voltar() {
    setRole(null)
    setStep('plano')
    setPlanoSelecionado(null)
    setAlunoRegistrado(null)
  }

  if (role === null) {
    return <RoleSelect onSelect={setRole} />
  }

  if (role === 'usuario') {
    if (step === 'plano') {
      return (
        <PlanoSelect
          onContinuar={p => { setPlanoSelecionado(p); setStep('cadastro') }}
          onVoltar={voltar}
          onJaTenhoPlano={() => setStep('login')}
        />
      )
    }

    if (step === 'login') {
      return (
        <UsuarioLogin
          onConcluir={(aluno, plano) => { setAlunoRegistrado(aluno); setPlanoSelecionado(plano); setStep('catraca') }}
          onVoltar={() => setStep('plano')}
        />
      )
    }

    if (step === 'cadastro') {
      return (
        <UsuarioCadastro
          plano={planoSelecionado}
          onConcluir={aluno => { setAlunoRegistrado(aluno); setStep('catraca') }}
          onVoltar={() => setStep('plano')}
        />
      )
    }

    if (step === 'catraca') {
      return (
        <UsuarioCatraca
          aluno={alunoRegistrado}
          plano={planoSelecionado}
          onInicio={voltar}
        />
      )
    }
  }

  if (role === 'admin') {
    return (
      <div>
        <Navbar page={adminPage} setPage={setAdminPage} onSair={voltar} />
        <div className="admin-container">
          {adminPage === 'alunos' && <Alunos />}
          {adminPage === 'catraca' && <Catraca />}
          {adminPage === 'frequencia' && <Frequencia />}
        </div>
      </div>
    )
  }

  return null
}
