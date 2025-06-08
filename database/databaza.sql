
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
    EmriMbiemri varchar(255),
    Foreign key(UserID) references Users(UserID)
);

create table Infermieri (
	InfermieriID int auto_increment Primary key,
    Username varchar(255),
    Password Varchar(255),
    UserID int,
    EmriMbiemri varchar(255), 
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