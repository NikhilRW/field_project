import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import { v4 as uuid } from "uuid";

const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL?.replace(/\/$/, "");
const BUCKET = process.env.AWS_BUCKET_NAME;

export const uploadImageToS3 = async (
  buffer: Buffer,
  folder: string,
): Promise<{ url: string; key: string }> => {
  const key = `${folder}/${uuid()}.jpg`;

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
    url: `${CLOUDFRONT_URL}/${fileName}`,
    key,
  };
};
