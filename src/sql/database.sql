CREATE TABLE Accounts (
	ID integer PRIMARY KEY AUTOINCREMENT,
	Name text,
	Email text,
	Password text,
	Pro tinyint default 0,
	Hex text default "#ff00ff"
);