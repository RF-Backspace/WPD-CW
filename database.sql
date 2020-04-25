CREATE DATABASE IF NOT EXISTS courseworkschedulingapp;
USE courseworkschedulingapp;
CREATE TABLE students (
	studentid int AUTO_INCREMENT,
	username varchar(20),
	fullname varchar(30),
	password varchar(128),
	PRIMARY KEY (studentid)
);
