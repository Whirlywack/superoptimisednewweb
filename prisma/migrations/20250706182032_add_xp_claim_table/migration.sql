-- CreateTable
CREATE TABLE "xp_claims" (
    "id" TEXT NOT NULL,
    "voter_token_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "claim_token" TEXT NOT NULL,
    "total_xp" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "claimed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "xp_claims_claim_token_key" ON "xp_claims"("claim_token");

-- AddForeignKey
ALTER TABLE "xp_claims" ADD CONSTRAINT "xp_claims_voter_token_id_fkey" FOREIGN KEY ("voter_token_id") REFERENCES "voter_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
