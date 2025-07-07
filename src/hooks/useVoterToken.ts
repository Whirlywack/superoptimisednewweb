"use client";

import { useState, useEffect } from "react";

export function useVoterToken() {
  const [voterToken, setVoterToken] = useState<string | null>(null);
  const [voterTokenId, setVoterTokenId] = useState<string | null>(null);

  useEffect(() => {
    // For now, check if there's a voter token in localStorage
    // In a full implementation, this would come from cookies or session storage
    const token = localStorage.getItem("voterToken");
    const tokenId = localStorage.getItem("voterTokenId");

    setVoterToken(token);
    setVoterTokenId(tokenId);
  }, []);

  return {
    voterToken,
    voterTokenId,
    hasVoterToken: Boolean(voterToken || voterTokenId),
  };
}
