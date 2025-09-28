-- PatientDB - table structures only (no SET commands)

-- DROP TABLEs (safe order)
DROP TABLE IF EXISTS `alergjia`;
DROP TABLE IF EXISTS `ankesa_analiza`;
DROP TABLE IF EXISTS `ankesaanaliza`;
DROP TABLE IF EXISTS `doktori`;
DROP TABLE IF EXISTS `infermieri`;
DROP TABLE IF EXISTS `kartela_vaksinimit`;
DROP TABLE IF EXISTS `kartelavaksinimit`;
DROP TABLE IF EXISTS `medikamente`;
DROP TABLE IF EXISTS `nderhyrje`;
DROP TABLE IF EXISTS `semundje_kronike`;
DROP TABLE IF EXISTS `semundjekronike`;
DROP TABLE IF EXISTS `vizitat`;
DROP TABLE IF EXISTS `pacienti`;
DROP TABLE IF EXISTS `vendbanimi`;
DROP TABLE IF EXISTS `users`;

-- Table: users
CREATE TABLE `users` (
  `UserID` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: vendbanimi
CREATE TABLE `vendbanimi` (
  `VendbanimiID` INT NOT NULL AUTO_INCREMENT,
  `emri` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`VendbanimiID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: pacienti
CREATE TABLE `pacienti` (
  `PacientiID` INT NOT NULL AUTO_INCREMENT,
  `NumriPersonal` BIGINT NOT NULL,
  `EmriMbiemri` VARCHAR(255) DEFAULT NULL,
  `Ditelindja` DATE DEFAULT NULL,
  `VendbanimiID` INT DEFAULT NULL,
  `gjinia` VARCHAR(255) NOT NULL,
  `SigurimShendetsor` TINYINT(1) DEFAULT NULL,
  `Alergji` TINYINT(1) DEFAULT NULL,
  `Nderhyrje` TINYINT(1) DEFAULT NULL,
  `SemundjeKronike` TINYINT(1) DEFAULT NULL,
  `AlergjiDetaje` VARCHAR(2000) DEFAULT NULL,
  `NderhyrjeDetaje` VARCHAR(2000) DEFAULT NULL,
  `SemundjeKronikeDetaje` VARCHAR(2000) DEFAULT NULL,
  PRIMARY KEY (`PacientiID`),
  UNIQUE KEY `NumriPersonal` (`NumriPersonal`),
  KEY `VendbanimiID` (`VendbanimiID`),
  CONSTRAINT `pacienti_ibfk_1` FOREIGN KEY (`VendbanimiID`) REFERENCES `vendbanimi` (`VendbanimiID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: doktori
CREATE TABLE `doktori` (
  `DoktoriID` BIGINT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(255) DEFAULT NULL,
  `Password` VARCHAR(255) DEFAULT NULL,
  `UserID` INT DEFAULT NULL,
  `EmriMbiemri` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`DoktoriID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `doktori_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: infermieri
CREATE TABLE `infermieri` (
  `InfermieriID` BIGINT NOT NULL AUTO_INCREMENT,
  `EmriMbiemri` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `Username` VARCHAR(255) NOT NULL,
  `UserID` BIGINT DEFAULT NULL,
  PRIMARY KEY (`InfermieriID`),
  UNIQUE KEY `UKd5miovtom9e1dhsqpwlc3keii` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: vizitat
CREATE TABLE `vizitat` (
  `VizitatID` BIGINT NOT NULL AUTO_INCREMENT,
  `Data` DATETIME DEFAULT NULL,
  `Pershkrimi` VARCHAR(1000) DEFAULT NULL,
  `DoktoriID` BIGINT NOT NULL,
  `PacientiID` BIGINT NOT NULL,
  PRIMARY KEY (`VizitatID`),
  KEY `FKkneasv20j2jsej1iqks6syjcr` (`DoktoriID`),
  CONSTRAINT `FKkneasv20j2jsej1iqks6syjcr` FOREIGN KEY (`DoktoriID`) REFERENCES `doktori` (`DoktoriID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: kartelavaksinimit
CREATE TABLE `kartelavaksinimit` (
  `KartelaVaksinimitID` BIGINT NOT NULL AUTO_INCREMENT,
  `PacientiID` INT DEFAULT NULL,
  `Pershkrimi` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`KartelaVaksinimitID`),
  KEY `kartelavaksinimit_ibfk_1` (`PacientiID`),
  CONSTRAINT `kartelavaksinimit_ibfk_1` FOREIGN KEY (`PacientiID`) REFERENCES `pacienti` (`PacientiID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: kartela_vaksinimit (legacy)
CREATE TABLE `kartela_vaksinimit` (
  `kartela_vaksinimitid` BIGINT NOT NULL AUTO_INCREMENT,
  `pershkrimi` VARCHAR(255) NOT NULL,
  `pacientiid` BIGINT NOT NULL,
  PRIMARY KEY (`kartela_vaksinimitid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: nderhyrje
CREATE TABLE `nderhyrje` (
  `nderhyrjeid` BIGINT NOT NULL AUTO_INCREMENT,
  `PacientiID` INT DEFAULT NULL,
  `pershkrimi` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`nderhyrjeid`),
  KEY `nderhyrje_ibfk_1` (`PacientiID`),
  CONSTRAINT `nderhyrje_ibfk_1` FOREIGN KEY (`PacientiID`) REFERENCES `pacienti` (`PacientiID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: alergjia
CREATE TABLE `alergjia` (
  `alergjiaid` BIGINT NOT NULL AUTO_INCREMENT,
  `PacientiID` INT NOT NULL,
  `pershkrimi` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`alergjiaid`),
  KEY `alergjia_ibfk_1` (`PacientiID`),
  CONSTRAINT `alergjia_ibfk_1` FOREIGN KEY (`PacientiID`) REFERENCES `pacienti` (`PacientiID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: medikamente
CREATE TABLE `medikamente` (
  `medikamenteid` BIGINT NOT NULL AUTO_INCREMENT,
  `PacientiID` INT DEFAULT NULL,
  `pershkrimi` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`medikamenteid`),
  KEY `medikamente_ibfk_1` (`PacientiID`),
  CONSTRAINT `medikamente_ibfk_1` FOREIGN KEY (`PacientiID`) REFERENCES `pacienti` (`PacientiID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: semundjekronike
CREATE TABLE `semundjekronike` (
  `SemundjeKronikeID` BIGINT NOT NULL AUTO_INCREMENT,
  `PacientiID` INT DEFAULT NULL,
  `Pershkrimi` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`SemundjeKronikeID`),
  KEY `semundjekronike_ibfk_1` (`PacientiID`),
  CONSTRAINT `semundjekronike_ibfk_1` FOREIGN KEY (`PacientiID`) REFERENCES `pacienti` (`PacientiID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: semundje_kronike (legacy)
CREATE TABLE `semundje_kronike` (
  `semundje_kronikeid` BIGINT NOT NULL AUTO_INCREMENT,
  `pershkrimi` VARCHAR(255) NOT NULL,
  `pacientiid` BIGINT NOT NULL,
  PRIMARY KEY (`semundje_kronikeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: ankesaanaliza
CREATE TABLE `ankesaanaliza` (
  `AnkesaAnalizaID` BIGINT NOT NULL AUTO_INCREMENT,
  `PacientiID` INT DEFAULT NULL,
  `Pershkrimi` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`AnkesaAnalizaID`),
  KEY `ankesaanaliza_ibfk_1` (`PacientiID`),
  CONSTRAINT `ankesaanaliza_ibfk_1` FOREIGN KEY (`PacientiID`) REFERENCES `pacienti` (`PacientiID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table: ankesa_analiza (legacy)
CREATE TABLE `ankesa_analiza` (
  `ankesa_analizaid` BIGINT NOT NULL AUTO_INCREMENT,
  `pershkrimi` VARCHAR(255) NOT NULL,
  `pacientiid` BIGINT NOT NULL,
  PRIMARY KEY (`ankesa_analizaid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP VIEW IF EXISTS VizitaFundit;
CREATE OR REPLACE VIEW VizitaFundit AS
SELECT VizitatID,
    PacientiID,
    EmriMbiemri AS PacientEmriMbiemri,
    DoktoriID,
    DoktorEmriMbiemri,
    Data,
    Pershkrimi
FROM (
    SELECT v.VizitatID,
      v.PacientiID,
      p.EmriMbiemri,
      v.DoktoriID,
      CONCAT(
        UPPER(LEFT(SUBSTRING_INDEX(d.Username, '.', 1), 1)),
        LOWER(SUBSTRING(SUBSTRING_INDEX(d.Username, '.', 1), 2)),
        ' ',
        UPPER(LEFT(SUBSTRING_INDEX(d.Username, '.', -1), 1)),
        LOWER(SUBSTRING(SUBSTRING_INDEX(d.Username, '.', -1), 2))
      ) AS DoktorEmriMbiemri,
          DATE(v.Data) AS Data,
          v.Pershkrimi,
          ROW_NUMBER() OVER (PARTITION BY v.PacientiID ORDER BY v.Data DESC, v.VizitatID DESC) AS rn
    FROM Vizitat v
    JOIN Pacienti p ON v.PacientiID = p.PacientiID
    JOIN Doktori d ON v.DoktoriID = d.DoktoriID
) t
WHERE t.rn = 1;


--extra
CREATE table if not exists Planet232470151 (
	planet232470151_id BIGINT auto_increment primary key,
    name VARCHAR(255),
    type VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS Satellite232470151 (
	satellite232470151_id BIGINT auto_increment primary key,
    name VARCHAR(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    planet_id BIGINT,
    CONSTRAINT fk_planet_232470151 FOREIGN KEY (planet_id) references Planet232470151(planet232470151_id)
)