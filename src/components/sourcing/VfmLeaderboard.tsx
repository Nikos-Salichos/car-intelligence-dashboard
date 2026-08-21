import React, { useEffect, useState } from "react";
import { VfmLeaderboardDto } from "../../types";
import { VfmLeaderboardMobile } from "./VfmLeaderboardMobile";
import { VfmLeaderboardDesktop } from "./VfmLeaderboardDesktop";

interface Props {
  data: VfmLeaderboardDto[];
  initialMinScore?: number;
  onExecute?: (score: number) => void;
  isLoading?: boolean;
}

// English Comment: Hook to detect viewport width
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined"
      ? window.innerWidth < breakpoint
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const handler = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);

    return () => {
      mql.removeEventListener("change", handler);
    };
  }, [breakpoint]);

  return isMobile;
};

export const VfmLeaderboard: React.FC<Props> = ({
  data,
  isLoading = false,
}) => {
  const isMobile = useIsMobile(768);

  return (
    <div className="relative w-full h-full bg-gray-950 text-gray-100 font-sans flex flex-col flex-1 touch-manipulation">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-950/85 backdrop-blur-md z-30 flex items-center justify-center font-bold text-blue-400 text-sm">
          <span className="animate-pulse">
            Loading market data...
          </span>
        </div>
      )}

      {isMobile ? (
        <VfmLeaderboardMobile data={data} />
      ) : (
        <VfmLeaderboardDesktop data={data} />
      )}
    </div>
  );
};