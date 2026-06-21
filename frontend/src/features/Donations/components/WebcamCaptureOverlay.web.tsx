import React, { useEffect, useRef, useCallback } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Camera, X } from "lucide-react-native";

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

export default function WebcamCaptureOverlay({
  visible,
  onCapture,
  onClose,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 960 },
          facingMode: "user",
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      onClose();
    }
  }, [onClose]);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (visible) {
      startWebcam();
    } else {
      stopWebcam();
    }
    return stopWebcam;
  }, [visible, startWebcam, stopWebcam]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const uri = URL.createObjectURL(blob);
        onCapture({
          previewUri: uri,
          imageUri: uri,
          fileName: "webcam-capture.jpg",
          fileType: "image/jpeg",
        });
      },
      "image/jpeg",
      0.45,
    );
  }, [onCapture]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Take Photo</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.75}>
              <X size={22} color="#fff" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          <View style={styles.videoWrapper}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={styles.video}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
              activeOpacity={0.8}
            >
              <View style={styles.captureRing}>
                <Camera size={24} color="#fff" strokeWidth={2.2} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  videoWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  video: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 12,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  captureButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  captureRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
});
