START TRANSACTION;

DELETE FROM `Currencies`
WHERE
    `CurrencyCode` NOT IN ("EUR", "USD"); 


COMMIT;