import { useEffect, useState } from "react";

export const useLoadSkia = () => {
  const [isSkiaLoaded, setIsSkiaLoaded] = useState(false);

  useEffect(() => {
    const loadSkia = async () => {
      const { LoadSkiaWeb } =
        await import("@shopify/react-native-skia/lib/module/web");
      await LoadSkiaWeb({ locateFile: () => "/canvaskit.wasm" });
      setIsSkiaLoaded(true);
    };
    loadSkia();
  }, [isSkiaLoaded]);
  return {
    isSkiaLoaded,
  };
};
