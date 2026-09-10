package com.academia.model;

import java.time.LocalDateTime;

public class Acesso {

    private Long id;
    private Long alunoId;
    private LocalDateTime dataHoraAcesso;
    private boolean autorizado;
    private String motivoNegacao;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAlunoId() { return alunoId; }
    public void setAlunoId(Long alunoId) { this.alunoId = alunoId; }

    public LocalDateTime getDataHoraAcesso() { return dataHoraAcesso; }
    public void setDataHoraAcesso(LocalDateTime dataHoraAcesso) { this.dataHoraAcesso = dataHoraAcesso; }

    public boolean isAutorizado() { return autorizado; }
    public void setAutorizado(boolean autorizado) { this.autorizado = autorizado; }

    public String getMotivoNegacao() { return motivoNegacao; }
    public void setMotivoNegacao(String motivoNegacao) { this.motivoNegacao = motivoNegacao; }
}
