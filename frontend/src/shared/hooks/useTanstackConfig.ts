import { useCallback } from "react";
import { addEventListener, useNetInfo } from "@react-native-community/netinfo";
import { onlineManager, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../config/tanstack";

export const useTanstackConfig = () => {
  const { isConnected } = useNetInfo();
  const tanstackOnSuccess = useCallback(async () => {
    if (isConnected) {
      // If the app loads and there are some undone mutation and also network is connected then the mutations are resumed.
      await queryClient.resumePausedMutations();
    }
  }, [isConnected]);

  const setUpTanstackForReactNative = () => {
    // Set up online/offline detection for React Native
    const cleanUp = addEventListener(async (state) => {
      const isOnline = !!state.isConnected;
      onlineManager.setOnline(isOnline);
      if (isOnline) {
        await queryClient.resumePausedMutations();
      }
    });
    return cleanUp;
  };
  return {
    tanstackOnSuccess,
  };
};
