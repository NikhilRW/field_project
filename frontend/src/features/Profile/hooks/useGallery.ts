import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addGalleryImages,
  deleteGalleryImage,
  fetchGalleryImages,
  type AddGalleryImagesPayload,
} from "../utils/galleryApi";

export const galleryQueryKey = ["gallery"];

export const useGalleryImages = () =>
  useQuery({
    queryKey: galleryQueryKey,
    queryFn: fetchGalleryImages,
    staleTime: 0,
    refetchOnMount: "always",
  });

export const useAddGalleryImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddGalleryImagesPayload) =>
      addGalleryImages(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: galleryQueryKey });
    },
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGalleryImage(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: galleryQueryKey });
    },
  });
};
