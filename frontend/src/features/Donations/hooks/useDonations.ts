import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createItemDonation,
  createMoneyDonationOrder,
  fetchDonations,
  fetchItemDonationById,
  fetchMonthlyDonations,
  fetchMyDonations,
  fetchPendingItemDonations,
  markMoneyDonationFailed,
  rejectItemDonation,
  verifyItemDonation,
  verifyMoneyDonation,
  type CreateItemDonationPayload,
  type CreateMoneyDonationOrderPayload,
  type VerifyMoneyDonationPayload,
} from "../utils/api";

export const donationsQueryKey = ["donations"];
export const monthlyDonationsQueryKey = ["donations", "monthly"];
export const myDonationsQueryKey = ["donations", "mine", "paginated"];
export const pendingItemDonationsQueryKey = ["donations", "items", "pending"];
export const itemDonationQueryKey = (id: string) => ["donations", "items", id];
export const myDonationsPageSize = 7;

export const useDonations = () =>
  useQuery({
    queryKey: donationsQueryKey,
    queryFn: fetchDonations,
  });

export const useMonthlyDonations = () =>
  useQuery({
    queryKey: monthlyDonationsQueryKey,
    queryFn: fetchMonthlyDonations,
  });

export const useMyDonations = () =>
  useInfiniteQuery({
    queryKey: myDonationsQueryKey,
    queryFn: ({ pageParam }) =>
      fetchMyDonations({
        pageParam: Number(pageParam),
        limit: myDonationsPageSize,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const usePendingItemDonations = () =>
  useQuery({
    queryKey: pendingItemDonationsQueryKey,
    queryFn: fetchPendingItemDonations,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const useItemDonation = (id: string) =>
  useQuery({
    queryKey: itemDonationQueryKey(id),
    queryFn: () => fetchItemDonationById(id),
    enabled: Boolean(id),
  });

export const useCreateItemDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateItemDonationPayload) =>
      createItemDonation(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: myDonationsQueryKey }),
        queryClient.invalidateQueries({
          queryKey: pendingItemDonationsQueryKey,
        }),
      ]);
    },
  });
};

export const useCreateMoneyDonationOrder = () =>
  useMutation({
    mutationFn: (payload: CreateMoneyDonationOrderPayload) =>
      createMoneyDonationOrder(payload),
  });

export const useVerifyMoneyDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyMoneyDonationPayload) =>
      verifyMoneyDonation(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: myDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: monthlyDonationsQueryKey }),
      ]);
    },
  });
};

export const useMarkMoneyDonationFailed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (razorpayOrderId: string) =>
      markMoneyDonationFailed(razorpayOrderId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: myDonationsQueryKey });
    },
  });
};

export const useVerifyItemDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => verifyItemDonation(id),
    onSuccess: async (donation) => {
      queryClient.setQueryData(itemDonationQueryKey(donation.id), donation);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: pendingItemDonationsQueryKey,
        }),
        queryClient.invalidateQueries({ queryKey: donationsQueryKey }),
      ]);
    },
  });
};

export const useRejectItemDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rejectItemDonation(id),
    onSuccess: async (donation) => {
      queryClient.setQueryData(itemDonationQueryKey(donation.id), donation);
      await queryClient.invalidateQueries({
        queryKey: pendingItemDonationsQueryKey,
      });
    },
  });
};
