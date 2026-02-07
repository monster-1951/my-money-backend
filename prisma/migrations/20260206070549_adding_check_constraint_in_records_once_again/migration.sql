-- This is an empty migration.

ALTER TABLE "records"
ADD CONSTRAINT "check_category_to_be_null_if_transaction_type_is_transfer" CHECK ((type= '(.) Transfer' AND category IS NULL) OR (type <> '(.) Transfer' AND category IS NOT NULL))