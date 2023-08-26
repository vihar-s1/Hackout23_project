CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate the change in balance based on the transaction's sender and recipient
    DECLARE
        sender_balance_change NUMERIC;
        recipient_balance_change NUMERIC;
    BEGIN
        SELECT amount INTO sender_balance_change
        FROM transactions
        WHERE id = NEW.transaction_id;

        SELECT amount INTO recipient_balance_change
        FROM transactions
        WHERE id = NEW.transaction_id;

        -- Update sender's balance
        UPDATE users
        SET net_balance = net_balance - sender_balance_change
        WHERE id = NEW.sender_id;

        -- Update recipient's balance
        UPDATE users
        SET net_balance = net_balance + recipient_balance_change
        WHERE id = NEW.recipient_id;

        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_user_balance_trigger
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_user_balance();
