CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS
$$
    -- Calculate the change in balance based on the transaction's sender and recipient
    DECLARE
        payment NUMERIC;
    BEGIN
        SELECT "amount" INTO payment
        FROM transactions
        WHERE "sender_email" = NEW."sender_email";

        -- Update sender's balance
        UPDATE users
        SET "net_balance" = net_balance + payment
        WHERE "email" = NEW."sender_email";

        -- Update recipient's balance
        UPDATE users
        SET "net_balance" = net_balance - payment
        WHERE "email" = NEW."recipient_email";

        RETURN NEW;
    END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE TRIGGER update_user_balance_trigger
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_balance();
