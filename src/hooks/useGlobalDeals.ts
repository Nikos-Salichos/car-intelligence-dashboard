// ==========================================
// File: useGlobalDeals.ts
// ==========================================

import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";

export interface GlobalDealDto {
  listingUrl: string;
  brand: string;
  model: string;
  price: number;
  mileage: number;
  engineCc: number;
  sellerType: string;
  fuelType: string;
  addressSeller: string;
  vfmScore: number;
}

export const useGlobalDeals = () => {
  const [rawDeals, setRawDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination parameters
  const [page, _setPage] = useState<number>(1);

  // Page size parameters (Draft vs Applied on Execute - limited to 50)
  const [pageSizeInput, setPageSizeInput] = useState<number>(100);
  const [appliedPageSize, setAppliedPageSize] = useState<number>(100);

  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  const [mileageSort, setMileageSort] = useState<"asc" | "desc" | null>(null);

  // Column-specific filter states
  const [brandFilter, setBrandFilter] = useState<string>("");
  const [modelFilter, setModelFilter] = useState<string>("");
  const [listingUrlFilter, setListingUrlFilter] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [maxMileage, setMaxMileage] = useState<string>("");
  const [fuelFilter, setFuelFilter] = useState<string>("");
  const [minVfm, setMinVfm] = useState<number>(0);

  const setPage = (newPage: number) => {
    const safe = Math.max(1, newPage);
    _setPage(safe);
  };

  // Execute page size adjustments to backend
  const execute = () => {
    const clampedSize = Math.max(1, Math.min(50, pageSizeInput));

    setPageSizeInput(clampedSize);
    setAppliedPageSize(clampedSize);

    _setPage(1);
  };

  // Re-fetch when page index or page size is executed
  useEffect(() => {
    let isMounted = true;

    const fetchDeals = async () => {
      setLoading(true);

      try {
        const response = await dashboardApi.getGlobalDeals(
          page,
          appliedPageSize
        );

        if (!isMounted) return;

        const records =
          response && Array.isArray(response.data)
            ? response.data
            : [];

        setRawDeals(records);

        setError(null);
      } catch (err: unknown) {
        if (!isMounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch global deals."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDeals();

    return () => {
      isMounted = false;
    };
  }, [page, appliedPageSize]);

  // Normalize mixed casing from backend payload safely
  const transformedDeals: GlobalDealDto[] = rawDeals.map((deal) => {
    const rawVfm = deal.vfmScore ?? deal.VfmScore ?? 0;

    return {
      listingUrl:
        deal.listingUrl ??
        deal.ListingUrl ??
        "",

      brand:
        deal.brand ??
        deal.Brand ??
        "",

      model:
        deal.model ??
        deal.Model ??
        "",

      price:
        deal.price ??
        deal.Price ??
        0,

      mileage:
        deal.mileage ??
        deal.Mileage ??
        0,

      engineCc:
        deal.engineCc ??
        deal.EngineCc ??
        0,

      sellerType:
        deal.sellerType ??
        deal.SellerType ??
        "",

      fuelType:
        deal.fuelType ??
        deal.FuelType ??
        "",

      addressSeller:
        deal.addressSeller ??
        deal.AddressSeller ??
        "",

      vfmScore: Math.round(rawVfm * 50),
    };
  });

  const filteredDeals = transformedDeals
    .filter((deal) => {
      // 1. Brand Filter
      const searchBrand = brandFilter.trim().toLowerCase();

      if (searchBrand.length > 0) {
        const dealBrand = String(deal.brand).toLowerCase();

        if (!dealBrand.includes(searchBrand)) {
          return false;
        }
      }

      // 2. Model Filter
      const searchModel = modelFilter.trim().toLowerCase();

      if (searchModel.length > 0) {
        const dealModel = String(deal.model).toLowerCase();

        if (!dealModel.includes(searchModel)) {
          return false;
        }
      }

      // 3.ListingUrl
      const searchUrl = listingUrlFilter.trim().toLowerCase();

      if (searchUrl.length > 0) {
        const dealUrl = String(deal.listingUrl).toLowerCase();

        if (!dealUrl.includes(searchUrl)) {
          return false;
        }
      }

      // 3. Max Price Filter
      const parsedMaxPrice =
        maxPrice.trim() !== ""
          ? Number(maxPrice)
          : NaN;

      if (!isNaN(parsedMaxPrice)) {
        if (deal.price > parsedMaxPrice) {
          return false;
        }
      }

      // 4. Max Mileage Filter
      const parsedMaxMileage =
        maxMileage.trim() !== ""
          ? Number(maxMileage)
          : NaN;

      if (!isNaN(parsedMaxMileage)) {
        if (deal.mileage > parsedMaxMileage) {
          return false;
        }
      }

      // 5. Fuel Type Filter
      const searchFuel = fuelFilter.trim().toLowerCase();

      if (searchFuel.length > 0) {
        const dealFuel = String(deal.fuelType).toLowerCase();

        if (!dealFuel.includes(searchFuel)) {
          return false;
        }
      }

      // 6. Minimum VFM Threshold
      if (deal.vfmScore < minVfm) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // PRICE SORT
      if (priceSort) {
        return priceSort === "asc"
          ? a.price - b.price
          : b.price - a.price;
      }

      // MILEAGE SORT
      if (mileageSort) {
        return mileageSort === "asc"
          ? a.mileage - b.mileage
          : b.mileage - a.mileage;
      }

      return 0;
    });

  return {
    deals: filteredDeals,

    loading,
    error,

    // Pagination
    page,
    setPage,

    pageSizeInput,
    setPageSizeInput,

    // Actions
    execute,

    // Filters
    brandFilter,
    setBrandFilter,

    modelFilter,
    setModelFilter,

    listingUrlFilter,
    setListingUrlFilter,

    maxPrice,
    setMaxPrice,

    maxMileage,
    setMaxMileage,

    fuelFilter,
    setFuelFilter,

    minVfm,
    setMinVfm,
    priceSort,
    setPriceSort,
    mileageSort,
    setMileageSort,
  };
};