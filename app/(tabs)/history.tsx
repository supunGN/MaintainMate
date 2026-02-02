import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PageHeader from "@/components/molecules/PageHeader";
import ServiceHistoryCard from "@/components/molecules/ServiceHistoryCard";
import CategoryFilterModal from "@/components/organisms/CategoryFilterModal";
import DateFilterModal, {
    DateFilterType,
} from "@/components/organisms/DateFilterModal";
import SearchFilterHeader from "@/components/organisms/SearchFilterHeader";

import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { useServiceRecords } from "@/hooks/useServiceRecords";
import { useRouter } from "expo-router";

/* ---------------- FILTER TABS ---------------- */
const INITIAL_FILTERS = [
  { id: "all", label: "All", isActive: true },
  { id: "category", label: "Category", isActive: false },
  { id: "byDate", label: "by Date", isActive: false },
];

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: services = [] } = useServiceRecords();
  
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>(null);

  // Parse date from service record format (MM - DD - YYYY)
  const parseDate = useCallback((dateStr: string) => {
    const [month, day, year] = dateStr.split(' - ').map(Number);
    return new Date(year, month - 1, day);
  }, []);

  // Filter history records (only past dates)
  const historyRecords = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return services.filter(s => parseDate(s.date) <= today);
  }, [services, parseDate]);

  /* ---------------- FILTERED DATA ---------------- */
  const filteredHistory = useMemo(() => {
    let filtered = historyRecords.filter((item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase()),
    );

    /* ---------------- CATEGORY FILTER ---------------- */
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category),
      );
    }

    /* ---------------- DATE FILTER ---------------- */
    if (dateFilter) {
      const now = new Date();

      filtered = filtered.filter((item) => {
        const itemDate = parseDate(item.date);

        switch (dateFilter) {
          case "last30":
            return itemDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

          case "last90":
            return itemDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

          case "thisMonth":
            return (
              itemDate.getMonth() === new Date().getMonth() &&
              itemDate.getFullYear() === new Date().getFullYear()
            );

          case "lastMonth":
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return (
              itemDate.getMonth() === lastMonth.getMonth() &&
              itemDate.getFullYear() === lastMonth.getFullYear()
            );

          case "last6Months":
            return itemDate >= new Date(new Date().setMonth(now.getMonth() - 6));

          case "thisYear":
            return itemDate.getFullYear() === new Date().getFullYear();

          default:
            return true;
        }
      });
    }

    return filtered;
  }, [historyRecords, search, selectedCategories, dateFilter, parseDate]);

  const handleFilterPress = useCallback((id: string) => {
    if (id === "category") {
      setCategoryModalVisible(true);
      return;
    }

    if (id === "byDate") {
      setDateModalVisible(true);
      return;
    }

    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        isActive: f.id === id,
      })),
    );

    if (id === "all") {
      setSelectedCategories([]);
      setDateFilter(null);
    }
  }, []);

  const handleCategoryApply = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        isActive: f.id === "category",
      })),
    );
  }, []);

  const handleDateApply = useCallback((value: DateFilterType) => {
    setDateFilter(value);
    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        isActive: f.id === "byDate",
      })),
    );
  }, []);

  const handleDateClear = useCallback(() => {
    setDateFilter(null);
    setFilters((prev) =>
      prev.map((f) => ({
        ...f,
        isActive: f.id === "all",
      })),
    );
  }, []);

  const handleItemPress = useCallback((item: any) => {
    router.push({
      pathname: '/history-details/[id]',
      params: { id: item.id },
    });
  }, [router]);

  const handleCloseCategoryModal = useCallback(() => {
    setCategoryModalVisible(false);
  }, []);

  const handleCloseDateModal = useCallback(() => {
    setDateModalVisible(false);
  }, []);

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {/* Header */}
        <PageHeader title="History" />

      {/* Search + Filters */}
      <SearchFilterHeader
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search for service"
        filters={filters}
        onFilterPress={handleFilterPress}
      />

      {/* History List */}
      <FlatList
        data={filteredHistory}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <ServiceHistoryCard
            item={{
              title: item.itemName,
              category: item.category,
              date: item.date,
              cost: parseFloat(item.cost),
              image: item.image,
            }}
            onPress={() => handleItemPress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>History is empty</Text>
          </View>
        }
      />

      {/* Category Modal */}
      <CategoryFilterModal
        visible={categoryModalVisible}
        initialSelected={selectedCategories}
        onApply={handleCategoryApply}
        onClose={handleCloseCategoryModal}
      />

      {/* Date Modal */}
      <DateFilterModal
        visible={dateModalVisible}
        selected={dateFilter}
        onApply={handleDateApply}
        onClear={handleDateClear}
        onClose={handleCloseDateModal}
      />
    </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  header: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.xl,
    marginTop: Spacing.xxl,
    paddingBottom: Spacing.sm,
  },
  contentContainer: {
    padding: Spacing.screenHorizontal,
    paddingBottom: 120,
  },
  placeholder: {
    alignItems: "center",
    paddingVertical: 120,
  },
  placeholderText: {
    fontSize: Typography.fontSize.h2,
    fontWeight: "bold",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral.black,
  }
});
