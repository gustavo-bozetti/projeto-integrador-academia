const BASE = 'http://localhost:8080'

export async function getPlanos() {
  const res = await fetch(BASE + '/planos')
  return res.json()
}

export async function getAlunos() {
  const res = await fetch(BASE + '/alunos')
  return res.json()
}

export async function criarAluno(data) {
  const res = await fetch(BASE + '/alunos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function atualizarAluno(id, data) {
  const res = await fetch(BASE + '/alunos/' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deletarAluno(id) {
  await fetch(BASE + '/alunos/' + id, { method: 'DELETE' })
}

export async function pagarAluno(id, forma) {
  const res = await fetch(BASE + '/alunos/' + id + '/pagar?formaPagamento=' + forma, {
    method: 'POST'
  })
  return res.json()
}

export async function registrarAcesso(alunoId) {
  const res = await fetch(BASE + '/catraca/acesso', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alunoId })
  })
  return res.json()
}

export async function acessosHoje() {
  const res = await fetch(BASE + '/catraca/acessos/hoje')
  return res.json()
}

export async function acessosPorAluno(id, dataInicio, dataFim) {
  const res = await fetch(BASE + '/catraca/acessos/aluno/' + id + '?dataInicio=' + dataInicio + '&dataFim=' + dataFim)
  return res.json()
}
