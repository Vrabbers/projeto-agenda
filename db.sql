CREATE TABLE IF NOT EXISTS usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(40) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criado DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL,
    usuario_id INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    dias_da_semana TINYINT NOT NULL,
    hora_inicio TIME NULL,
    hora_fim TIME NULL,
    data_inicio DATE NOT NULL,
    granularidade ENUM ('hora', 'dia') NOT NULL,
    data_criado DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (nome, usuario_id)
);

CREATE TABLE IF NOT EXISTS participante (
    usuario INT REFERENCES usuario(id) ON DELETE CASCADE,
    evento INT REFERENCES evento(id) ON DELETE CASCADE,
    PRIMARY KEY(usuario, evento)
);

CREATE TABLE IF NOT EXISTS participante_horario_possivel (
    usuario INT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    evento INT NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    hora TIME NULL,
    PRIMARY KEY (usuario, evento, hora)
);
