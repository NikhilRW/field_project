import { AnalyticsDonation, DonationType, TimeFilter } from "../types/common";

const getDateRange = (
  filter: TimeFilter,
  customStart: Date | null,
  customEnd: Date | null,
): { start: Date; end: Date } => {
  const end = new Date();
  let start = new Date();

  if (filter === "custom" && customStart && customEnd) {
    return { start: customStart, end: customEnd };
  }

  switch (filter) {
    case "7days":
      start.setDate(end.getDate() - 7);
      break;
    case "month":
      start.setMonth(end.getMonth() - 1);
      break;
    case "year":
      start.setFullYear(end.getFullYear() - 1);
      break;
  }

  return { start, end };
};

const filterDonations = (
  allData: AnalyticsDonation[],
  timeFilter: TimeFilter,
  donationType: DonationType,
  customStart: Date | null,
  customEnd: Date | null,
): AnalyticsDonation[] => {
  const { start, end } = getDateRange(timeFilter, customStart, customEnd);

  return allData.filter((d) => {
    const donationDate = new Date(d.date);
    const inTimeRange = donationDate >= start && donationDate <= end;
    const matchesType = donationType === "all" || d.category === donationType;
    return inTimeRange && matchesType;
  });
};

const groupByDate = (
  items: AnalyticsDonation[],
): { date: string; count: number }[] => {
  const dateMap = new Map<string, number>();
  items.forEach((d) => {
    const date = new Date(d.date).toISOString().split("T")[0];
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });
  return Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

const generateMockData = (): AnalyticsDonation[] => {
  const now = Date.now();
  const DAY = 86400000;
  const categories: AnalyticsDonation["category"][] = [
    "money",
    "clothes",
    "books",
    "other_items",
  ];
  const donorNames = [
    "Amit S.",
    "Priya M.",
    "Rahul K.",
    "Sneha P.",
    "Vijay T.",
    "Neha G.",
    "Ankit R.",
  ];
  const purposes = [
    "General donation",
    "Flood relief",
    "Education fund",
    "Medical aid",
    "Food drive",
  ];
  const data: AnalyticsDonation[] = [];

  for (let day = 365; day >= 0; day--) {
    const date = new Date(now - day * DAY);
    const count = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < count; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const donorIndex = Math.floor(Math.random() * donorNames.length);
      const donorId = `donor_${donorIndex}_${Math.floor(day / 30)}`;

      data.push({
        id: `mock_${day}_${i}`,
        donorId,
        donorName: donorNames[donorIndex],
        purpose: purposes[Math.floor(Math.random() * purposes.length)],
        amount:
          category === "money" ? Math.floor(Math.random() * 5000) + 100 : 0,
        type: "incoming",
        category,
        verificationStatus: "verified",
        date: date.toISOString(),
        createdAt: date.toISOString(),
        donorCreatedAt: new Date(now - Math.random() * 365 * DAY).toISOString(),
      });
    }
  }

  return data;
};

const aggregateByWeek = (
  data: { date: string; count: number }[],
): { value: number; date: Date }[] => {
  const grouped = new Map<string, number>();
  data.forEach((d) => {
    const date = new Date(d.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = weekStart.toISOString().split("T")[0];
    grouped.set(key, (grouped.get(key) || 0) + d.count);
  });
  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ value: count, date: new Date(date) }));
};

export { filterDonations, generateMockData, getDateRange, groupByDate, aggregateByWeek };
