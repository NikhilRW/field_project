import {
  MutationCache,
  QueryClient,
  type MutationKey,
} from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { onlineManager } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { mmkvAsyncStorage } from "@/shared/utils/mmkvStorage";
import {
  createActivity,
  deleteActivity,
  updateActivityStatus,
  type CreateActivityPayload,
} from "@/features/Activities/utils/api";
import type { ActivityStatus } from "@/shared/types/mock";
import { activitiesQueryKey } from "@/features/Activities/hooks/useActivities";
import { dashboardQueryKey } from "@/features/Dashboard/hooks/useDashboard";
import {
  createBeneficiary,
  type CreateBeneficiaryPayload,
} from "@/features/Beneficiaries/utils/api";
import { beneficiariesQueryKey } from "@/features/Beneficiaries/hooks/useBeneficiaries";

export const createActivityMutationKey = [
  "activities",
  "create",
] satisfies MutationKey;

export const createBeneficiaryMutationKey = [
  "beneficiaries",
  "create",
] satisfies MutationKey;

export const deleteActivityMutationKey = [
  "activities",
  "delete",
] satisfies MutationKey;

export const updateActivityStatusMutationKey = [
  "activities",
  "update-status",
] satisfies MutationKey;

let netInfoSubscribed = false;

const invalidateAfterWrite = async () => {
  await Promise.all([
    queryClient.invalidateQueries({
      queryKey: activitiesQueryKey,
      exact: true,
    }),
    queryClient.invalidateQueries({
      queryKey: beneficiariesQueryKey,
      exact: true,
    }),
    queryClient.invalidateQueries({
      queryKey: dashboardQueryKey,
      exact: true,
    }),
  ]);
};

const setUpOnlineManager = () => {
  if (netInfoSubscribed) {
    return;
  }

  netInfoSubscribed = true;

  onlineManager.setEventListener((setOnline) => {
    return NetInfo.addEventListener((state) => {
      setOnline(Boolean(state.isConnected));
    });
  });
};

setUpOnlineManager();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: 1,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: 0,
      gcTime: Infinity,
      networkMode: "online",
    },
  },
  mutationCache: new MutationCache({
    onSuccess: async (_data, _variables, _context, mutation) => {
      const key = mutation.options.mutationKey;

      if (
        JSON.stringify(key) === JSON.stringify(createActivityMutationKey) ||
        JSON.stringify(key) === JSON.stringify(deleteActivityMutationKey) ||
        JSON.stringify(key) === JSON.stringify(updateActivityStatusMutationKey) ||
        JSON.stringify(key) === JSON.stringify(createBeneficiaryMutationKey)
      ) {
        await invalidateAfterWrite();
      }
    },
  }),
});

queryClient.setMutationDefaults(createActivityMutationKey, {
  mutationFn: async (payload: CreateActivityPayload) => {
    return createActivity(payload);
  },
  networkMode: "online",
});

queryClient.setMutationDefaults(deleteActivityMutationKey, {
  mutationFn: async (id: string) => {
    return deleteActivity(id);
  },
  networkMode: "online",
});

queryClient.setMutationDefaults(updateActivityStatusMutationKey, {
  mutationFn: async ({
    id,
    status,
  }: {
    id: string;
    status: ActivityStatus;
  }) => {
    return updateActivityStatus(id, status);
  },
  networkMode: "online",
});

queryClient.setMutationDefaults(createBeneficiaryMutationKey, {
  mutationFn: async (payload: CreateBeneficiaryPayload) => {
    return createBeneficiary(payload);
  },
  networkMode: "online",
});

export const clientPersister = createAsyncStoragePersister({
  storage: mmkvAsyncStorage,
  key: "tanstack-persist-storage",
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

export const resumePausedMutationsIfOnline = async () => {
  const state = await NetInfo.fetch();
  const isOnline = Boolean(state.isConnected);

  onlineManager.setOnline(isOnline);

  if (!isOnline) {
    return;
  }

  await queryClient.resumePausedMutations();
  await invalidateAfterWrite();
};
