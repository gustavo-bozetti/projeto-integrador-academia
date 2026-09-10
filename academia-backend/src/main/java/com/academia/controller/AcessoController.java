package com.academia.controller;

import com.academia.model.Acesso;
import com.academia.service.AcessoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/catraca")
@CrossOrigin(origins = "http://localhost:5173")
public class AcessoController {

    @Autowired
    private AcessoService acessoService;

    @PostMapping("/acesso")
    public ResponseEntity<Object> registrar(@RequestBody Map<String, Long> body) {
        Long alunoId = body.get("alunoId");

        if (alunoId == null) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "alunoId e obrigatorio");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }

        Map<String, Object> resultado = acessoService.registrarAcesso(alunoId);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
    }

    @GetMapping("/acessos/hoje")
    public ResponseEntity<List<Acesso>> acessosHoje() {
        List<Acesso> lista = acessoService.acessosHoje();
        return ResponseEntity.status(HttpStatus.OK).body(lista);
    }

    @GetMapping("/acessos/aluno/{alunoId}")
    public ResponseEntity<Object> acessosPorAluno(
            @PathVariable Long alunoId,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim) {

        try {
            LocalDate inicio;
            LocalDate fim;

            if (dataInicio == null) {
                inicio = LocalDate.now().minusDays(30);
            } else {
                inicio = LocalDate.parse(dataInicio);
            }

            if (dataFim == null) {
                fim = LocalDate.now();
            } else {
                fim = LocalDate.parse(dataFim);
            }

            List<Acesso> lista = acessoService.acessosPorAluno(alunoId, inicio, fim);
            return ResponseEntity.status(HttpStatus.OK).body(lista);

        } catch (Exception e) {
            Map<String, String> erro = new HashMap<>();
            erro.put("erro", "Data invalida. Use o formato YYYY-MM-DD");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erro);
        }
    }
}
