-- This is an empty migration.

ALTER TABLE "records" 
ADD CONSTRAINT "check_transferred_to_account_and_account_not_equal" CHECK ("account" <> "transferred_to_account")