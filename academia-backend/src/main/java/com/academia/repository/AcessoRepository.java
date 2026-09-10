package com.academia.repository;

import com.academia.model.Acesso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AcessoRepository extends JpaRepository<Acesso, Long> {

    List<Acesso> findByAlunoIdAndDataHoraAcessoBetween(Long alunoId, LocalDateTime inicio, LocalDateTime fim);

    List<Acesso> findByDataHoraAcessoBetween(LocalDateTime inicio, LocalDateTime fim);
}
