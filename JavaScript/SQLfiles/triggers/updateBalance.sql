-------------------------------------------------
---------- Update User Balance Trigger ----------
-------------------------------------------------

CREATE OR REPLACE TRIGGER update_user_balances_trigger
AFTER INSERT ON "transactions"
FOR EACH ROW
EXECUTE FUNCTION update_user_balances();


-------------------------------------------------------
---------- Update User Group Balance Trigger ----------
-------------------------------------------------------

CREATE OR REPLACE TRIGGER update_user_group_balance_trigger
AFTER INSERT ON "transactions"
FOR EACH ROW
EXECUTE FUNCTION update_user_group_balance();

