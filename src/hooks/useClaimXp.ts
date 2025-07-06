"use client";

import { useState, useCallback } from "react";

export interface UseClaimXpOptions {
  voterTokenHash?: string;
  currentXp?: number;
}

export function useClaimXp(options: UseClaimXpOptions = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { voterTokenHash, currentXp = 0 } = options;

  const openClaimModal = useCallback(() => {
    if (!voterTokenHash || currentXp === 0) {
      console.warn("Cannot claim XP: missing voter token or no XP to claim");
      return;
    }
    setIsModalOpen(true);
  }, [voterTokenHash, currentXp]);

  const closeClaimModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    openClaimModal,
    closeClaimModal,
    canClaim: Boolean(voterTokenHash && currentXp > 0),
  };
}