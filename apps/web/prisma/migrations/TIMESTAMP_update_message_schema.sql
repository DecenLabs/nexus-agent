-- First, create a temporary column
ALTER TABLE "messages" ADD COLUMN "temp_content" TEXT;

-- Copy data from text to content
UPDATE "messages" SET "temp_content" = "text";

-- Drop the old column
ALTER TABLE "messages" DROP COLUMN "text";

-- Rename the new column
ALTER TABLE "messages" RENAME COLUMN "temp_content" TO "content";

-- Make the column required
ALTER TABLE "messages" ALTER COLUMN "content" SET NOT NULL; 