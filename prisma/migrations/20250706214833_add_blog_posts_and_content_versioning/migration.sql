-- AlterTable
ALTER TABLE "content_blocks" ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "content_versions" (
    "id" TEXT NOT NULL,
    "content_block_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "change_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_content_block_id_version_key" ON "content_versions"("content_block_id", "version");

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_content_block_id_fkey" FOREIGN KEY ("content_block_id") REFERENCES "content_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
