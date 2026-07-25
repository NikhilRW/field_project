import http from "@/shared/utils/http";
import { isWeb } from "@/shared/constants/platform";

export type GalleryImage = {
  id: string;
  imageUrl: string;
  caption: string | null;
  altText: string | null;
  createdAt: string;
};

export const fetchGalleryImages = async (): Promise<GalleryImage[]> => {
  const response = await http.get<{ success: boolean; data: GalleryImage[] }>(
    "/api/gallery",
  );
  return response.data.data;
};

export type AddGalleryImagesPayload = {
  imageUris: string[];
  fileNames?: (string | null)[];
  fileTypes?: (string | null)[];
  caption?: string;
  altText?: string;
};

export const addGalleryImages = async (
  payload: AddGalleryImagesPayload,
): Promise<GalleryImage[]> => {
  const formData = new FormData();

  for (let i = 0; i < payload.imageUris.length; i++) {
    const uri = payload.imageUris[i];
    const fileName = payload.fileNames?.[i] || uri.split("/").pop() || "gallery.jpg";
    const fileType = payload.fileTypes?.[i] || "image/jpeg";

    if (isWeb) {
      const res = await fetch(uri);
      const blob = await res.blob();
      formData.append("galleryImages", new File([blob], fileName, { type: fileType }));
    } else {
      formData.append("galleryImages", {
        uri,
        name: fileName,
        type: fileType,
      } as any);
    }
  }

  if (payload.caption) {
    formData.append("caption", payload.caption);
  }
  if (payload.altText) {
    formData.append("altText", payload.altText);
  }

  const response = await http.post<{ success: boolean; data: GalleryImage[] }>(
    "/api/gallery",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data.data;
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
  await http.delete(`/api/gallery/${id}`);
};
