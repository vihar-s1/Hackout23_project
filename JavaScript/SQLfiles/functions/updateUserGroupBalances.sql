-------------------------------------------------------
-------- Update User Group Balances trigger function --------
-------------------------------------------------------

CREATE OR REPLACE FUNCTION update_user_group_balance()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW."groupId" IS NOT NULL THEN
        -- Update sender's bawlance in UserGroup (increment)
        IF NEW."sender_email" IS NOT NULL THEN
            UPDATE "UserGroup"
            SET "net_balance" = "net_balance" + NEW."amount"
            WHERE "userEmail" = NEW."sender_email" AND "groupId" = NEW."groupId";
        END IF;

        -- Update recipients' balances in UserGroup (decrement)
        UPDATE "UserGroup" ug
        SET "net_balance" = ug."net_balance" - NEW."amount"
        FROM "transactionRecipients" tr
        WHERE ug."userEmail" = tr."userEmail" AND ug."groupId" = NEW."groupId" AND tr."transactionId" = NEW."id";
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;