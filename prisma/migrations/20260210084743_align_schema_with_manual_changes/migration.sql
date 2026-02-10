/* =========================
   1. Fix enum record_type
   ========================= */

ALTER TYPE record_type RENAME VALUE '(+) Income' TO 'Income';
ALTER TYPE record_type RENAME VALUE '(-) Expense' TO 'Expense';
ALTER TYPE record_type RENAME VALUE '(.) Transfer' TO 'Transfer';


/* =========================
   2. Fix CHECK constraint on records
   ========================= */

ALTER TABLE records
DROP CONSTRAINT IF EXISTS check_category_to_be_null_if_transaction_type_is_transfer;

ALTER TABLE records
ADD CONSTRAINT check_category_to_be_null_if_transaction_type_is_transfer
CHECK (
  type = 'Transfer' AND category IS NULL
  OR
  type <> 'Transfer' AND category IS NOT NULL
);


/* =========================
   3. Trigger function for category vs record type consistency
   ========================= */

CREATE OR REPLACE FUNCTION check_category_type_record_type()
RETURNS trigger AS $$
DECLARE
  cat_type category_type;
BEGIN
  IF NEW.type <> 'Transfer' THEN
    SELECT c.category_type
    INTO cat_type
    FROM categories c
    WHERE c.id = NEW.category;

    IF cat_type::text <> NEW.type::text THEN
      RAISE EXCEPTION 'Invalid category!';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


/* =========================
   4. Trigger on records
   ========================= */

DROP TRIGGER IF EXISTS check_category_type_consistency_with_record_type ON records;

CREATE TRIGGER check_category_type_consistency_with_record_type
BEFORE INSERT OR UPDATE
ON records
FOR EACH ROW
EXECUTE FUNCTION check_category_type_record_type();


/* =========================
   5. Icons table
   ========================= */

CREATE TABLE IF NOT EXISTS icons (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT
);


/* =========================
   6. Add icon column + FK to categories
   ========================= */

ALTER TABLE categories
ADD COLUMN icon BIGINT;

ALTER TABLE categories
ADD CONSTRAINT fk_categories_icons
FOREIGN KEY (icon) REFERENCES icons(id);


/* =========================
   7. Enforce NOT NULL on icon
   ========================= */

ALTER TABLE categories
ALTER COLUMN icon SET NOT NULL;
