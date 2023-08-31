--------------------------------------------------------
--------- Update User Balance trigger function ---------
--------------------------------------------------------

CREATE OR REPLACE FUNCTION update_user_balances()
RETURNS TRIGGER AS
$$
BEGIN
    -- Update sender's balance (increment)
    IF NEW."sender_email" IS NOT NULL THEN
        UPDATE users
        SET "net_balance" = "net_balance" + NEW."amount"
        WHERE "email" = NEW."sender_email";
    END IF;

    -- Update recipients' balances (decrement)
    UPDATE users u
    SET "net_balance" = u."net_balance" - NEW."amount"
    FROM transactionRecipients tr
    WHERE u."email" = tr."userEmail" AND tr."transactionId" = NEW."id";

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

--------------------------------------------------------
-------------- Update User Balance Trigger -------------
--------------------------------------------------------

CREATE OR REPLACE TRIGGER update_user_balances_trigger
AFTER INSERT ON "transactions"
FOR EACH ROW
EXECUTE FUNCTION update_user_balances();
