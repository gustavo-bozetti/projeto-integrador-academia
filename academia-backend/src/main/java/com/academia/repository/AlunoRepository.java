package com.academia.repository;

import com.academia.model.Aluno;
import com.academia.model.Plano;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;
import java.util.Optional;

@Repository
public class AlunoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Aluno> findAll() {
        String sql = "SELECT * FROM alunos";
        return jdbcTemplate.query(sql, new AlunoRowMapper());
    }

    public Optional<Aluno> findById(Long id) {
        String sql = "SELECT * FROM alunos WHERE id = ?";
        List<Aluno> lista = jdbcTemplate.query(sql, new AlunoRowMapper(), id);
        if (lista.size() == 0) {
            return Optional.empty();
        }
        return Optional.of(lista.get(0));
    }

    public Aluno save(Aluno aluno) {
        if (aluno.getId() == null) {
            String sql = "INSERT INTO alunos (nome, cpf, email, telefone, sexo, data_matricula, plano, status_pagamento, data_vencimento, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbcTemplate.update(new PreparedStatementCreatorAluno(sql, aluno), keyHolder);
            aluno.setId(keyHolder.getKey().longValue());
        } else {
            String sql = "UPDATE alunos SET nome=?, cpf=?, email=?, telefone=?, sexo=?, data_matricula=?, plano=?, status_pagamento=?, data_vencimento=?, ativo=? WHERE id=?";
            jdbcTemplate.update(sql,
                aluno.getNome(),
                aluno.getCpf(),
                aluno.getEmail(),
                aluno.getTelefone(),
                aluno.getSexo(),
                aluno.getDataMatricula() != null ? Date.valueOf(aluno.getDataMatricula()) : null,
                aluno.getPlano() != null ? aluno.getPlano().name() : null,
                aluno.getStatusPagamento(),
                aluno.getDataVencimento() != null ? Date.valueOf(aluno.getDataVencimento()) : null,
                aluno.isAtivo(),
                aluno.getId()
            );
        }
        return aluno;
    }

    public void deleteById(Long id) {
        String sql = "DELETE FROM alunos WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    private static class PreparedStatementCreatorAluno implements org.springframework.jdbc.core.PreparedStatementCreator {
        private final String sql;
        private final Aluno aluno;

        PreparedStatementCreatorAluno(String sql, Aluno aluno) {
            this.sql = sql;
            this.aluno = aluno;
        }

        public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
            PreparedStatement ps = con.prepareStatement(sql, new String[]{"id"});
            ps.setString(1, aluno.getNome());
            ps.setString(2, aluno.getCpf());
            ps.setString(3, aluno.getEmail());
            ps.setString(4, aluno.getTelefone());
            ps.setString(5, aluno.getSexo());

            if (aluno.getDataMatricula() != null) {
                ps.setDate(6, Date.valueOf(aluno.getDataMatricula()));
            } else {
                ps.setNull(6, Types.DATE);
            }

            ps.setString(7, aluno.getPlano() != null ? aluno.getPlano().name() : null);
            ps.setString(8, aluno.getStatusPagamento());

            if (aluno.getDataVencimento() != null) {
                ps.setDate(9, Date.valueOf(aluno.getDataVencimento()));
            } else {
                ps.setNull(9, Types.DATE);
            }

            ps.setBoolean(10, aluno.isAtivo());
            return ps;
        }
    }

    private static class AlunoRowMapper implements RowMapper<Aluno> {
        public Aluno mapRow(ResultSet rs, int rowNum) throws SQLException {
            Aluno aluno = new Aluno();
            aluno.setId(rs.getLong("id"));
            aluno.setNome(rs.getString("nome"));
            aluno.setCpf(rs.getString("cpf"));
            aluno.setEmail(rs.getString("email"));
            aluno.setTelefone(rs.getString("telefone"));
            aluno.setSexo(rs.getString("sexo"));

            Date dataMatricula = rs.getDate("data_matricula");
            if (dataMatricula != null) {
                aluno.setDataMatricula(dataMatricula.toLocalDate());
            }

            String plano = rs.getString("plano");
            if (plano != null) {
                aluno.setPlano(Plano.valueOf(plano));
            }

            aluno.setStatusPagamento(rs.getString("status_pagamento"));

            Date dataVencimento = rs.getDate("data_vencimento");
            if (dataVencimento != null) {
                aluno.setDataVencimento(dataVencimento.toLocalDate());
            }

            aluno.setAtivo(rs.getBoolean("ativo"));
            return aluno;
        }
    }
}
