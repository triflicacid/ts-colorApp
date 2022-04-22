CREATE TABLE Accounts (
	ID integer PRIMARY KEY AUTOINCREMENT,
	Name text,
	Email text,
	Password text,
	Pro tinyint default 0,
	Hex text default "#ff00ff"
);

CREATE TABLE Colors (
	ID integer PRIMARY KEY AUTOINCREMENT,
	AccountID integer,
	PaletteID integer default null,
	Name text,
	Hex text
);

CREATE TABLE Palettes (
	ID integer PRIMARY KEY AUTOINCREMENT,
	AccountID integer,
	Name text
);