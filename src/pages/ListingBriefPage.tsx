import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { dashboardApi } from "../api/dashboardApi";
import { useTokenRefreshOnActivity } from "../hooks/useTokenRefreshOnActivity";
import { ListingBrief } from "../components/brief/ListingBrief";
import { NegotiationBriefDto } from "../types";

export const ListingBriefPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const [brief, setBrief] = useState<NegotiationBriefDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useTokenRefreshOnActivity();

  useEffect(() => {
    if (!listingId) return;
    let cancelled = false;
    // No retry on purpose: a 404 means "this listing can't be evaluated", asking again won't change that.
    dashboardApi
      .getListingBrief(listingId)
      .then((data) => !cancelled && (setBrief(data), setError(null)))
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = axios.isAxiosError(err) ? (err.response?.data as { message?: string } | undefined)?.message : undefined;
        setError(message ?? "Δεν ήταν δυνατή η φόρτωση της αγγελίας.");
      });
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  return (
    <div className="p-6 bg-gray-950 min-h-screen w-full flex-1 flex flex-col">
      {error && (
        <div role="alert" className="max-w-4xl mx-auto w-full p-3 bg-red-950/40 border border-red-900/60 text-red-400 rounded-lg text-xs font-medium">
          {error} <Link to="/vfmdashboard" className="underline">Πίσω στη λίστα</Link>
        </div>
      )}
      {!brief && !error && <div className="text-sm text-blue-400 animate-pulse text-center">Φόρτωση φακέλου διαπραγμάτευσης...</div>}
      {brief && <ListingBrief brief={brief} />}
    </div>
  );
};

export default ListingBriefPage;
