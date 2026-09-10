package com.academia.repository;

import com.academia.model.Acesso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class AcessoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Acesso save(Acesso acesso) {
        String sql = "INSERT INTO acessos (aluno_id, data_hora_acesso, autorizado, motivo_negacao) VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreatorAcesso(sql, acesso), keyHolder);
        acesso.setId(keyHolder.getKey().longValue());
        return acesso;
    }

    public List<Acesso> findByAlunoIdAndDataHoraAcessoBetween(Long alunoId, LocalDateTime inicio, LocalDateTime fim) {
        String sql = "SELECT * FROM acessos WHERE aluno_id = ? AND data_hora_acesso BETWEEN ? AND ?";
        return jdbcTemplate.query(sql, new AcessoRowMapper(), alunoId, Timestamp.valueOf(inicio), Timestamp.valueOf(fim));
    }

    public List<Acesso> findByDataHoraAcessoBetween(LocalDateTime inicio, LocalDateTime fim) {
        String sql = "SELECT * FROM acessos WHERE data_hora_acesso BETWEEN ? AND ?";
        return jdbcTemplate.query(sql, new AcessoRowMapper(), Timestamp.valueOf(inicio), Timestamp.valueOf(fim));
    }

    private static class PreparedStatementCreatorAcesso implements org.springframework.jdbc.core.PreparedStatementCreator {
        private final String sql;
        private final Acesso acesso;

        PreparedStatementCreatorAcesso(String sql, Acesso acesso) {
            this.sql = sql;
            this.acesso = acesso;
        }

        public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
            PreparedStatement ps = con.prepareStatement(sql, new String[]{"id"});
            ps.setLong(1, acesso.getAlunoId());
            ps.setTimestamp(2, Timestamp.valueOf(acesso.getDataHoraAcesso()));
            ps.setBoolean(3, acesso.isAutorizado());
            ps.setString(4, acesso.getMotivoNegacao());
            return ps;
        }
    }

    private static class AcessoRowMapper implements RowMapper<Acesso> {
        public Acesso mapRow(ResultSet rs, int rowNum) throws SQLException {
            Acesso acesso = new Acesso();
            acesso.setId(rs.getLong("id"));
            acesso.setAlunoId(rs.getLong("aluno_id"));

            Timestamp dataHora = rs.getTimestamp("data_hora_acesso");
            if (dataHora != null) {
                acesso.setDataHoraAcesso(dataHora.toLocalDateTime());
            }

            acesso.setAutorizado(rs.getBoolean("autorizado"));
            acesso.setMotivoNegacao(rs.getString("motivo_negacao"));
            return acesso;
        }
    }
}
