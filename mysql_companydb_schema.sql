CREATE DATABASE IF NOT EXISTS companydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE companydb;

CREATE TABLE IF NOT EXISTS areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS empleados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  area_id INT NOT NULL,
  fecha_ingreso DATE NOT NULL DEFAULT (CURRENT_DATE),
  salario DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_empleados_areas FOREIGN KEY (area_id) REFERENCES areas(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT ck_salario CHECK (salario >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(200) NOT NULL,
  creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO areas (id, nombre) VALUES
  (1, "Sistemas"), (2, "Recursos Humanos"), (3, "Finanzas");

INSERT IGNORE INTO empleados (id, nombre, email, area_id, fecha_ingreso, salario) VALUES
  (1, "Ana Pérez", "ana@example.com", 1, "2024-01-15", 18000.00),
  (2, "Luis Soto", "luis@example.com", 2, "2023-09-01", 15000.00);
