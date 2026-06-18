import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

const cleanup = (...paths: string[]) => {
  for (const p of paths) {
    try {
      unlinkSync(p);
    } catch {}
  }
};

export const compressImageBuffer = (buffer: Buffer): Promise<Buffer> => {
  const inputPath = join(tmpdir(), randomUUID());
  const outputPath = join(tmpdir(), `${randomUUID()}.jpg`);

  writeFileSync(inputPath, buffer);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOption("-vf", "scale=1920:-1")
      .outputOption("-q:v", "15")
      .save(outputPath)
      .on("end", () => {
        try {
          const compressed = readFileSync(outputPath);
          resolve(compressed);
        } catch (err) {
          reject(err);
        } finally {
          cleanup(inputPath, outputPath);
        }
      })
      .on("error", (err) => {
        cleanup(inputPath, outputPath);
        reject(err);
      });
  });
};
