import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import { v4 as uuid } from "uuid";
import { S3_KEY_PREFIX } from "../constants/s3";

const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL?.replace(/\/$/, "");
const BUCKET = process.env.AWS_BUCKET_NAME;

export const uploadImageToS3 = async (
  buffer: Buffer,
  folder: string,
): Promise<{ url: string; key: string }> => {
  const key = `${folder}/${uuid()}.jpg`;
  const folderWithoutRoot = folder.slice(folder.indexOf("/") + 1);

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/jpeg",
    }),
  );

  const fileName = key.split("/").pop()!;

  return {
    url: `${CLOUDFRONT_URL}/${folderWithoutRoot}/${fileName}`,
    key,
  };
};

export const deleteImageFromS3 = async (imageUrl: string | null | undefined) => {
  if (!imageUrl || !CLOUDFRONT_URL) return;

  const relativePath = imageUrl.replace(CLOUDFRONT_URL, "");
  console.log("relativePath : ",relativePath);
  if (!relativePath) return;

  const key = `${S3_KEY_PREFIX}${relativePath}`;

  console.log("Deleting S3 object with key:", key);
  console.log("Expected ", "helping-hands/donations/267db67d-2a22-40f8-a3bf-ed70e473ad11.jpg");

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );
  } catch (error) {
    console.error("Failed to delete S3 object", key, error);
  }
};
