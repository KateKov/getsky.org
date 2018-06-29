CREATE TABLE `Currencies` (
  `CountryCode` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `CurrencyCode` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`CountryCode`),
  KEY `Currencies_countries_fk` (`CountryCode`),
  CONSTRAINT `Currencies_countries_fk` FOREIGN KEY (`CountryCode`) REFERENCES `Countries` (`Code`)
);

INSERT INTO `Currencies` (`CountryCode`, `CurrencyCode`)
VALUES 	("US", "USD"), 
		("FR", "EUR");
