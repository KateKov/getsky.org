ALTER TABLE Adverts
	ADD UpdatedAt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE Countries
	ADD CreatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	ADD UpdatedAt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE Currencies
	ADD CreatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	ADD UpdatedAt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE Messages
	ADD UpdatedAt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE States
	ADD CreatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	ADD UpdatedAt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE Users
	ADD CreatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	ADD UpdatedAt timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP;