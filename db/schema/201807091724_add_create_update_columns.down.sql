START TRANSACTION;

ALTER TABLE Adverts
	DROP COLUMN UpdatedAt;

ALTER TABLE Countries
	DROP COLUMN CreatedAt,
	DROP COLUMN UpdatedAt;

ALTER TABLE Currencies
	DROP COLUMN CreatedAt,
	DROP COLUMN UpdatedAt;

ALTER TABLE Messages
	DROP COLUMN UpdatedAt;

ALTER TABLE States
	DROP COLUMN CreatedAt,
	DROP COLUMN UpdatedAt;

ALTER TABLE Users
	DROP COLUMN CreatedAt,
	DROP COLUMN UpdatedAt;

COMMIT;
