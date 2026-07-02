const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_KEY = import.meta.env.VITE_BACKEND_API_KEY || "dev-showcase-key";

export async function fetchActivities() {
  const res = await fetch(`${API_BASE}/api/public/activities`, {
    headers: { "x-api-key": API_KEY },
  });
  if (!res.ok) throw new Error("Failed to fetch activities");
  const json = await res.json();
  return json.data as Array<{
    id: string;
    name: string;
    date: string;
    status: string;
    description: string;
    imageUrl: string | null;
  }>;
}

export type Donation = {
  id: string;
  donor: string;
  purpose: string;
  amount: number;
  type: "incoming" | "outgoing";
  date: string;
  category: "money" | "books" | "clothes" | "other_items" | "grocery";
  imageUrl: string | null;
};

type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; hasMore: boolean };
};

export async function fetchDonations(page = 1, limit = 12) {
  const res = await fetch(
    `${API_BASE}/api/public/donations?page=${page}&limit=${limit}`,
    { headers: { "x-api-key": API_KEY } },
  );
  if (!res.ok) throw new Error("Failed to fetch donations");
  const json: PaginatedResponse<Donation> = await res.json();
  return json;
}
