import React from "react";
import { VfmLeaderboardDto } from "../../types";
import { VfmLeaderboardMobile } from "./VfmLeaderboardMobile";
import { VfmLeaderboardDesktop } from "./VfmLeaderboardDesktop";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  data: VfmLeaderboardDto[];
  initialMinScore?: number;
  onExecute?: (score: number) => void;
  isLoading?: boolean;
}

export const VfmLeaderboard: React.FC<Props> = ({ data, isLoading = false }) => {
  const isMobile = useIsMobile(768);

  return (
    <div className="relative w-full h-full bg-gray-950 text-gray-100 font-sans flex flex-col flex-1 touch-manipulation">
      {isLoading && (
        <div role="status" aria-live="polite" className="absolute inset-0 bg-gray-950/85 backdrop-blur-md z-30 flex items-center justify-center font-bold text-blue-400 text-sm">
          <span className="animate-pulse">Φόρτωση δεδομένων αγοράς...</span>
        </div>
      )}

      {isMobile ? <VfmLeaderboardMobile data={data} /> : <VfmLeaderboardDesktop data={data} />}
    </div>
  );
};
