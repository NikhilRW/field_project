export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "Admin" | "User";
      };
      s3Url?: string;
      s3Key?: string;
    }
  }
}
