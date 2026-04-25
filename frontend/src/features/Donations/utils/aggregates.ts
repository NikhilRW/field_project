import type { Donation } from "@/shared/types/mock";

export const getTotalReceived = (donations: Donation[]) =>
  donations
    .filter((d) => d.type === "incoming")
    .reduce((sum, d) => sum + d.amount, 0);

export const getTotalSpent = (donations: Donation[]) =>
  donations
    .filter((d) => d.type === "outgoing")
    .reduce((sum, d) => sum + d.amount, 0);

export const getDonationTotals = (donations: Donation[]) => ({
  received: getTotalReceived(donations),
  spent: getTotalSpent(donations),
});

export const getMonthlyMaxValue = (
  monthlyDonations: Array<{ received: number; spent: number }>,
) => Math.max(...monthlyDonations.flatMap((m) => [m.received, m.spent]));
