import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  batchMarkItemsDonated,
  createDraft,
  createItemDonation,
  createMoneyDonation,
  deleteDraft,
  fetchAllDonations,
  fetchDonatedItemDonations,
  fetchDonations,
  fetchDraftById,
  fetchDrafts,
  fetchItemDonationById,
  fetchMonthlyDonations,
  fetchMyDonations,
  fetchPendingItemDonations,
  rejectItemDonation,
  submitDraft,
  toggleItemDonatedStatus,
  updateDraft,
  verifyItemDonation,
  type CreateDraftPayload,
  type CreateItemDonationPayload,
  type CreateMoneyDonationPayload,
  type UpdateDraftPayload,
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
    onSuccess: async (_data, ids) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: pendingItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donatedItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
        queryClient.invalidateQueries({ queryKey: myDonationsQueryKey }),
        ...ids.map((id) =>
          queryClient.invalidateQueries({ queryKey: itemDonationQueryKey(id) }),
        ),
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
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: pendingItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donatedItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: myDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
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
        queryClient.invalidateQueries({ queryKey: pendingItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donatedItemDonationsQueryKey }),
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
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: pendingItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donatedItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: myDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
      ]);
    },
  });
};

export const draftsQueryKey = ["donations", "drafts"];

export const draftQueryKey = (id: string) => ["drafts", id];

export const useDraft = (id: string | undefined) =>
  useQuery({
    queryKey: draftQueryKey(id!),
    queryFn: () => fetchDraftById(id!),
    enabled: Boolean(id),
  });

export const useDrafts = () =>
  useQuery({
    queryKey: draftsQueryKey,
    queryFn: fetchDrafts,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const useCreateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDraftPayload) => createDraft(payload),
    onSuccess: async (draft) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: draftsQueryKey }),
        queryClient.invalidateQueries({ queryKey: draftQueryKey(draft.id) }),
      ]);
    },
  });
};

export const useUpdateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDraftPayload;
    }) => updateDraft(id, payload),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: draftsQueryKey }),
        queryClient.invalidateQueries({ queryKey: draftQueryKey(variables.id) }),
      ]);
    },
  });
};

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDraft(id),
    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: draftsQueryKey }),
        queryClient.invalidateQueries({ queryKey: draftQueryKey(id) }),
      ]);
    },
  });
};

export const useSubmitDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => submitDraft(id),
    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: draftsQueryKey }),
        queryClient.invalidateQueries({ queryKey: draftQueryKey(id) }),
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: pendingItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donatedItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: myDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: monthlyDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: allDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: pendingItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donatedItemDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: donationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: myDonationsQueryKey }),
        queryClient.invalidateQueries({ queryKey: analyticsQueryKey }),
      ]);
    },
  });
};
// TODO: separate the mutations right here.