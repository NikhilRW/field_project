import http from "@/shared/utils/http";
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
  category: DonationCategory;
  verificationStatus: DonationVerificationStatus;
  paymentStatus: DonationPaymentStatus;
  imageUrl?: string | null;
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
};

export type CreateMoneyDonationOrderPayload = {
  amount: number;
  purpose?: string;
};

export type MoneyDonationOrder = {
  donationId: string;
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  purpose: string;
  donorName: string;
  donation: MyDonation;
};

export type VerifyMoneyDonationPayload = {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
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

export const createItemDonation = async (
  payload: CreateItemDonationPayload,
) => {
  const formData = new FormData();
  const fallbackFileName = payload.imageUri.split("/").pop() || "donation.jpg";

  formData.append("category", payload.category);
  formData.append("purpose", payload.purpose);
  formData.append("itemImage", {
    uri: payload.imageUri,
    name: payload.fileName || fallbackFileName,
    type: payload.fileType || "image/jpeg",
  } as any);

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

export const createMoneyDonationOrder = async (
  payload: CreateMoneyDonationOrderPayload,
) => {
  const response = await http.post<{
    success: boolean;
    data: MoneyDonationOrder;
  }>("/api/donations/money/order", payload);
  return response.data.data;
};

export const verifyMoneyDonation = async (
  payload: VerifyMoneyDonationPayload,
) => {
  const response = await http.post<{ success: boolean; data: MyDonation }>(
    "/api/donations/money/verify",
    payload,
  );
  return response.data.data;
};

export const markMoneyDonationFailed = async (razorpayOrderId: string) => {
  const response = await http.post<{ success: boolean }>(
    "/api/donations/money/failure",
    { razorpayOrderId },
  );
  return response.data.success;
};
