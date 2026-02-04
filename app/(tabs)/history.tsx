import EmptyState from "@/components/atoms/EmptyState";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
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
import { useServiceRecords } from "@/hooks/useServiceRecords";
import { useRouter } from "expo-router";

const CATEGORY_LABELS: Record<string, string> = {
  home_appliances: "Home Appliances",
  vehicles: "Vehicles",
  entertainment: "Entertainment",
  computing: "Computing",
  security: "Security & Smart",
  other: "Other",
};

const DATE_LABELS: Record<string, string> = {
  last30: "Last 30 Days",
  last90: "Last 90 Days",
  thisYear: "This Year",
};

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: services = [] } = useServiceRecords();
  const [search, setSearch] = useState("");

  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>(null);

  // Dynamic filters based on selection
  const filters = useMemo(() => [
    {
      id: "category",
      label: selectedCategories.length > 0
        ? CATEGORY_LABELS[selectedCategories[0]]
        : "Category",
      isActive: selectedCategories.length > 0
    },
    {
      id: "byDate",
      label: dateFilter
        ? DATE_LABELS[dateFilter]
        : "by Date",
      isActive: !!dateFilter
    },
  ], [selectedCategories, dateFilter]);

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

    if (id === "all") {
      setSelectedCategories([]);
      setDateFilter(null);
    }
  }, []);

  const handleCategoryApply = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const handleDateApply = useCallback((value: DateFilterType) => {
    setDateFilter(value);
  }, []);

  const handleDateClear = useCallback(() => {
    setDateFilter(null);
  }, []);

  const handleRemoveFilter = useCallback((id: string) => {
    if (id === "category") {
      setSelectedCategories([]);
    } else if (id === "byDate") {
      setDateFilter(null);
    }
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
          onRemoveFilter={handleRemoveFilter}
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
            <EmptyState
              title="History is empty"
              subtitle="Your completed maintenance records will appear here"
            />
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
    flexGrow: 1,
  },

  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.neutral.black,
  }
});
