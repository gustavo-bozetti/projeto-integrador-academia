package com.academia.service;

import com.academia.model.Acesso;
import com.academia.model.Aluno;
import com.academia.model.PlanoInfo;
import com.academia.repository.AcessoRepository;
import com.academia.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AcessoService {

    @Autowired
    private AcessoRepository acessoRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    public Map<String, Object> registrarAcesso(Long alunoId) {
        Map<String, Object> resposta = new HashMap<>();

        Optional<Aluno> busca = alunoRepository.findById(alunoId);

        if (busca.isPresent() == false) {
            resposta.put("autorizado", false);
            resposta.put("mensagem", "Aluno nao encontrado");
            return resposta;
        }

        Aluno aluno = busca.get();

        if (aluno.isAtivo() == false) {
            Acesso negado = new Acesso();
            negado.setAlunoId(alunoId);
            negado.setDataHoraAcesso(LocalDateTime.now());
            negado.setAutorizado(false);
            negado.setMotivoNegacao("Aluno inativo");
            acessoRepository.save(negado);

            resposta.put("autorizado", false);
            resposta.put("mensagem", "Aluno inativo");
            resposta.put("aluno", aluno);
            return resposta;
        }

        boolean statusOk = aluno.getStatusPagamento().equals("PAGO");
        boolean dentroValidade = false;

        if (aluno.getDataVencimento() != null) {
            boolean vencido = aluno.getDataVencimento().isBefore(LocalDate.now());
            if (vencido == false) {
                dentroValidade = true;
            }
        }

        if (statusOk == false || dentroValidade == false) {
            Acesso negado = new Acesso();
            negado.setAlunoId(alunoId);
            negado.setDataHoraAcesso(LocalDateTime.now());
            negado.setAutorizado(false);
            negado.setMotivoNegacao("Pagamento pendente ou vencido");
            acessoRepository.save(negado);

            resposta.put("autorizado", false);
            resposta.put("mensagem", "Pagamento pendente ou vencido");
            resposta.put("aluno", aluno);
            return resposta;
        }

        PlanoInfo info = PlanoInfo.getInfo(aluno.getPlano());
        int limite = info.getLimiteFrequenciaDiaria();

        if (limite < 999) {
            LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
            LocalDateTime fimDia = LocalDate.now().atTime(LocalTime.of(23, 59, 59));

            List<Acesso> acessosHoje = acessoRepository.findByAlunoIdAndDataHoraAcessoBetween(alunoId, inicioDia, fimDia);

            int qtdHoje = 0;
            for (int i = 0; i < acessosHoje.size(); i++) {
                Acesso a = acessosHoje.get(i);
                if (a.isAutorizado() == true) {
                    qtdHoje = qtdHoje + 1;
                }
            }

            if (qtdHoje >= limite) {
                Acesso negado = new Acesso();
                negado.setAlunoId(alunoId);
                negado.setDataHoraAcesso(LocalDateTime.now());
                negado.setAutorizado(false);
                negado.setMotivoNegacao("Limite diario atingido (" + qtdHoje + "/" + limite + ")");
                acessoRepository.save(negado);

                resposta.put("autorizado", false);
                resposta.put("mensagem", "Limite diario atingido (" + qtdHoje + "/" + limite + ")");
                resposta.put("aluno", aluno);
                return resposta;
            }
        }

        Acesso acesso = new Acesso();
        acesso.setAlunoId(alunoId);
        acesso.setDataHoraAcesso(LocalDateTime.now());
        acesso.setAutorizado(true);

        Acesso salvo = acessoRepository.save(acesso);

        resposta.put("autorizado", true);
        resposta.put("acesso", salvo);
        resposta.put("aluno", aluno);
        resposta.put("mensagem", "Acesso liberado");
        return resposta;
    }

    public List<Acesso> acessosHoje() {
        LocalDateTime inicio = LocalDate.now().atStartOfDay();
        LocalDateTime fim = LocalDate.now().atTime(23, 59, 59);
        List<Acesso> lista = acessoRepository.findByDataHoraAcessoBetween(inicio, fim);
        return lista;
    }

    public List<Acesso> acessosPorAluno(Long alunoId, LocalDate dataInicio, LocalDate dataFim) {
        LocalDateTime inicio = dataInicio.atStartOfDay();
        LocalDateTime fim = dataFim.atTime(23, 59, 59);
        return acessoRepository.findByAlunoIdAndDataHoraAcessoBetween(alunoId, inicio, fim);
    }
}
