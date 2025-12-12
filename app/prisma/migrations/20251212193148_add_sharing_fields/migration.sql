-- Add sharing and publishing fields to Deck table
ALTER TABLE "Deck" ADD COLUMN "shareToken" TEXT;
ALTER TABLE "Deck" ADD COLUMN "publishedContent" TEXT;
ALTER TABLE "Deck" ADD COLUMN "publishedTheme" TEXT;
ALTER TABLE "Deck" ADD COLUMN "publishedAt" TIMESTAMP(3);

-- Add unique constraint for shareToken
CREATE UNIQUE INDEX "Deck_shareToken_key" ON "Deck"("shareToken");

-- Add index for shareToken lookups
CREATE INDEX "Deck_shareToken_idx" ON "Deck"("shareToken");
