export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "Admin" | "User";
      };
      cloudinaryUrl?: string;
      cloudinaryPublicId?: string;
    }
  }
}
