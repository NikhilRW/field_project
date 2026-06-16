import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsData } from "../utils/api";
import {
  DonationType,
  GraphMetric,
  TimeFilter,
  USE_MOCK_DATA,
  UseAnalyticsReturn,
} from "../types/common";
import {
  filterDonations,
  generateMockData,
  getDateRange,
  groupByDate,
} from "../utils/common";

const ANALYTICS_QUERY_KEY = ["analytics"];

export const useAnalytics = (): UseAnalyticsReturn => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("month");
  const [donationType, setDonationType] = useState<DonationType>("all");
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [graphMetric, setGraphMetric] = useState<GraphMetric>("total");
  const [graphType, setGraphType] = useState<DonationType>("all");

  const { data: allData = [], isLoading, error: queryError } = useQuery({
    queryKey: ANALYTICS_QUERY_KEY,
    queryFn: __DEV__ && USE_MOCK_DATA ? generateMockData : fetchAnalyticsData,
  });

  const error = queryError ? "Failed to load analytics data" : null;

  const filtered = useMemo(
    () =>
      filterDonations(
        allData,
        timeFilter,
        donationType,
        customStartDate,
        customEndDate,
      ),
    [allData, timeFilter, donationType, customStartDate, customEndDate],
  );

  const dateRange = useMemo(
    () => getDateRange(timeFilter, customStartDate, customEndDate),
    [timeFilter, customStartDate, customEndDate],
  );

  const metrics = useMemo(() => {
    const { start } = dateRange;

    const donations = filtered.length;

    const newDonatorIds = new Set<string>();
    filtered.forEach((d) => {
      if (d.donorId && d.donorCreatedAt) {
        const donorCreated = new Date(d.donorCreatedAt);
        if (donorCreated >= start) {
          newDonatorIds.add(d.donorId);
        }
      }
    });
    const newDonators = newDonatorIds.size;

    const moneyCollected = filtered
      .filter((d) => d.category === "money" && d.type === "incoming")
      .reduce((sum, d) => sum + d.amount, 0);

    const typeBreakdown = {
      money: filtered.filter((d) => d.category === "money").length,
      clothes: filtered.filter((d) => d.category === "clothes").length,
      books: filtered.filter((d) => d.category === "books").length,
      others: filtered.filter((d) => d.category === "other_items").length,
    };

    const chartData = groupByDate(filtered);

    return {
      donations,
      newDonators,
      moneyCollected,
      typeBreakdown,
      chartData,
    };
  }, [filtered, dateRange]);

  const graphChartData = useMemo(() => {
    if (graphMetric === "total") {
      return metrics.chartData;
    }

    if (graphMetric === "newDonators") {
      const { start, end } = dateRange;
      const donorMap = new Map<string, string>();
      filtered.forEach((d) => {
        if (d.donorId && d.donorCreatedAt) {
          const created = new Date(d.donorCreatedAt);
          if (created >= start && created <= end) {
            const existing = donorMap.get(d.donorId);
            if (!existing || d.donorCreatedAt < existing) {
              donorMap.set(d.donorId, d.donorCreatedAt);
            }
          }
        }
      });

      const dateMap = new Map<string, number>();
      donorMap.forEach((createdAt) => {
        const date = new Date(createdAt).toISOString().split("T")[0];
        dateMap.set(date, (dateMap.get(date) || 0) + 1);
      });

      return Array.from(dateMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    const typeFiltered =
      graphType === "all"
        ? filtered
        : filtered.filter((d) => d.category === graphType);
    return groupByDate(typeFiltered);
  }, [graphMetric, graphType, filtered, dateRange, metrics.chartData]);

  const setCustomDateRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setTimeFilter("custom");
  };

  return {
    loading: isLoading,
    error,
    ...metrics,
    timeFilter,
    donationType,
    customStartDate,
    customEndDate,
    setTimeFilter,
    setDonationType,
    setCustomDateRange,
    graphMetric,
    graphType,
    setGraphMetric,
    setGraphType,
    graphChartData,
  };
};
