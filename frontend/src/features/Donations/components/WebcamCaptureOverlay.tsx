type CapturedPhoto = {
  previewUri: string;
  imageUri: string;
  fileName?: string | null;
  fileType?: string | null;
};

type Props = {
  visible: boolean;
  onCapture: (photo: CapturedPhoto) => void;
  onClose: () => void;
};

export type { CapturedPhoto };

export default function WebcamCaptureOverlay(_props: Props) {
  return null;
}
