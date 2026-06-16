import { useEffect, useState } from "react";
import { isWeb } from "../constants/platform";

export const useLoadSkia = () => {
  const [isSkiaLoded, setIsSkiaLoaded] = useState(false);

  useEffect(() => {
    if (isWeb) {
      const loadSkia = async () => {
        const { LoadSkiaWeb } =
          await import("@shopify/react-native-skia/lib/module/web");
        await LoadSkiaWeb({ locateFile: () => "/canvaskit.wasm" });
        setIsSkiaLoaded(true);
      };
      loadSkia();
    } else {
      setIsSkiaLoaded(true);
    }
  }, [isSkiaLoded]);
  return {
    isSkiaLoded
  }
};
