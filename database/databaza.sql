
create database PatientDB

use PatientDB;

create table Users (
	UserID  int auto_increment primary key
);

create table Doktori (
	DoktoriID int auto_increment primary key,
    Username varchar(255),
    Password varchar(255),
    UserID int,
    Foreign key(UserID) references Users(UserID)
);

create table Infermieri (
	InfermieriID int auto_increment Primary key,
    Username varchar(255),
    Password Varchar(255),
    UserID int, 
    foreign key(UserID) references Users(UserID)
);

create table vendbanimi(
	VendbanimiID int auto_increment primary key,
    Emri varchar(50) not null
);

insert into vendbanimi (Emri) values
('Prishtinë'),('Prizren'),('Pejë'),('Mitrovicë'),('Gjakovë'),('Ferizaj'),('Gjilan'),('Rahovec');

create table Pacienti (
	PacientiID int auto_increment primary key,
    NumriPersonal BIGINT NOT NULL UNIQUE,
    EmriMbiemri varchar(255),
    Ditelindja Date,
    VendbanimiID int,
    foreign key (VendbanimiID) references vendbanimi(VendbanimiID),
    Gjinia Varchar(10),
    SigurimShendetsor Boolean,
    Alergji boolean,
    Nderhyrje boolean,
    SemundjeKronike boolean
);

create table KartelaVaksinimit(
	KartelaVaksinimitID int auto_increment primary key,
    PacientiID int,
    Pershkrimi text,
    Foreign Key (PacientiID) references Pacienti (PacientiID)
);

create table Alergjia(
	AlergjiaID int auto_increment primary key,
    PacientiID int,
    Pershkrimi text,
    Foreign Key (PacientiID) references Pacienti (PacientiID)
);

create table Nderhyrje(
	NderhyrjeID int auto_increment primary key,
    PacientiID int,
    Pershkrimi text,
    Foreign Key (PacientiID) references Pacienti (PacientiID)
);

create table SemundjeKronike(
	SemundjeKronikeID int auto_increment primary key,
    PacientiID int,
    Pershkrimi text,
    Foreign Key (PacientiID) references Pacienti (PacientiID)
);

create table Medikamente(
	MedikamenteID int auto_increment primary key,
    PacientiID int,
    Pershkrimi text,
    Foreign Key (PacientiID) references Pacienti (PacientiID)
);

create table AnkesaAnaliza(
	AnkesaAnalizaID int auto_increment primary key,
    PacientiID int,
    Pershkrimi text,
    Foreign Key (PacientiID) references Pacienti (PacientiID)
);

create table Vizitat (
	VizitatID int auto_increment primary key,
    PacientiID int,
    DoktoriID int,
    Data datetime,
    Pershkrimi Text,
    foreign key (PacientiID) references Pacienti(PacientiID),
    foreign key (DoktoriID) references Doktori(DoktoriID)
);

CREATE OR REPLACE VIEW VizitaFundit AS
SELECT
    v.VizitatID,
    v.PacientiID,
    p.EmriMbiemri AS PacientEmriMbiemri,
    v.DoktoriID,
    -- Convert username to "Firstname Lastname"
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

-- Add EmriMbiemri to Doktori
ALTER TABLE Doktori
ADD COLUMN EmriMbiemri VARCHAR(255);

-- Add EmriMbiemri to Infermieri
ALTER TABLE Infermieri
ADD COLUMN EmriMbiemri VARCHAR(255);

select *
from pacienti

select *
From vizitat

select *
from doktori

select * from infermieri

select * from users

select *
from Nderhyrje
select *
from Alergjia
select *
from KartelaVaksinimit
select *
from SemundjeKronike
select * 
from Medikamente
select *
from AnkesaAnaliza
describe Alergjia


SELECT * FROM alergjia WHERE PacientiID = 11;

ALTER TABLE alergjia
DROP FOREIGN KEY PacientiID,
ADD CONSTRAINT PacientiID
  FOREIGN KEY (PacientiID) REFERENCES Pacienti(PacientiID)
  ON DELETE CASCADE;


SHOW CREATE TABLE Alergjia;
SHOW CREATE TABLE Nderhyrje;
SHOW CREATE TABLE KartelaVaksinimit;
SHOW CREATE TABLE SemundjeKronike;
SHOW CREATE TABLE Medikamente;
SHOW CREATE TABLE AnkesaAnaliza;
SHOW CREATE TABLE Vizitat;

ALTER TABLE vizitat
DROP FOREIGN KEY vizitat_ibfk_1;

ALTER TABLE vizitat
ADD CONSTRAINT vizitat_ibfk_1
  FOREIGN KEY (PacientiID) REFERENCES pacienti(PacientiID)
  ON DELETE CASCADE;