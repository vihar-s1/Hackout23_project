--------------------------------------------------------
--------- Update Recipient Balance trigger function ---------
--------------------------------------------------------

CREATE OR REPLACE FUNCTION update_recipient_balances()
RETURNS TRIGGER AS
$$
BEGIN
    -- Update reciever's balance (increment)
    -- since payer paid, the recipients "owes" to payer
    IF NEW."userEmail" IS NOT NULL THEN
        UPDATE users
        SET "net_balance" = "net_balance" - NEW."recieved_amount"
        WHERE "email" = NEW."userEmail";
    END IF;

    IF NEW."groupId" IS NOT NULL THEN
        -- Update reciever's balance in UserGroup (increment)
        IF NEW."payer_email" IS NOT NULL THEN
            UPDATE "UserGroup"
            SET "net_balance" = "net_balance" + NEW."amount"
            WHERE "userEmail" = NEW."payer_email" AND "groupId" = NEW."groupId";
        END IF;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

--------------------------------------------------------
-------------- Update Recipient Balance Trigger -------------
--------------------------------------------------------

CREATE OR REPLACE TRIGGER update_recipient_balances_trigger
AFTER INSERT ON "transactionRecipients"
FOR EACH ROW
EXECUTE FUNCTION update_recipient_balances();
