package com.academia;

import com.academia.model.Aluno;
import com.academia.model.Plano;
import com.academia.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private AlunoRepository alunoRepository;

    @Override
    public void run(String... args) throws Exception {

        Aluno carlos = new Aluno();
        carlos.setNome("Carlos Silva");
        carlos.setCpf("123.456.789-00");
        carlos.setEmail("carlos@email.com");
        carlos.setTelefone("11999990001");
        carlos.setSexo("MASCULINO");
        carlos.setPlano(Plano.BASICO);
        carlos.setStatusPagamento("PAGO");
        carlos.setDataVencimento(LocalDate.now().plusDays(30));
        carlos.setDataMatricula(LocalDate.now());
        carlos.setAtivo(true);
        alunoRepository.save(carlos);

        Aluno ana = new Aluno();
        ana.setNome("Ana Oliveira");
        ana.setCpf("987.654.321-00");
        ana.setEmail("ana@email.com");
        ana.setTelefone("11999990002");
        ana.setSexo("FEMININO");
        ana.setPlano(Plano.INTERMEDIARIO);
        ana.setStatusPagamento("PENDENTE");
        ana.setDataMatricula(LocalDate.now().minusDays(10));
        ana.setAtivo(true);
        alunoRepository.save(ana);

        Aluno pedro = new Aluno();
        pedro.setNome("Pedro Santos");
        pedro.setCpf("111.222.333-44");
        pedro.setEmail("pedro@email.com");
        pedro.setTelefone("11999990003");
        pedro.setSexo("MASCULINO");
        pedro.setPlano(Plano.PREMIUM);
        pedro.setStatusPagamento("PAGO");
        pedro.setDataVencimento(LocalDate.now().plusDays(15));
        pedro.setDataMatricula(LocalDate.now().minusDays(60));
        pedro.setAtivo(true);
        alunoRepository.save(pedro);
    }
}
