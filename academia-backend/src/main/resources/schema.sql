CREATE TABLE IF NOT EXISTS alunos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(30),
    email VARCHAR(255),
    telefone VARCHAR(30),
    sexo VARCHAR(30),
    data_matricula DATE,
    plano VARCHAR(30),
    status_pagamento VARCHAR(30),
    data_vencimento DATE,
    ativo BOOLEAN
);

CREATE TABLE IF NOT EXISTS acessos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    aluno_id BIGINT,
    data_hora_acesso TIMESTAMP,
    autorizado BOOLEAN,
    motivo_negacao VARCHAR(255)
);
