import { useEffect } from "react";
import * as Linking from "expo-linking";

const allowedSchemes = new Set(["helpinghands", "exp+helpinghands"]);
const allowedHosts = new Set(["helpinghands.com"]);

const isAllowedDeepLink = (url: string) => {
  const parsed = Linking.parse(url);
  if (!parsed.scheme) return false;
  if (parsed.scheme === "https")
    return parsed.hostname ? allowedHosts.has(parsed.hostname) : false;
  return allowedSchemes.has(parsed.scheme);
};

export const useDeepLinkBootstrap = () => {
  useEffect(() => {
    Linking.getInitialURL();
    const subscription = Linking.addEventListener("url", () => {});
    return () => subscription.remove();
  }, []);
};
