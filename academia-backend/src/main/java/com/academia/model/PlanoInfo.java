package com.academia.model;

public class PlanoInfo {

    private String nome;
    private double valor;
    private int limiteFrequenciaDiaria;

    public PlanoInfo(String nome, double valor, int limiteFrequenciaDiaria) {
        this.nome = nome;
        this.valor = valor;
        this.limiteFrequenciaDiaria = limiteFrequenciaDiaria;
    }

    public static PlanoInfo getInfo(Plano plano) {
        if (plano == Plano.BASICO) {
            return new PlanoInfo("Basico", 80.0, 3);
        } else if (plano == Plano.INTERMEDIARIO) {
            return new PlanoInfo("Intermediario", 120.0, 5);
        } else {
            return new PlanoInfo("Premium", 200.0, 999);
        }
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public int getLimiteFrequenciaDiaria() {
        return limiteFrequenciaDiaria;
    }

    public void setLimiteFrequenciaDiaria(int limiteFrequenciaDiaria) {
        this.limiteFrequenciaDiaria = limiteFrequenciaDiaria;
    }
}
