package com.academia.controller;

import com.academia.model.Plano;
import com.academia.model.PlanoInfo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/planos")
@CrossOrigin("http://localhost:5173")
public class PlanoController {

    @GetMapping
    public List<Map<String, Object>> listar() {
        List<Map<String, Object>> lista = new ArrayList<>();

        Plano[] planos = Plano.values();
        for (Plano plano : planos) {
            PlanoInfo info = PlanoInfo.getInfo(plano);
            Map<String, Object> map = new HashMap<>();
            map.put("id", plano.name());
            map.put("nome", info.getNome());
            map.put("valor", info.getValor());
            map.put("limiteFrequenciaDiaria", info.getLimiteFrequenciaDiaria());
            lista.add(map);
        }

        return lista;
    }
}
