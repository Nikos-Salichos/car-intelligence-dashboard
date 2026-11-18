import React from "react";
import { Link, useParams } from "react-router-dom";
import { reportsApi } from "../api/reports";
import { useApi } from "../hooks/useApi";
import { ListingBrief } from "../components/brief/ListingBrief";
import { Page } from "../components/layout/Page";
import { Loading, Notice } from "../components/ui/Feedback";

/** The negotiation brief of one listing. A 404 here means "this listing cannot be evaluated", which the server explains in Greek. */
export const ListingBriefPage: React.FC = () => {
  const { listingId = "" } = useParams<{ listingId: string }>();
  const { data, error, loading } = useApi(() => reportsApi.listingBrief(listingId), listingId, "Δεν ήταν δυνατή η φόρτωση της αγγελίας.");

  return (
    <Page narrow>
      {loading && <Loading text="Φόρτωση φακέλου διαπραγμάτευσης..." />}
      {error && (
        <Notice tone="danger">
          {error} <Link to="/opportunities" className="underline">Πίσω στις ευκαιρίες</Link>
        </Notice>
      )}
      {data && !loading && <ListingBrief brief={data} />}
    </Page>
  );
};

export default ListingBriefPage;
