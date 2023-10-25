--------------------------------------------------------
--------- Update User Balance trigger function ---------
--------------------------------------------------------

CREATE OR REPLACE FUNCTION update_user_balances()
RETURNS TRIGGER AS
$$
BEGIN
    -- Update payer's balance (increment)
    -- since payer paid, the recipients owes to payer
    IF NEW."payer_email" IS NOT NULL THEN
        UPDATE users
        SET "net_balance" = "net_balance" + NEW."amount"
        WHERE "email" = NEW."payer_email";
    END IF;
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
