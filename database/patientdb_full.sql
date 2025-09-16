-- Database: PatientDB

CREATE DATABASE IF NOT EXISTS PatientDB;
USE PatientDB;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY
);

-- Doktori Table
CREATE TABLE IF NOT EXISTS Doktori (
    DoktoriID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255),
    Password VARCHAR(255),
    EmriMbiemri VARCHAR(255),
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Infermieri Table
CREATE TABLE IF NOT EXISTS Infermieri (
    InfermieriID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255),
    Password VARCHAR(255),
    EmriMbiemri VARCHAR(255),
    UserID INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Vendbanimi Table
CREATE TABLE IF NOT EXISTS vendbanimi (
    VendbanimiID INT AUTO_INCREMENT PRIMARY KEY,
    Emri VARCHAR(50) NOT NULL
);

-- Pacienti Table
CREATE TABLE IF NOT EXISTS Pacienti (
    PacientiID INT AUTO_INCREMENT PRIMARY KEY,
    NumriPersonal BIGINT NOT NULL UNIQUE,
    EmriMbiemri VARCHAR(255) NOT NULL,
    Ditelindja DATE NOT NULL,
    VendbanimiID INT NOT NULL,
    Gjinia VARCHAR(10) NOT NULL,
    SigurimShendetsor BOOLEAN NOT NULL,
    Alergji BOOLEAN,
    Nderhyrje BOOLEAN,
    SemundjeKronike BOOLEAN,
    FOREIGN KEY (VendbanimiID) REFERENCES vendbanimi(VendbanimiID)
);

-- KartelaVaksinimit Table
CREATE TABLE IF NOT EXISTS KartelaVaksinimit (
    KartelaVaksinimitID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PacientiID INT,
    Pershkrimi TEXT,
    FOREIGN KEY (PacientiID) REFERENCES Pacienti(PacientiID) ON DELETE CASCADE
);

-- Alergjia Table
CREATE TABLE IF NOT EXISTS Alergjia (
    AlergjiaID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PacientiID INT,
    Pershkrimi TEXT,
    FOREIGN KEY (PacientiID) REFERENCES Pacienti(PacientiID) ON DELETE CASCADE
);

-- Nderhyrje Table
CREATE TABLE IF NOT EXISTS Nderhyrje (
    NderhyrjeID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PacientiID INT,
    Pershkrimi TEXT,
    FOREIGN KEY (PacientiID) REFERENCES Pacienti(PacientiID) ON DELETE CASCADE
);

-- SemundjeKronike Table
CREATE TABLE IF NOT EXISTS SemundjeKronike (
    SemundjeKronikeID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PacientiID INT,
    Pershkrimi TEXT,
    FOREIGN KEY (PacientiID) REFERENCES Pacienti(PacientiID) ON DELETE CASCADE
);

-- Medikamente Table
CREATE TABLE IF NOT EXISTS Medikamente (
    MedikamenteID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PacientiID INT,
    Pershkrimi TEXT,
    FOREIGN KEY (PacientiID) REFERENCES Pacienti(PacientiID) ON DELETE CASCADE
);

-- AnkesaAnaliza Table
CREATE TABLE IF NOT EXISTS AnkesaAnaliza (
    AnkesaAnalizaID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PacientiID INT,
    Pershkrimi TEXT,
    FOREIGN KEY (PacientiID) REFERENCES Pacienti(PacientiID) ON DELETE CASCADE
);

-- Vizitat Table
CREATE TABLE IF NOT EXISTS Vizitat (
    VizitatID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PacientiID INT,
    DoktoriID INT,
    Data DATETIME,
    Pershkrimi TEXT,
    FOREIGN KEY (PacientiID) REFERENCES Pacienti(PacientiID) ON DELETE CASCADE,
    FOREIGN KEY (DoktoriID) REFERENCES Doktori(DoktoriID)
);

-- Insert default vendbanimi values
INSERT INTO vendbanimi (Emri) VALUES
('Prishtinë'),('Prizren'),('Pejë'),('Mitrovicë'),('Gjakovë'),('Ferizaj'),('Gjilan'),('Rahovec');

-- View for last visit
CREATE OR REPLACE VIEW VizitaFundit AS
SELECT
    v.VizitatID,
    v.PacientiID,
    p.EmriMbiemri AS PacientEmriMbiemri,
    v.DoktoriID,
    CONCAT(
        UPPER(LEFT(SUBSTRING_INDEX(d.Username, '.', 1), 1)),
        LOWER(SUBSTRING(SUBSTRING_INDEX(d.Username, '.', 1), 2)),
        ' ',
        UPPER(LEFT(SUBSTRING_INDEX(d.Username, '.', -1), 1)),
        LOWER(SUBSTRING(SUBSTRING_INDEX(d.Username, '.', -1), 2))
    ) AS DoktorEmriMbiemri,
    v.Data,
    v.Pershkrimi
FROM Vizitat v
JOIN Pacienti p ON v.PacientiID = p.PacientiID
JOIN Doktori d ON v.DoktoriID = d.DoktoriID
WHERE v.Data = (
    SELECT MAX(v2.Data)
    FROM Vizitat v2
    WHERE v2.PacientiID = v.PacientiID
);
