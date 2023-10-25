------------------------------------------------------
----- Update User Group Balance trigger function -----
------------------------------------------------------

CREATE OR REPLACE FUNCTION update_user_group_balance()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW."groupId" IS NOT NULL THEN
        -- Update sender's balance in UserGroup (increment)
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


-------------------------------------------------------
---------- Update User Group Balance Trigger ----------
-------------------------------------------------------

CREATE OR REPLACE TRIGGER update_user_group_balance_trigger
AFTER INSERT ON "transactions"
FOR EACH ROW
EXECUTE FUNCTION update_user_group_balance();

