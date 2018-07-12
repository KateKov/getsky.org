START TRANSACTION;

ALTER TABLE Currencies
	ADD COLUMN CountryCode VARCHAR(20) COLLATE utf8_unicode_ci;

ALTER TABLE Currencies
	ADD CONSTRAINT `Currencies_countries_fk` FOREIGN KEY (`CountryCode`) REFERENCES `Countries` (`Code`);

COMMIT;
