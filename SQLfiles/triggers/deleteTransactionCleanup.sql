--------------------------------------------------------------
---- Update User Balance on Deleting Transaction: TRIGGER ----
--------------------------------------------------------------

CREATE OR REPLACE FUNCTION delete_transaction_cleanup()
RETURNS TRIGGER AS
$$
DECLARE
    amountDivision float;
BEGIN
    -- Deduct from User's Balance
    UPDATE users
    SET "net_balance" = "net_balance" - OLD."amount"
    WHERE "email" = OLD."payer_email";

    amountDivision = OLD."amount" / (SELECT DISTINCT COUNT() FROM transactionRecipients WHERE "transactionId" = OLD.id); 

    -- Increase Recipient's Balance
    UPDATE users
    SET "net_balance" = "net_balance" + amountDivision
    WHERE "email" in (SELECT "userEmail" FROM transactionRecipients WHERE "transactionId" = OLD.id)
END
$$
LANGUAGE plpgsql;

---------------------------------------------------------------
---- Update User Balance on Deleting Transaction: FUNCTION ----
---------------------------------------------------------------

CREATE OR REPLACE TRIGGER delete_transaction_cleanup_trigger
AFTER DELETE ON "transactions"
FOR EACH ROW
EXECUTE FUNCTION delete_transaction_cleanup();
