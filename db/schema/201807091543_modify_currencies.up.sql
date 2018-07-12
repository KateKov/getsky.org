START TRANSACTION;

ALTER TABLE Currencies
	DROP FOREIGN KEY `Currencies_countries_fk`;

ALTER TABLE Currencies
	DROP COLUMN CountryCode;

COMMIT;
