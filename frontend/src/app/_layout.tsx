import { isWeb } from "@/shared/constants/platform";
if (isWeb) {
  import("../shared/styles/global.css");
}
export { default } from "@/shared/navigation/routes/RootLayout";