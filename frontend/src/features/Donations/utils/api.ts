import http from "@/shared/utils/http";
import { isWeb } from "@/shared/constants/platform";
import type { Donation } from "@/shared/types/mock";

export type MonthlyDonation = {
  month: string;
  received: number;
  spent: number;
};

export type DonationCategory = "money" | "books" | "clothes" | "other_items";
export type DonationVerificationStatus = "unverified" | "verified" | "rejected";
export type DonationPaymentStatus =
  | "not_applicable"
  | "pending"
  | "paid"
  | "failed";

export type MyDonation = Donation & {
  donorId: string;
  category: DonationCategory;
  verificationStatus: DonationVerificationStatus;
  paymentStatus: DonationPaymentStatus;
  imageUrl?: string | null;
  isDonated: boolean;
};

export type MyDonationsPage = {
  items: MyDonation[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
};

export type FetchMyDonationsParams = {
  pageParam?: number;
  limit?: number;
};

export type CreateItemDonationPayload = {
  category: Exclude<DonationCategory, "money">;
  purpose: string;
  imageUri: string;
  fileName?: string | null;
  fileType?: string | null;
  donorId?: string;
};

export type CreateMoneyDonationPayload = {
  amount: number;
  purpose?: string;
  donorId?: string;
};

export type AllDonation = {
  id: string;
  donor: string;
  donorId?: string;
  purpose: string;
  amount: number;
  type: "incoming" | "outgoing";
  date: string;
  category: DonationCategory;
  verificationStatus: DonationVerificationStatus;
  paymentStatus: DonationPaymentStatus;
  imageUrl?: string | null;
  isDonated: boolean;
};

export const fetchAllDonations = async () => {
  const response = await http.get<{ success: boolean; data: AllDonation[] }>(
    "/api/donations/all",
  );
  return response.data.data;
};

export const fetchDonations = async () => {
  const response = await http.get<{ success: boolean; data: Donation[] }>(
    "/api/donations",
  );
  return response.data.data;
};

export const fetchMonthlyDonations = async () => {
  const response = await http.get<{
    success: boolean;
    data: MonthlyDonation[];
  }>("/api/donations/monthly");
  return response.data.data;
};

export const fetchMyDonations = async ({
  pageParam = 1,
  limit = 7,
}: FetchMyDonationsParams = {}) => {
  const response = await http.get<{ success: boolean; data: MyDonationsPage }>(
    "/api/donations/mine",
    {
      params: {
        page: pageParam,
        limit,
      },
    },
  );
  return response.data.data;
};

export const fetchPendingItemDonations = async () => {
  const response = await http.get<{ success: boolean; data: MyDonation[] }>(
    "/api/donations/items/pending",
  );
  return response.data.data;
};

export const fetchDonatedItemDonations = async () => {
  const response = await http.get<{ success: boolean; data: MyDonation[] }>(
    "/api/donations/items/donated",
  );
  return response.data.data;
};

export const fetchItemDonationById = async (id: string) => {
  const response = await http.get<{ success: boolean; data: MyDonation }>(
    `/api/donations/items/${id}`,
  );
  return response.data.data;
};

export const verifyItemDonation = async (id: string) => {
  const response = await http.patch<{ success: boolean; data: MyDonation }>(
    `/api/donations/items/${id}/verify`,
  );
  return response.data.data;
};

export const rejectItemDonation = async (id: string) => {
  const response = await http.patch<{ success: boolean; data: MyDonation }>(
    `/api/donations/items/${id}/reject`,
  );
  return response.data.data;
};

export const toggleItemDonatedStatus = async (id: string) => {
  const response = await http.patch<{ success: boolean; data: MyDonation }>(
    `/api/donations/items/${id}/mark-donated`,
  );
  return response.data.data;
};

export const batchMarkItemsDonated = async (ids: string[]) => {
  const response = await http.post<{
    success: boolean;
    data: MyDonation[];
  }>("/api/donations/items/batch-mark-donated", { ids });
  return response.data.data;
};

export const createItemDonation = async (
  payload: CreateItemDonationPayload,
) => {
  const formData = new FormData();
  const fallbackFileName = payload.imageUri.split("/").pop() || "donation.jpg";
  const fileName = payload.fileName || fallbackFileName;
  const fileType = payload.fileType || "image/jpeg";

  if (isWeb) {
    const res = await fetch(payload.imageUri);
    const blob = await res.blob();
    const file = new File([blob], fileName, { type: fileType });
    formData.append("itemImage", file);
  } else {
    formData.append("itemImage", {
      uri: payload.imageUri,
      name: fileName,
      type: fileType,
    } as any);
  }

  formData.append("category", payload.category);
  formData.append("purpose", payload.purpose);
  if (payload.donorId) {
    formData.append("donorId", payload.donorId);
  }

  const response = await http.post<{ success: boolean; data: MyDonation }>(
    "/api/donations/item",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data.data;
};
// TODO: put types in another files.
export type DraftDonation = {
  id: string;
  donorId?: string | null;
  category: DonationCategory;
  purpose: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateDraftPayload = {
  category: Exclude<DonationCategory, "money">;
  purpose?: string | null;
  imageUri: string;
  fileName?: string | null;
  fileType?: string | null;
  donorId?: string;
};

export type UpdateDraftPayload = {
  purpose?: string | null;
  category?: Exclude<DonationCategory, "money">;
  imageUri?: string;
  fileName?: string | null;
  fileType?: string | null;
};

export const createDraft = async (payload: CreateDraftPayload) => {
  const formData = new FormData();
  const fallbackFileName =
    payload.imageUri.split("/").pop() || "draft.jpg";
  const fileName = payload.fileName || fallbackFileName;
  const fileType = payload.fileType || "image/jpeg";

  if (isWeb) {
    const res = await fetch(payload.imageUri);
    const blob = await res.blob();
    const file = new File([blob], fileName, { type: fileType });
    formData.append("itemImage", file);
  } else {
    formData.append("itemImage", {
      uri: payload.imageUri,
      name: fileName,
      type: fileType,
    } as any);
  }

  formData.append("category", payload.category);
  if (payload.purpose) {
    formData.append("purpose", payload.purpose);
  }
  if (payload.donorId) {
    formData.append("donorId", payload.donorId);
  }

  const response = await http.post<{ success: boolean; data: DraftDonation }>(
    "/api/donations/drafts",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.data;
};

export const fetchDrafts = async () => {
  const response = await http.get<{
    success: boolean;
    data: DraftDonation[];
  }>("/api/donations/drafts");
  return response.data.data;
};

export const fetchDraftById = async (id: string) => {
  const response = await http.get<{ success: boolean; data: DraftDonation }>(
    `/api/donations/drafts/${id}`,
  );
  return response.data.data;
};

export const updateDraft = async (id: string, payload: UpdateDraftPayload) => {
  const formData = new FormData();

  if (payload.imageUri) {
    const fallbackFileName =
      payload.imageUri.split("/").pop() || "draft.jpg";
    const fileName = payload.fileName || fallbackFileName;
    const fileType = payload.fileType || "image/jpeg";

    if (isWeb) {
      const res = await fetch(payload.imageUri);
      const blob = await res.blob();
      const file = new File([blob], fileName, { type: fileType });
      formData.append("itemImage", file);
    } else {
      formData.append("itemImage", {
        uri: payload.imageUri,
        name: fileName,
        type: fileType,
      } as any);
    }
  }

  if (payload.purpose !== undefined) {
    formData.append("purpose", payload.purpose ?? "");
  }
  if (payload.category) {
    formData.append("category", payload.category);
  }

  const response = await http.put<{ success: boolean; data: DraftDonation }>(
    `/api/donations/drafts/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.data;
};

export const deleteDraft = async (id: string) => {
  const response = await http.delete<{ success: boolean }>(
    `/api/donations/drafts/${id}`,
  );
  return response.data;
};

export const submitDraft = async (id: string) => {
  const response = await http.post<{
    success: boolean;
    data: MyDonation;
  }>(`/api/donations/drafts/${id}/submit`);
  return response.data.data;
};

export const createMoneyDonation = async (
  payload: CreateMoneyDonationPayload,
) => {
  const response = await http.post<{ success: boolean; data: MyDonation }>(
    "/api/donations/money",
    payload,
  );
  return response.data.data;
};
