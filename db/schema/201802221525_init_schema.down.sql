ALTER TABLE `Adverts` DROP FOREIGN KEY `Adverts_fk0`;

ALTER TABLE `Adverts` DROP FOREIGN KEY `Adverts_fk1`;

ALTER TABLE `Adverts` DROP FOREIGN KEY `Adverts_fk2`;

ALTER TABLE `Users` DROP FOREIGN KEY `Users_fk0`;

ALTER TABLE `Users` DROP FOREIGN KEY `Users_fk1`;

ALTER TABLE `Messages` DROP FOREIGN KEY `Messages_fk0`;

ALTER TABLE `Messages` DROP FOREIGN KEY `Messages_fk1`;

DROP TABLE IF EXISTS `Adverts`;

DROP TABLE IF EXISTS `Users`;

DROP TABLE IF EXISTS `Messages`;

DROP TABLE IF EXISTS `Countries`;

DROP TABLE IF EXISTS `States`;