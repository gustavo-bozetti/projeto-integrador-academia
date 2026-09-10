package com.academia.service;

import com.academia.model.Aluno;
import com.academia.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;

    public List<Aluno> listar() {
        List<Aluno> todos = alunoRepository.findAll();
        return todos;
    }

    public Aluno buscar(Long id) {
        Optional<Aluno> resultado = alunoRepository.findById(id);
        if (resultado.isPresent() == false) {
            throw new RuntimeException("Aluno nao encontrado com id: " + id);
        }
        return resultado.get();
    }

    private void validar(Aluno aluno) {
        if (aluno.getNome() == null || aluno.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("Nome e obrigatorio");
        }
        if (aluno.getNome().trim().length() < 3) {
            throw new IllegalArgumentException("Nome deve ter pelo menos 3 caracteres");
        }
        if (aluno.getCpf() == null || aluno.getCpf().trim().isEmpty()) {
            throw new IllegalArgumentException("CPF e obrigatorio");
        }
        String cpfNumeros = aluno.getCpf().replaceAll("[^0-9]", "");
        if (cpfNumeros.length() != 11) {
            throw new IllegalArgumentException("CPF deve ter 11 digitos");
        }
        if (aluno.getEmail() == null || aluno.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email e obrigatorio");
        }
        if (aluno.getEmail().contains("@") == false) {
            throw new IllegalArgumentException("Email invalido");
        }
        if (aluno.getPlano() == null) {
            throw new IllegalArgumentException("Plano e obrigatorio");
        }
        if (aluno.getSexo() == null || aluno.getSexo().trim().isEmpty()) {
            throw new IllegalArgumentException("Sexo e obrigatorio");
        }
    }

    public Aluno criar(Aluno aluno) {
        validar(aluno);
        aluno.setDataMatricula(LocalDate.now());
        aluno.setAtivo(true);
        if (aluno.getStatusPagamento() == null) {
            aluno.setStatusPagamento("PENDENTE");
        }
        Aluno salvo = alunoRepository.save(aluno);
        return salvo;
    }

    public Aluno atualizar(Long id, Aluno dados) {
        validar(dados);
        Aluno aluno = buscar(id);

        if (dados.getNome() != null && dados.getNome().isEmpty() == false) {
            aluno.setNome(dados.getNome());
        }
        aluno.setCpf(dados.getCpf());
        aluno.setEmail(dados.getEmail());
        aluno.setTelefone(dados.getTelefone());
        aluno.setSexo(dados.getSexo());
        aluno.setPlano(dados.getPlano());

        Aluno atualizado = alunoRepository.save(aluno);
        return atualizado;
    }

    public void deletar(Long id) {
        Aluno aluno = buscar(id);
        alunoRepository.deleteById(aluno.getId());
    }

    public Aluno pagar(Long id, String formaPagamento) {
        Aluno aluno = buscar(id);

        String novoStatus = "PAGO";
        LocalDate novoVencimento = LocalDate.now().plusDays(30);

        aluno.setStatusPagamento(novoStatus);
        aluno.setDataVencimento(novoVencimento);

        Aluno salvo = alunoRepository.save(aluno);
        return salvo;
    }
}
