import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  batchMarkItemsDonated,
  createItemDonation,
  createMoneyDonation,
  fetchAllDonations,
  fetchDonatedItemDonations,
  fetchDonations,
  fetchItemDonationById,
  fetchMonthlyDonations,
  fetchMyDonations,
  fetchPendingItemDonations,
  rejectItemDonation,
  toggleItemDonatedStatus,
  verifyItemDonation,
  type CreateItemDonationPayload,
  type CreateMoneyDonationPayload,
} from "../utils/api";
import { fetchAllUsers } from "../utils/usersApi";

export const allDonationsQueryKey = ["donations", "all"];
export const allUsersQueryKey = ["users", "all"];
export const donationsQueryKey = ["donations"];
export const monthlyDonationsQueryKey = ["donations", "monthly"];
export const myDonationsQueryKey = ["donations", "mine", "paginated"];
export const pendingItemDonationsQueryKey = ["donations", "items", "pending"];
export const donatedItemDonationsQueryKey = ["donations", "items", "donated"];
export const itemDonationQueryKey = (id: string) => ["donations", "items", id];
export const analyticsQueryKey = ["analytics"];
export const myDonationsPageSize = 7;

export const useAllDonations = () =>
  useQuery({
    queryKey: allDonationsQueryKey,
    queryFn: fetchAllDonations,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const useAllUsers = () =>
  useQuery({
    queryKey: allUsersQueryKey,
    queryFn: fetchAllUsers,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const useDonations = () =>
  useQuery({
    queryKey: donationsQueryKey,
    queryFn: fetchDonations,
    staleTime: 0,
    refetchOnMount: "always",
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

export const useDonatedItemDonations = () =>
  useQuery({
    queryKey: donatedItemDonationsQueryKey,
    queryFn: fetchDonatedItemDonations,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const useItemDonation = (id: string) =>
  useQuery({
    queryKey: itemDonationQueryKey(id),
    queryFn: () => fetchItemDonationById(id),
    enabled: Boolean(id),
  });

export const useBatchMarkItemsDonated = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => batchMarkItemsDonated(ids),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
        queryClient.invalidateQueries({
          queryKey: donatedItemDonationsQueryKey,
        }),
      ]);
    },
  });
};

export const useToggleItemDonatedStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleItemDonatedStatus(id),
    onSuccess: async (donation) => {
      queryClient.setQueryData(itemDonationQueryKey(donation.id), donation);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: donatedItemDonationsQueryKey,
        }),
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
      ]);
    },
  });
};

export const useCreateItemDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateItemDonationPayload) => {
      return createItemDonation(payload);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: myDonationsQueryKey }),
        queryClient.invalidateQueries({
          queryKey: pendingItemDonationsQueryKey,
        }),
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
      ]);
    },
  });
};

export const useCreateMoneyDonation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMoneyDonationPayload) =>
      createMoneyDonation(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: myDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: monthlyDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
      ]);
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
        queryClient.invalidateQueries({
          queryKey: donatedItemDonationsQueryKey,
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
