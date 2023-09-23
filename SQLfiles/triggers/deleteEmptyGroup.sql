-------------------------------------------------------
--------- Delete Empty Group Trigger Function ---------
-------------------------------------------------------

CREATE OR REPLACE FUNCTION delete_empty_group()
RETURNS TRIGGER AS 
$$
BEGIN
    DELETE FROM "groups"
    WHERE id = OLD."groupId"
    AND NOT EXISTS (
        SELECT 1 FROM "userGroups"
        WHERE "groupId" = OLD."groupId"
        AND "userEmail" <> OLD."userEmail"
    );
    RETURN OLD;
END;
$$ 
LANGUAGE plpgsql;

-------------------------------------------------
----------- Delete Empty Group Trigger ----------
-------------------------------------------------

CREATE OR REPLACE TRIGGER delete_empty_group_trigger
AFTER DELETE ON "userGroups"
FOR EACH ROW
EXECUTE FUNCTION delete_empty_group();
