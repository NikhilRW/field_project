declare global {
  namespace Express {
    interface Request extends Express.Request {
      user?: {
        id: string;
        email: string;
        role: "Admin" | "Volunteer" | "Donor";
      };
    }
  }
}
